const User = require("../models/User");
const LoginHistory = require("../models/LoginHistory");
const PasswordReset = require("../models/PasswordReset");
const bcrypt = require("bcryptjs");

// --- CADASTRO (SIGNUP) COM CORREÇÃO DE DUPLICIDADE ---
exports.signup = (req, res) => {
  const { email, username, password } = req.body;
  
  // Validação básica
  if (!email || !username || !password) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  User.findByEmail(email, (err, user) => {
    if (err) {
      console.error("Erro ao verificar email:", err);
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
    
    if (user) {
      return res.status(409).json({ message: "Este email já está cadastrado." });
    }

    // Tenta criar o usuário
    User.create(email, username, password, (err, userId) => {
      if (err) {
        console.error("Erro detalhado do MySQL:", err);

        // Tratamento do erro de duplicidade (username ou email)
        if (err.code === 'ER_DUP_ENTRY') {
           const message = err.sqlMessage.includes('username') 
             ? "Este nome de usuário já está em uso. Escolha outro." 
             : "Este email já está em uso.";
           return res.status(409).json({ message });
        }

        return res.status(500).json({ message: "Erro ao cadastrar usuário." });
      }

      return res.status(201).json({ 
        message: "Cadastro realizado com sucesso!", 
        userId 
      });
    });
  });
};

// --- LOGIN ---
exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Preencha todos os campos." });

  User.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    
    // Verifica se usuário existe
    if (!user)
      return res.status(401).json({ message: "Email ou senha inválidos." });

    // Compara a senha enviada com o hash salvo
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Email ou senha inválidos." });

    LoginHistory.logVisit(user.id, (err) => {
        if (err) console.error("Erro ao registrar histórico de login:", err);
        // Não impedimos o login se der erro no log, apenas avisamos no console
    });
    // Retorna sucesso e dados do usuário (incluindo nivelamento e tipo se houver)
    res.json({
      message: "Login realizado com sucesso!",
      user: {
        id: user.id,
        email: user.email,
        username: user.username, // Adicionado username para o frontend
        leveling_completed: user.leveling_completed,
        level: user.level,
        tipo: user.tipo || 'aluno' // Suporte ao novo campo do seu DB
      },
    });
  });
};

// --- RECUPERAÇÃO DE SENHA ---

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: "Por favor, digite seu email." });

  // Gera um código de 6 dígitos
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Define a expiração (ex: 10 minutos)
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  PasswordReset.create(email, code, expires, (err, insertId) => {
    if (err) {
      console.error("Erro ao salvar código:", err);
      return res.status(500).json({ message: "Erro no servidor." });
    }

    console.log(`Código de redefinição para ${email}: ${code}`); // Log para teste local

    res.status(200).json({
      message: "Se o email estiver cadastrado, um código foi enviado.",
    });
  });
};

exports.verifyCode = (req, res) => {
  const { email, code } = req.body;
  if (!email || !code)
    return res.status(400).json({ message: "Email e código são obrigatórios." });

  PasswordReset.findByEmailAndCode(email, code, (err, resetRequest) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });

    if (!resetRequest) {
      return res.status(400).json({ message: "Código inválido ou expirado." });
    }

    res.status(200).json({ message: "Código verificado com sucesso." });
  });
};

exports.resetPassword = (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  // 1. Verifica se o código ainda é válido
  PasswordReset.findByEmailAndCode(email, code, (err, resetRequest) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (!resetRequest)
      return res.status(400).json({ message: "Código inválido ou expirado." });

    // 2. Atualiza a senha no banco de usuários
    User.updatePasswordByEmail(email, newPassword, (err, affectedRows) => {
      if (err)
        return res.status(500).json({ message: "Erro ao atualizar senha." });
      if (affectedRows === 0)
        return res.status(404).json({ message: "Usuário não encontrado." });

      // 3. Deleta o código usado
      PasswordReset.delete(email, code, (err) => {
        if (err) console.error("Erro ao deletar código:", err);
      });

      res.status(200).json({ message: "Senha alterada com sucesso!" });
    });
  });
};