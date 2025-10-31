const User = require("../models/User");
const UserProfile = require("../models/UserProfile"); // Importa o novo model
const PasswordReset = require("../models/PasswordReset"); // Importa o novo model
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password)
    return res.status(400).json({ message: "Preencha todos os campos." });

  User.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (user) return res.status(409).json({ message: "Email já cadastrado." });

    // 1. Cria o usuário
    User.create(email, username, password, (err, userId) => {
      if (err)
        return res.status(500).json({ message: "Erro ao cadastrar usuário." });

      // 2. Cria o perfil padrão para o usuário
      UserProfile.create(userId, (err, profileId) => {
        if (err) {
          // Se falhar aqui, idealmente deveríamos deletar o usuário criado (rollback)
          // Mas por simplicidade, apenas reportamos o erro.
          return res
            .status(500)
            .json({ message: "Erro ao criar perfil do usuário." });
        }

        // Atualiza o username no perfil, se a coluna existir
        if (typeof UserProfile.updateUsername === 'function') {
          UserProfile.updateUsername(userId, username, () => {});
        }

        // 3. Responde com sucesso
        res
          .status(201)
          .json({ message: "Cadastro realizado com sucesso!", userId });
      });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Preencha todos os campos." });

  User.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (!user)
      return res.status(401).json({ message: "Email ou senha inválidos." }); // Mensagem genérica

    // Compara a senha enviada com o hash salvo
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Email ou senha inválidos." }); // Mensagem genérica

    res.json({
      message: "Login realizado com sucesso!",
      user: { id: user.id, email: user.email },
    });
  });
};

// --- NOVAS FUNÇÕES DE REDEFINIÇÃO DE SENHA ---

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: "Por favor, digite seu email." });

  // Gera um código de 6 dígitos
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Define a expiração (ex: 10 minutos a partir de agora)
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  PasswordReset.create(email, code, expires, (err, insertId) => {
    if (err) {
      console.error("Erro ao salvar código:", err);
      return res.status(500).json({ message: "Erro no servidor." });
    }

    // Em um app real, você enviaria o 'code' por email aqui.
    // Ex: sendEmail(email, 'Seu código de redefinição é: ' + code);

    console.log(`Código de redefinição para ${email}: ${code}`); // Log para depuração

    // Por segurança, não confirme se o email existe ou não.
    res
      .status(200)
      .json({
        message: "Se o email estiver cadastrado, um código foi enviado.",
      });
  });
};

exports.verifyCode = (req, res) => {
  const { email, code } = req.body;
  if (!email || !code)
    return res
      .status(400)
      .json({ message: "Email e código são obrigatórios." });

  PasswordReset.findByEmailAndCode(email, code, (err, resetRequest) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });

    if (!resetRequest) {
      return res.status(400).json({ message: "Código inválido ou expirado." });
    }

    // O código é válido
    res.status(200).json({ message: "Código verificado com sucesso." });
  });
};

exports.resetPassword = (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
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

      // 3. Deleta o código para que não possa ser usado novamente
      PasswordReset.delete(email, code, (err) => {
        if (err) console.error("Erro ao deletar código:", err);
        // Continua mesmo se falhar em deletar, pois a senha já foi alterada.
      });

      res.status(200).json({ message: "Senha alterada com sucesso!" });
    });
  });
};
