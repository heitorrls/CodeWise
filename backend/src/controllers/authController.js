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
// --- LOGIN COM GOOGLE ---
exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body; 

        if (!credential) {
            return res.status(400).json({ error: "Token do Google não fornecido." });
        }

        // 1. Valida a integridade do token com os servidores do Google
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        // 2. Extrai os dados do usuário diretamente do Google
        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        // 3. Verifica se o e-mail já está cadastrado (USANDO CALLBACK PARA MANTER O PADRÃO)
        User.findByEmail(email, async (err, userResult) => {
            if (err) return res.status(500).json({ message: "Erro ao consultar banco de dados." });

            let user = userResult;
            if (Array.isArray(userResult) && userResult.length > 0) user = userResult[0];

            // 4. REGRA DE NEGÓCIO: Silent Signup (Criação automática se não existir)
            if (!user || (Array.isArray(userResult) && userResult.length === 0)) {
                console.log("Novo usuário detectado via Google. Criando conta...");

                const randomPassword = Math.random().toString(36).slice(-16) + googleId;
                const hashedPassword = await bcrypt.hash(randomPassword, 10);

                // Como o Google não devolve 'username', usamos o 'name' ou a primeira parte do email
                const username = name || email.split('@')[0];

                // Usando o formato padrão do seu User.create
                User.create(email, username, hashedPassword, (err, insertId) => {
                    if (err) {
                        console.error("Erro ao criar usuário via Google:", err);
                        return res.status(500).json({ message: "Erro ao cadastrar usuário." });
                    }

                    // Monta o objeto do novo usuário
                    const newUser = { id: insertId, email, username };
                    const token = generateAppToken(newUser);

                    return res.status(200).json({
                        success: true,
                        message: "Conta criada e login realizado via Google!",
                        token: token,
                        user: newUser
                    });
                });

            } else {
                // Usuário já existe, apenas gera o token e loga!
                const token = generateAppToken(user);

                // Registra histórico de login, assim como na função login padrão
                LoginHistory.logVisit(user.id, (err) => {
                    if (err) console.error("Erro ao registrar histórico de login:", err);
                });

                return res.status(200).json({
                    success: true,
                    message: "Login via Google realizado com sucesso!",
                    token: token,
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        leveling_completed: user.leveling_completed,
                        level: user.level,
                        tipo: user.tipo || 'aluno'
                    }
                });
            }
        });

    } catch (error) {
        console.error("Erro na autenticação via Google:", error);
        return res.status(401).json({ error: "Falha ao autenticar com o Google. Token inválido ou expirado." });
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