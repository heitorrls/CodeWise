const User = require("../models/User");

exports.updateUserProfile = (req, res) => {
  const { id, username, email } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID do usuário é obrigatório." });
  }

  if (username === undefined && email === undefined) {
    return res
      .status(400)
      .json({ message: "Informe username e/ou email para atualizar." });
  }

  User.updateById(id, { username, email }, (err, affectedRows) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        const field = err.sqlMessage && err.sqlMessage.includes("email")
          ? "Email"
          : "Nome de usuário";
        return res.status(409).json({ message: `${field} já cadastrado.` });
      }
      return res.status(500).json({ message: "Erro ao atualizar dados." });
    }

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(200).json({ message: "Dados atualizados com sucesso." });
  });
};

// Altera a senha do usuário (valida senha atual)
const bcrypt = require("bcryptjs");
exports.changePassword = (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "Email, senha atual e nova senha são obrigatórios." });
  }

  // Busca usuário por email
  const User = require("../models/User");
  User.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    const isMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Senha atual incorreta." });
    }

    // Atualiza para a nova senha
    User.updatePasswordByEmail(email, newPassword, (err2, affected) => {
      if (err2) return res.status(500).json({ message: "Erro ao atualizar a senha." });
      if (affected === 0) return res.status(404).json({ message: "Usuário não encontrado." });
      return res.status(200).json({ message: "Senha alterada com sucesso." });
    });
  });
};
