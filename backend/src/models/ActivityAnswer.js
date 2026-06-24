const db = require("../config/database");

let tablesReady = null;

const ensureTables = () => {
  if (tablesReady) return tablesReady;

  tablesReady = new Promise((resolve, reject) => {
    db.query(
      `CREATE TABLE IF NOT EXISTS activity_answers (
        user_id INT NOT NULL,
        module_key VARCHAR(100) NOT NULL,
        lesson_index INT NOT NULL,
        question_index INT NOT NULL,
        selected_answer INT NOT NULL,
        is_correct TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, module_key, lesson_index, question_index),
        CONSTRAINT fk_activity_answers_user
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
      (answerErr) => {
        if (answerErr) {
          tablesReady = null;
          return reject(answerErr);
        }

        db.query(
          `CREATE TABLE IF NOT EXISTS activity_completions (
            user_id INT NOT NULL,
            module_key VARCHAR(100) NOT NULL,
            lesson_index INT NOT NULL,
            total_questions INT NOT NULL,
            correct_count INT NOT NULL,
            wrong_count INT NOT NULL,
            percentage INT NOT NULL,
            completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, module_key, lesson_index),
            CONSTRAINT fk_activity_completions_user
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
          (completionErr) => {
            if (completionErr) {
              tablesReady = null;
              return reject(completionErr);
            }
            resolve();
          }
        );
      }
    );
  });

  return tablesReady;
};

const normalizeNumber = (value) => {
  const number = Number(value);
  return Number.isInteger(number) ? number : null;
};

const ActivityAnswer = {
  ensureTables,

  async saveFirstAnswer({
    userId,
    moduleId,
    lessonIndex,
    questionIndex,
    selectedAnswer,
    isCorrect,
  }) {
    await ensureTables();

    const lesson = normalizeNumber(lessonIndex);
    const question = normalizeNumber(questionIndex);
    const answer = normalizeNumber(selectedAnswer);

    if (
      !userId ||
      !moduleId ||
      lesson === null ||
      question === null ||
      answer === null ||
      lesson < 0 ||
      question < 0 ||
      answer < 0
    ) {
      const error = new Error("Resposta invÃ¡lida.");
      error.code = "INVALID_ANSWER";
      throw error;
    }

    return new Promise((resolve, reject) => {
      db.query(
        `INSERT IGNORE INTO activity_answers
           (user_id, module_key, lesson_index, question_index, selected_answer, is_correct)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, moduleId, lesson, question, answer, isCorrect ? 1 : 0],
        (insertErr, result) => {
          if (insertErr) return reject(insertErr);

          db.query(
            `SELECT question_index AS questionIndex,
                    selected_answer AS selectedAnswer,
                    is_correct AS isCorrect
             FROM activity_answers
             WHERE user_id = ?
               AND module_key = ?
               AND lesson_index = ?
               AND question_index = ?`,
            [userId, moduleId, lesson, question],
            (selectErr, rows) => {
              if (selectErr) return reject(selectErr);
              const row = rows[0];
              resolve({
                inserted: result.affectedRows > 0,
                questionIndex: row.questionIndex,
                selectedAnswer: row.selectedAnswer,
                isCorrect: row.isCorrect === 1,
              });
            }
          );
        }
      );
    });
  },

  async getAnswers({ userId, moduleId, lessonIndex }) {
    await ensureTables();

    return new Promise((resolve, reject) => {
      db.query(
        `SELECT question_index AS questionIndex,
                selected_answer AS selectedAnswer,
                is_correct AS isCorrect
         FROM activity_answers
         WHERE user_id = ? AND module_key = ? AND lesson_index = ?
         ORDER BY question_index ASC`,
        [userId, moduleId, Number(lessonIndex)],
        (err, rows) => {
          if (err) return reject(err);
          resolve(
            (rows || []).map((row) => ({
              questionIndex: row.questionIndex,
              selectedAnswer: row.selectedAnswer,
              isCorrect: row.isCorrect === 1,
            }))
          );
        }
      );
    });
  },

  async getSummary({ userId, moduleId, lessonIndex, totalQuestions }) {
    const total = Number(totalQuestions) || 0;
    const answers = (await this.getAnswers({ userId, moduleId, lessonIndex }))
      .filter((answer) => (
        Number.isInteger(Number(answer.questionIndex)) &&
        Number(answer.questionIndex) >= 0 &&
        Number(answer.questionIndex) < total
      ));
    const answered = answers.length;
    const correct = answers.filter((answer) => answer.isCorrect).length;
    const wrong = Math.max(0, answered - correct);

    return {
      answers,
      answered,
      correct,
      wrong,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  },

  async markCompletion({
    userId,
    moduleId,
    lessonIndex,
    totalQuestions,
    correctCount,
    wrongCount,
    percentage,
  }) {
    await ensureTables();

    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO activity_completions
           (user_id, module_key, lesson_index, total_questions,
            correct_count, wrong_count, percentage)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           total_questions = VALUES(total_questions),
           correct_count = VALUES(correct_count),
           wrong_count = VALUES(wrong_count),
           percentage = VALUES(percentage)`,
        [
          userId,
          moduleId,
          Number(lessonIndex),
          Number(totalQuestions),
          Number(correctCount),
          Number(wrongCount),
          Number(percentage),
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  async deleteAnswers({ userId, moduleId, lessonIndex }) {
    await ensureTables();

    return new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM activity_answers
         WHERE user_id = ?
           AND module_key = ?
           AND lesson_index = ?`,
        [userId, moduleId, Number(lessonIndex)],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },
};

module.exports = ActivityAnswer;
