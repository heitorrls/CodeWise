const User = require("../models/User");
const LoginHistory = require("../models/LoginHistory");
const PasswordReset = require("../models/PasswordReset");
const bcrypt = require("bcryptjs");

const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- FUNÇÃO AUXILIAR: GERAR TOKEN JWT ---
// Agora centralizamos a geração do token para usar em qualquer lugar
const generateAppToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // O token expira em 7 dias
    );
};

// --- LOGIN COM GOOGLE ---
exports.googleLogin = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, message: 'Token não fornecido.' });
    }

    try {
        // 1. Verifica token com o Google
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        // 2. Extrair dados
        const payload = ticket.getPayload();
        const { email, name } = payload; // O Google devolve 'name', vamos usar como 'username'

        // 3. Adaptando para o seu modelo User.js (Callbacks -> Promises)
        const findUser = () => new Promise((resolve, reject) => {
            User.findByEmail(email, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const createUser = () => new Promise((resolve, reject) => {
            const fakePassword = 'google_login_no_password'; // Senha falsa pois o login é via Google
            
            // Usamos a mesma assinatura do seu signup tradicional: (email, username, password, callback)
            User.create(email, name, fakePassword, (err, insertId) => {
                if (err) reject(err);
                else resolve({ id: insertId, email: email, username: name }); 
            });
        });

        // Executar a busca
        let user = await findUser();

        // Tratamento para garantir que pegamos o usuário corretamente
        if (!user || (Array.isArray(user) && user.length === 0)) {
            user = await createUser();
        } else if (Array.isArray(user)) {
            user = user[0];
        }

        // 4. Gerar o token JWT do CodeWise
        const appToken = generateAppToken(user);

        // 5. Devolver sucesso
        return res.status(200).json({
            success: true,
            token: appToken, // Token JWT gerado
            user: { id: user.id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error('Erro na validação do token do Google:', error);
        return res.status(401).json({ success: false, message: 'Token do Google inválido ou expirado.' });
    }
};

// --- CADASTRO (SIGNUP) ---
exports.signup = (req, res) => {
  const { email, username, password } = req.body;
  
  if (!email || !username || !password) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  User.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: "Erro interno no servidor." });
    
    // Verifica duplicidade no array caso retorne array vazio ou populado
    if (user && (!Array.isArray(user) || user.length > 0)) {
      return res.status(409).json({ message: "Este email já está cadastrado." });
    }

    User.create(email, username, password, (err, userId) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
           const message = err.sqlMessage.includes('username') 
             ? "Este nome de usuário já está em uso. Escolha outro." 
             : "Este email já está em uso.";
           return res.status(409).json({ message });
        }
        return res.status(500).json({ message: "Erro ao cadastrar usuário." });
      }

      // Opcional: Gerar token já no cadastro para auto-login
      const token = generateAppToken({ id: userId, email: email });

      return res.status(201).json({ 
        message: "Cadastro realizado com sucesso!", 
        token: token,
        userId: userId 
      });
    });
  });
};

// --- LOGIN TRADICIONAL ---
exports.login = (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  User.findByEmail(email, (err, userResult) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    
    let user = userResult;
    if (Array.isArray(userResult) && userResult.length > 0) user = userResult[0];
    
    if (!user || Array.isArray(userResult) && userResult.length === 0) {
      return res.status(401).json({ message: "Email ou senha inválidos." });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Email ou senha inválidos." });
    }

    LoginHistory.logVisit(user.id, (err) => {
        if (err) console.error("Erro ao registrar histórico de login:", err);
    });

    // AQUI ESTAVA FALTANDO: Gerar o token no login normal!
    const token = generateAppToken(user);

    res.json({
      success: true,
      message: "Login realizado com sucesso!",
      token: token, // Enviando o token para o frontend
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        leveling_completed: user.leveling_completed,
        level: user.level,
        tipo: user.tipo || 'aluno'
      },
    });
  });
};

// --- RECUPERAÇÃO DE SENHA ---
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Por favor, digite seu email." });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  PasswordReset.create(email, code, expires, (err, insertId) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });

    console.log(`Código de redefinição para ${email}: ${code}`); 

    res.status(200).json({ message: "Se o email estiver cadastrado, um código foi enviado." });
  });
};

exports.verifyCode = (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ message: "Email e código são obrigatórios." });

  PasswordReset.findByEmailAndCode(email, code, (err, resetRequest) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (!resetRequest || (Array.isArray(resetRequest) && resetRequest.length === 0)) {
      return res.status(400).json({ message: "Código inválido ou expirado." });
    }
    res.status(200).json({ message: "Código verificado com sucesso." });
  });
};

exports.resetPassword = (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) return res.status(400).json({ message: "Todos os campos são obrigatórios." });

  PasswordReset.findByEmailAndCode(email, code, (err, resetRequest) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (!resetRequest || (Array.isArray(resetRequest) && resetRequest.length === 0)) {
      return res.status(400).json({ message: "Código inválido ou expirado." });
    }

    User.updatePasswordByEmail(email, newPassword, (err, affectedRows) => {
      if (err) return res.status(500).json({ message: "Erro ao atualizar senha." });
      if (affectedRows === 0) return res.status(404).json({ message: "Usuário não encontrado." });

      PasswordReset.delete(email, code, (err) => {
        if (err) console.error("Erro ao deletar código:", err);
      });

      res.status(200).json({ message: "Senha alterada com sucesso!" });
    });
  });
};