const Progress = require("../models/Progress");
const ActivityProgress = require("../models/ActivityProgress");
const ActivityAnswer = require("../models/ActivityAnswer");
const { getAnswerResult } = require("../services/activityCatalog");

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

exports.getActivityProgress = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "userId é obrigatório." });
  }

  try {
    const progress = await ActivityProgress.getByUser(userId);
    res.status(200).json({ progress });
  } catch (err) {
    console.error("getActivityProgress error:", err);
    res.status(500).json({ message: "Erro ao buscar progresso das atividades." });
  }
};

exports.getActivityAnswers = async (req, res) => {
  const { userId, moduleId, lessonIndex } = req.query;

  if (!userId || !moduleId || lessonIndex === undefined) {
    return res.status(400).json({
      message: "userId, moduleId e lessonIndex sÃ£o obrigatÃ³rios.",
    });
  }

  try {
    const answers = await ActivityAnswer.getAnswers({
      userId,
      moduleId,
      lessonIndex,
    });
    res.status(200).json({ answers });
  } catch (err) {
    console.error("getActivityAnswers error:", err);
    res.status(500).json({ message: "Erro ao buscar respostas da atividade." });
  }
};

exports.saveActivityAnswer = async (req, res) => {
  const {
    userId,
    moduleId,
    lessonIndex,
    questionIndex,
    selectedAnswer,
  } = req.body;

  if (
    !userId ||
    !moduleId ||
    lessonIndex === undefined ||
    questionIndex === undefined ||
    selectedAnswer === undefined
  ) {
    return res.status(400).json({
      message: "Dados da resposta incompletos.",
    });
  }

  try {
    const lesson = Number(lessonIndex);
    const progress = await ActivityProgress.getByUser(userId);
    const moduleProgress = progress.find((item) => item.moduleId === moduleId);
    const completedActivities =
      Number(moduleProgress?.completedActivities) || 0;

    if (!Number.isInteger(lesson) || lesson > completedActivities) {
      return res.status(409).json({
        message: "A atividade anterior ainda não foi concluída.",
      });
    }

    const answerResult = getAnswerResult({
      moduleId,
      lessonIndex,
      questionIndex,
      selectedAnswer,
    });

    if (!answerResult) {
      return res.status(400).json({
        message: "Resposta inválida para esta atividade.",
      });
    }

    const answer = await ActivityAnswer.saveFirstAnswer({
      userId,
      moduleId,
      lessonIndex,
      questionIndex,
      selectedAnswer,
      isCorrect: answerResult.isCorrect,
    });

    res.status(answer.inserted ? 201 : 200).json({
      message: answer.inserted
        ? "Resposta registrada."
        : "QuestÃ£o jÃ¡ respondida anteriormente.",
      answer,
    });
  } catch (err) {
    if (err.code === "INVALID_ANSWER") {
      return res.status(400).json({ message: err.message });
    }
    console.error("saveActivityAnswer error:", err);
    res.status(500).json({ message: "Erro ao salvar resposta da atividade." });
  }
};
