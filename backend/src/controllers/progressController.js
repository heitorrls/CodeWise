const Progress = require("../models/Progress");

exports.addProgress = async (req, res) => {
  try {
    const { userId, answeredCount, correctCount, wrongCount } = req.body;
    if (!userId) return res.status(400).json({ message: "userId é obrigatório" });

    const a = Number(answeredCount) || 0;
    const c = Number(correctCount) || 0;
    const w = Number(wrongCount) || 0;

    if (a < 0 || c < 0 || w < 0) {
      return res.status(400).json({ message: "Valores não podem ser negativos." });
    }
    if (c + w > a) {
      return res.status(400).json({ message: "Soma de acertos e erros não pode exceder respondidas." });
    }

    await Progress.addSession(userId, a, c, w);
    const summary = await Progress.getSummary(userId);
    return res.status(200).json({ message: "Progresso atualizado", summary });
  } catch (err) {
    console.error("addProgress error:", err);
    return res.status(500).json({ message: "Erro ao salvar progresso." });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const userId = req.params.userId || req.query.userId || req.body.userId;
    if (!userId) return res.status(400).json({ message: "userId é obrigatório" });
    const summary = await Progress.getSummary(userId);
    return res.status(200).json(summary);
  } catch (err) {
    console.error("getSummary error:", err);
    return res.status(500).json({ message: "Erro ao obter estatísticas." });
  }
};
