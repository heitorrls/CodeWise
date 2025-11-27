const UserProfile = require("../models/UserProfile");

// Atualiza o nome de usuário
exports.updateUsername = (req, res) => {
  const { userId, username } = req.body; // Esperamos que o frontend envie o ID e o novo nome

  if (!userId || !username) {
    return res.status(400).json({ message: "ID do usuário e nome são obrigatórios." });
  }

  UserProfile.updateUsername(userId, username, (err, affectedRows) => {
    if (err) {
      console.error("Erro ao atualizar nome de usuário:", err);
      return res.status(500).json({ message: "Erro no servidor." });
    }

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Perfil de usuário não encontrado." });
    }

    res.status(200).json({ message: "Nome de usuário atualizado com sucesso!" });
  });
};

// Atualiza avatar (base64 ou URL)
exports.updateAvatar = (req, res) => {
  const { userId, avatar } = req.body;
  if (!userId || !avatar) {
    return res
      .status(400)
      .json({ message: "ID do usuário e avatar são obrigatórios." });
  }

  UserProfile.updateAvatar(userId, avatar, (err, affected) => {
    if (err) {
      console.error("Erro ao atualizar avatar:", err);
      return res.status(500).json({ message: "Erro ao salvar avatar." });
    }
    if (affected === 0) {
      return res.status(404).json({ message: "Perfil não encontrado." });
    }
    res.status(200).json({ message: "Avatar atualizado com sucesso." });
  });
};

// Busca dados básicos do perfil
exports.getProfile = (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "ID do usuário é obrigatório." });
  }

  UserProfile.findByUserId(userId, (err, profile) => {
    if (err) {
      console.error("Erro ao buscar perfil:", err);
      return res.status(500).json({ message: "Erro no servidor." });
    }
    if (!profile) {
      return res.status(404).json({ message: "Perfil não encontrado." });
    }
    res.status(200).json(profile);
  });
};
