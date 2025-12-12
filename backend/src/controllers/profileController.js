const UserProfile = require("../models/UserProfile");
const Inventory = require("../models/Inventory");
const Lives = require("../models/Lives");
const { MAX_LIVES } = require("../models/Lives");

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

  UserProfile.ensureProfile(userId, null, (errEnsure) => {
    if (errEnsure) {
      console.error("Erro ao garantir perfil:", errEnsure);
    }
    UserProfile.updateAvatar(userId, avatar, (err, affected) => {
      if (err) {
        console.error("Erro ao atualizar avatar:", err);
        return res.status(500).json({ message: "Erro ao salvar avatar." });
      }
      res.status(200).json({ message: "Avatar atualizado com sucesso." });
    });
  });
};

// Busca dados básicos do perfil
exports.getProfile = (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "ID do usuário é obrigatório." });
  }

  UserProfile.ensureProfile(userId, null, (errEnsure) => {
    if (errEnsure) {
      console.error("Erro ao garantir perfil:", errEnsure);
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
  });
};

// Atualiza moedas (delta positivo adiciona, negativo subtrai)
exports.updateCoins = (req, res) => {
  const { userId, delta } = req.body;
  if (!userId || typeof delta !== "number") {
    return res
      .status(400)
      .json({ message: "userId e delta (número) são obrigatórios." });
  }

  UserProfile.ensureProfile(userId, null, (errEnsure) => {
    if (errEnsure) console.error("Erro ao garantir perfil:", errEnsure);
    UserProfile.updateCoins(userId, delta, (err, newBalance) => {
      if (err) {
        console.error("Erro ao atualizar moedas:", err);
        if (err.code === "INSUFFICIENT_FUNDS") {
          return res.status(400).json({ message: "Saldo insuficiente." });
        }
        return res.status(500).json({ message: "Erro ao atualizar moedas." });
      }
      res
        .status(200)
        .json({ message: "Moedas atualizadas.", saldo: newBalance });
    });
  });
};

// Adiciona item ao inventário
exports.addInventoryItem = async (req, res) => {
  const { userId, tipo, nome, descricao, quantidade, meta } = req.body;
  if (!userId || !nome) {
    return res.status(400).json({ message: "userId e nome do item são obrigatórios." });
  }
  try {
    const insertId = await Inventory.addItem(userId, {
      tipo,
      nome,
      descricao,
      quantidade,
      meta: meta ? JSON.stringify(meta) : null,
    });
    res.status(200).json({ message: "Item adicionado ao inventário.", id: insertId });
  } catch (err) {
    console.error("Erro ao adicionar inventário:", err);
    res.status(500).json({ message: "Erro ao adicionar ao inventário." });
  }
};

exports.listInventory = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "userId é obrigatório." });
  try {
    const items = await Inventory.listByUser(userId);
    res.status(200).json(items);
  } catch (err) {
    console.error("Erro ao listar inventário:", err);
    res.status(500).json({ message: "Erro ao buscar inventário." });
  }
};

exports.consumeInventoryItem = async (req, res) => {
  const { userId, itemId } = req.body;
  if (!userId || !itemId) {
    return res.status(400).json({ message: "userId e itemId são obrigatórios." });
  }
  try {
    const remaining = await Inventory.consumeItem(userId, itemId);
    res.status(200).json({ message: "Item consumido.", remaining });
  } catch (err) {
    if (err.code === "NOT_FOUND") {
      return res.status(404).json({ message: "Item não disponível." });
    }
    console.error("Erro ao consumir item:", err);
    res.status(500).json({ message: "Erro ao consumir item." });
  }
};

// --- VIDAS ---
exports.getLives = (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "userId é obrigatório." });
  Lives.getState(userId, (err, state) => {
    if (err) {
      console.error("Erro ao obter vidas:", err);
      return res.status(500).json({ message: "Erro ao obter vidas." });
    }
    res.status(200).json({ lives: state.lives, max: MAX_LIVES });
  });
};

exports.consumeLife = (req, res) => {
  const { userId, amount } = req.body;
  if (!userId) return res.status(400).json({ message: "userId é obrigatório." });
  Lives.consume(userId, amount || 1, (err, state) => {
    if (err) {
      if (err.code === "NO_LIVES") {
        return res.status(400).json({ message: "Sem vidas suficientes." });
      }
      console.error("Erro ao consumir vida:", err);
      return res.status(500).json({ message: "Erro ao consumir vida." });
    }
    res.status(200).json({ lives: state.lives, max: MAX_LIVES });
  });
};

exports.refillLives = (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "userId é obrigatório." });
  Lives.updateLives(userId, { setTo: MAX_LIVES }, (err, state) => {
    if (err) {
      console.error("Erro ao recarregar vidas:", err);
      return res.status(500).json({ message: "Erro ao recarregar vidas." });
    }
    res.status(200).json({ lives: state.lives, max: MAX_LIVES });
  });
};
