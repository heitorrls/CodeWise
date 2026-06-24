const UserProfile = require("../models/UserProfile");
const Inventory = require("../models/Inventory");
const Lives = require("../models/Lives");
const { MAX_LIVES } = require("../models/Lives");
const {
  Economy,
  MIN_LESSON_PASS_PERCENTAGE,
} = require("../models/Economy");
const Progress = require("../models/Progress");
const ActivityAnswer = require("../models/ActivityAnswer");
const { getActivityDefinition } = require("../services/activityCatalog");

const STORE_CATALOG = {
  "Recarga de Vidas": {
    tipo: "utilizavel",
    descricao: "Recarrega todas as vidas.",
    preco: 50,
    meta: null,
  },
  "Moldura Dourada": {
    tipo: "decoracao",
    descricao: "Moldura dourada para a foto de perfil.",
    preco: 200,
    meta: { decorationType: "moldura-dourada" },
  },
  "Overlay Estelar": {
    tipo: "decoracao",
    descricao: "Overlay de estrelas para a foto de perfil.",
    preco: 250,
    meta: { decorationType: "overlay-estelar" },
  },
};

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

// Atualiza a foto de perfil (base64 ou URL), quando o banco oferece esse campo.
exports.updateProfilePhoto = (req, res) => {
  const { userId, foto_perfil: profilePhoto } = req.body;
  if (!userId || !profilePhoto) {
    return res
      .status(400)
      .json({ message: "ID do usuário e foto de perfil são obrigatórios." });
  }

  UserProfile.ensureProfile(userId, null, (errEnsure) => {
    if (errEnsure) {
      console.error("Erro ao garantir perfil:", errEnsure);
    }
    UserProfile.updateProfilePhoto(userId, profilePhoto, (err) => {
      if (err) {
        if (err.code === "PROFILE_PHOTO_UNAVAILABLE") {
          return res.status(501).json({
            message: "O banco atual não possui armazenamento de foto de perfil.",
          });
        }
        console.error("Erro ao atualizar foto de perfil:", err);
        return res.status(500).json({ message: "Erro ao salvar foto de perfil." });
      }
      res.status(200).json({ message: "Foto de perfil atualizada com sucesso." });
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

exports.purchaseInventoryItem = async (req, res) => {
  const { userId, nome } = req.body;
  const catalogItem = STORE_CATALOG[nome];

  if (!userId || !nome || !catalogItem) {
    return res.status(400).json({
      message: "Item da loja inválido.",
    });
  }

  try {
    if (nome === "Recarga de Vidas") {
      const purchase = await Economy.purchaseLifeRefill(
        userId,
        catalogItem.preco
      );
      return res.status(200).json({
        message: "Vidas recarregadas.",
        saldo: purchase.saldo,
        lives: purchase.lives,
        max: purchase.max,
      });
    }

    const purchase = await Inventory.purchaseItem(
      userId,
      {
        tipo: catalogItem.tipo,
        nome,
        descricao: catalogItem.descricao,
        meta: catalogItem.meta ? JSON.stringify(catalogItem.meta) : null,
      },
      catalogItem.preco
    );
    res.status(200).json({
      message: "Compra realizada.",
      itemId: purchase.itemId,
      saldo: purchase.saldo,
    });
  } catch (err) {
    if (err.code === "INSUFFICIENT_FUNDS") {
      return res.status(400).json({ message: "Saldo insuficiente." });
    }
    if (err.code === "ALREADY_OWNED") {
      return res.status(409).json({ message: "Decoração já adquirida." });
    }
    if (err.code === "LIVES_FULL") {
      return res.status(409).json({ message: "Suas vidas já estão cheias." });
    }
    console.error("Erro ao comprar item:", err);
    res.status(500).json({ message: "Erro ao realizar compra." });
  }
};

exports.rewardLesson = async (req, res) => {
  const {
    userId,
    moduleId,
    lessonIndex,
  } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId é obrigatório." });
  }

  try {
    const activity = getActivityDefinition(moduleId, lessonIndex);

    if (!activity) {
      return res.status(400).json({
        message: "Atividade inválida.",
      });
    }

    const summary = await ActivityAnswer.getSummary({
      userId,
      moduleId,
      lessonIndex,
      totalQuestions: activity.totalQuestions,
    });

    if (summary.answered < summary.total) {
      return res.status(409).json({
        message: "Ainda existem questões sem resposta registrada.",
        answered: summary.answered,
        totalQuestions: summary.total,
      });
    }

    let result;
    try {
      result = await Economy.rewardLessonCompletion({
        userId,
        moduleId,
        lessonIndex,
        correctCount: summary.correct,
        totalQuestions: activity.totalQuestions,
      });
    } catch (error) {
      if (error.code === "MIN_SCORE_NOT_REACHED") {
        return res.status(409).json({
          message: `Pontuação mínima de ${MIN_LESSON_PASS_PERCENTAGE}% não atingida.`,
          code: error.code,
          correctCount: summary.correct,
          wrongCount: summary.wrong,
          totalQuestions: summary.total,
          percentage: summary.percentage,
          minPercentage: MIN_LESSON_PASS_PERCENTAGE,
        });
      }

      throw error;
    }

    await ActivityAnswer.markCompletion({
      userId,
      moduleId,
      lessonIndex,
      totalQuestions: summary.total,
      correctCount: summary.correct,
      wrongCount: summary.wrong,
      percentage: summary.percentage,
    });

    if (result.awarded) {
      await Progress.addSession(
        userId,
        summary.total,
        summary.correct,
        summary.wrong
      );
    }

    res.status(200).json({
      message: result.awarded
        ? "Recompensa concedida."
        : "Esta atividade já foi recompensada.",
      ...result,
      correctCount: summary.correct,
      wrongCount: summary.wrong,
      totalQuestions: summary.total,
      percentage: summary.percentage,
    });
  } catch (err) {
    if (err.code === "INVALID_REWARD") {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === "INVALID_SEQUENCE") {
      return res.status(409).json({ message: err.message });
    }
    if (err.code === "PROFILE_NOT_FOUND") {
      return res.status(404).json({ message: "Perfil não encontrado." });
    }
    console.error("Erro ao conceder recompensa:", err);
    res.status(500).json({ message: "Erro ao conceder recompensa." });
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

exports.useLifeRefillItem = async (req, res) => {
  const { userId, itemId } = req.body;
  if (!userId || !itemId) {
    return res.status(400).json({ message: "userId e itemId são obrigatórios." });
  }

  try {
    const result = await Economy.useLifeRefillItem(userId, itemId);
    res.status(200).json({
      message: "Vidas recarregadas.",
      ...result,
    });
  } catch (err) {
    if (err.code === "LIVES_FULL") {
      return res.status(409).json({ message: "Suas vidas já estão cheias." });
    }
    if (err.code === "ITEM_NOT_FOUND") {
      return res.status(404).json({ message: "Recarga não disponível." });
    }
    console.error("Erro ao usar recarga:", err);
    res.status(500).json({ message: "Erro ao usar recarga." });
  }
};

exports.equipProfileDecoration = async (req, res) => {
  const { userId, itemId } = req.body;
  if (!userId || !itemId) {
    return res.status(400).json({ message: "userId e itemId são obrigatórios." });
  }

  try {
    const decoration = await Inventory.findOwnedDecoration(userId, itemId);
    if (!decoration) {
      return res.status(404).json({
        message: "Decoração não encontrada no inventário do usuário.",
      });
    }

    UserProfile.updateProfileDecoration(userId, decoration.id, (err) => {
      if (err?.code === "PROFILE_DECORATION_UNAVAILABLE") {
        return res.status(501).json({
          message: "O banco atual ainda não possui decoracao_foto_id.",
        });
      }
      if (err) {
        console.error("Erro ao equipar decoração:", err);
        return res.status(500).json({ message: "Erro ao equipar decoração." });
      }
      res.status(200).json({
        message: "Decoração equipada.",
        decoracao_foto_id: decoration.id,
      });
    });
  } catch (err) {
    console.error("Erro ao validar decoração:", err);
    res.status(500).json({ message: "Erro ao equipar decoração." });
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
