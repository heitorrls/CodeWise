const User = require("../models/User");
const UserProfile = require("../models/UserProfile"); // Importa o novo model
const PasswordReset = require("../models/PasswordReset"); // Importa o novo model
const bcrypt = require("bcryptjs");
const db = require("../config/database"); // IMPORTADO PARA deleteAccount

// --- MODIFICADO: exports.signup ---
exports.signup = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Preencha todos os campos." });

  User.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (user) return res.status(409).json({ message: "Email já cadastrado." });

    // 1. Cria o usuário
    User.create(email, password, (err, userId) => {
      if (err)
        return res.status(500).json({ message: "Erro ao cadastrar usuário." });

      // 2. Cria o perfil padrão, usando a parte local do email como username
      const defaultUsername = email.split("@")[0];
      UserProfile.create(userId, defaultUsername, (err, profileId) => {
        if (err) {
          // Se falhar aqui, idealmente deveríamos deletar o usuário criado (rollback)
          // Mas por simplicidade, apenas reportamos o erro.
          return res
            .status(500)
            .json({ message: "Erro ao criar perfil do usuário." });
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

// --- FUNÇÕES DE REDEFINIÇÃO DE SENHA ---

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
    console.log(`Código de redefinição para ${email}: ${code}`); // Log para depuração

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
      });

      res.status(200).json({ message: "Senha alterada com sucesso!" });
    });
  });
};

// --- FUNÇÃO ADICIONADA NA ETAPA ANTERIOR (Excluir Conta) ---
exports.deleteAccount = (req, res) => {
  // ATENÇÃO: Em um app real, o userId deveria vir de uma sessão autenticada (ex: JWT),
  // não do req.body, para segurança.
  const { userId, email } = req.body;

  if (!userId || !email) {
    return res
      .status(400)
      .json({ message: "ID do usuário e email são obrigatórios." });
  }

  // 1. Deleta registros de redefinição de senha
  db.query(
    "DELETE FROM password_resets WHERE email = ?",
    [email],
    (err, resetResult) => {
      if (err) {
        console.error("Erro ao limpar password_resets:", err);
        // Continua mesmo se falhar, a exclusão do usuário é mais importante.
      }

      // 2. Deleta o usuário (isso vai acionar o ON DELETE CASCADE para user_profiles)
      User.deleteById(userId, (err, affectedRows) => {
        if (err)
          return res.status(500).json({ message: "Erro ao excluir usuário." });
        if (affectedRows === 0)
          return res.status(404).json({ message: "Usuário não encontrado." });

        res.status(200).json({ message: "Conta excluída com sucesso." });
      });
    }
  );
};

// --- NOVAS FUNÇÕES: Buscar e Atualizar Perfil ---
exports.getProfile = (req, res) => {
  // Em um app real, o ID viria de um token JWT/Sessão.
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: "ID do usuário é obrigatório." });
  }

  let responseData = {};

  // 1. Busca dados do User (email)
  User.findById(userId, (err, user) => {
    if (err)
      return res.status(500).json({ message: "Erro ao buscar usuário." });
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });

    responseData.email = user.email;

    // 2. Busca dados do UserProfile (username)
    UserProfile.findByUserId(userId, (err, profile) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Erro ao buscar perfil." });

      // Se o perfil existir, usa o username. Senão, fallback.
      responseData.username = profile
        ? profile.username
        : `User${userId}`;

      res.status(200).json(responseData);
    });
  });
};

exports.updateProfile = (req, res) => {
  // ATENÇÃO: userId deve vir de uma sessão/token seguro.
  const { userId, username, email } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "ID do usuário é obrigatório." });
  }
  if (!username && !email) {
    return res.status(400).json({ message: "Nenhum dado para atualizar." });
  }

  const tasks = [];

  // Tarefa 1: Atualizar Username (se fornecido)
  if (username) {
    tasks.push(
      new Promise((resolve, reject) => {
        UserProfile.updateUsername(userId, username, (err, affectedRows) => {
          if (err) return reject(new Error("Erro ao atualizar nome de usuário."));
          if (affectedRows === 0)
            return reject(new Error("Perfil não encontrado."));
          resolve();
        });
      })
    );
  }

  // Tarefa 2: Atualizar Email (se fornecido)
  if (email) {
    tasks.push(
      new Promise((resolve, reject) => {
        User.updateEmailByUserId(userId, email, (err, affectedRows) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return reject(new Error("Este email já está em uso."));
            }
            return reject(new Error("Erro ao atualizar email."));
          }
          if (affectedRows === 0)
            return reject(new Error("Usuário não encontrado."));
          resolve();
        });
      })
    );
  }

  // Executa todas as tarefas pendentes
  Promise.all(tasks)
    .then(() => {
      res.status(200).json({ message: "Perfil atualizado com sucesso!" });
    })
    .catch((error) => {
      // Envia a mensagem de erro específica (ex: "Email já em uso")
      res.status(500).json({ message: error.message });
    });
};