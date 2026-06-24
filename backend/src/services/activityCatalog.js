const ACTIVITY_CATALOG = {
  "mod-js-basico": [
    {
      correctAnswers: [0, 1, 1, 2, 1],
      optionCounts: [4, 4, 4, 4, 4],
    },
    {
      correctAnswers: [0, 2, 1, 0, 0],
      optionCounts: [4, 4, 4, 4, 4],
    },
  ],
};

const MIN_LESSON_PASS_PERCENTAGE = 70;

const normalizeIndex = (value) => {
  const number = Number(value);
  return Number.isInteger(number) ? number : null;
};

function getActivityDefinition(moduleId, lessonIndex) {
  const lesson = normalizeIndex(lessonIndex);
  if (!moduleId || lesson === null || lesson < 0) return null;

  const activity = ACTIVITY_CATALOG[moduleId]?.[lesson];
  if (!activity) return null;

  return {
    moduleId,
    lessonIndex: lesson,
    correctAnswers: activity.correctAnswers,
    optionCounts: activity.optionCounts,
    totalQuestions: activity.correctAnswers.length,
  };
}

function getAnswerResult({
  moduleId,
  lessonIndex,
  questionIndex,
  selectedAnswer,
}) {
  const activity = getActivityDefinition(moduleId, lessonIndex);
  const question = normalizeIndex(questionIndex);
  const answer = normalizeIndex(selectedAnswer);

  if (
    !activity ||
    question === null ||
    answer === null ||
    question < 0 ||
    question >= activity.totalQuestions ||
    answer < 0 ||
    answer >= (activity.optionCounts[question] || 0)
  ) {
    return null;
  }

  return {
    totalQuestions: activity.totalQuestions,
    isCorrect: activity.correctAnswers[question] === answer,
  };
}

module.exports = {
  MIN_LESSON_PASS_PERCENTAGE,
  getActivityDefinition,
  getAnswerResult,
};
