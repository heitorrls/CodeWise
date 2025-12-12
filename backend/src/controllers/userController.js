const User = require("../models/User");
const UserProfile = require("../models/UserProfile");

exports.updateUserProfile = (req, res) => {
  const idParam = req.params.id;
  const { id: idBody, username, email } = req.body;
  const id = idParam || idBody;

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

    // Sincroniza também o username no perfil, quando enviado
    if (username !== undefined) {
      UserProfile.ensureProfile(id, username, (ensureErr) => {
        if (ensureErr) {
          console.error("Erro ao garantir perfil ao atualizar username:", ensureErr);
          return;
        }
        UserProfile.updateUsername(id, username, (profileErr) => {
          if (profileErr) {
            console.error("Erro ao sincronizar username no perfil:", profileErr);
          }
        });
      });
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
  if (typeof newPassword !== "string" || newPassword.length < 6) {
    return res.status(400).json({ message: "A nova senha deve ter pelo menos 6 caracteres." });
  }

  // Busca usuário por email
  User.findByEmail(email, (err, user) => {
    if (err) {
      console.error("Erro ao buscar usuário para troca de senha:", err);
      return res.status(500).json({ message: "Erro no servidor ao buscar usuário.", detail: err.message });
    }
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });
    if (!user.password) {
      console.error("Hash da senha não encontrado para o usuário:", email);
      return res.status(500).json({ message: "Erro ao validar a senha atual." });
    }

    let isMatch = false;
    try {
      isMatch = bcrypt.compareSync(currentPassword, user.password);
    } catch (compareError) {
      console.error("Erro ao comparar senha atual:", compareError);
      return res.status(500).json({ message: "Erro ao validar a senha atual.", detail: compareError.message });
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Senha atual incorreta." });
    }

    // Atualiza para a nova senha
    User.updatePasswordByEmail(email, newPassword, (err2, affected) => {
      if (err2) {
        console.error("Erro ao atualizar a senha:", err2);
        return res.status(500).json({ message: "Erro ao atualizar a senha.", detail: err2.message });
      }
      if (affected === 0) return res.status(404).json({ message: "Usuário não encontrado." });
      return res.status(200).json({ message: "Senha alterada com sucesso." });
    });
  });
};

// Exclui usuário por ID
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID do usuário é obrigatório." });
  }

  User.deleteById(id, (err, affectedRows) => {
    if (err) {
      console.error("Erro ao excluir usuário:", err);
      return res.status(500).json({ message: "Erro ao excluir o usuário." });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    return res.status(200).json({ message: "Usuário excluído com sucesso." });
  });
};
