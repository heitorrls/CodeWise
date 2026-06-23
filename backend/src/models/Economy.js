const db = require("../config/database");
const { MAX_LIVES, REGEN_MS } = require("./Lives");
const { withTransaction } = require("../utils/transaction");
const ActivityProgress = require("./ActivityProgress");
const Inventory = require("./Inventory");

const LESSON_REWARD_BASE = 25;
const COINS_PER_CORRECT_ANSWER = 10;
const ALLOWED_LESSONS = {
  "mod-js-basico": [5, 5],
};

let tablesReady = null;

const ensureTables = () => {
  if (tablesReady) return tablesReady;

  tablesReady = new Promise((resolve, reject) => {
    db.query(
      `CREATE TABLE IF NOT EXISTS economy_events (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        event_type VARCHAR(50) NOT NULL,
        event_key VARCHAR(190) NOT NULL,
        coins_delta INT NOT NULL,
        correct_answers INT DEFAULT NULL,
        total_questions INT DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY economy_event_once (user_id, event_type, event_key),
        CONSTRAINT fk_economy_events_user
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
      (err) => {
        if (err) {
          tablesReady = null;
          return reject(err);
        }
        resolve();
      }
    );
  });

  return tablesReady;
};

const calculateRegeneratedLives = (lives, updatedAt) => {
  const currentLives = Number(lives) || 0;
  if (currentLives >= MAX_LIVES) return MAX_LIVES;

  const lastUpdate = updatedAt ? new Date(updatedAt).getTime() : Date.now();
  const elapsed = Math.max(0, Date.now() - lastUpdate);
  return Math.min(
    MAX_LIVES,
    currentLives + Math.floor(elapsed / REGEN_MS)
  );
};

const createError = (message, code) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const Economy = {
  purchaseLifeRefill: (userId, price) =>
    withTransaction(async (transaction) => {
      await transaction.query(
        `INSERT IGNORE INTO user_lives (user_id, lives, updated_at)
         VALUES (?, ?, NOW())`,
        [userId, MAX_LIVES]
      );

      const lifeRows = await transaction.query(
        `SELECT lives, updated_at
         FROM user_lives
         WHERE user_id = ?
         FOR UPDATE`,
        [userId]
      );
      const lives = calculateRegeneratedLives(
        lifeRows[0]?.lives,
        lifeRows[0]?.updated_at
      );

      if (lives >= MAX_LIVES) {
        throw createError("As vidas já estão cheias", "LIVES_FULL");
      }

      const debitResult = await transaction.query(
        `UPDATE user_profiles
         SET moedas = COALESCE(moedas, 0) - ?
         WHERE user_id = ? AND COALESCE(moedas, 0) >= ?`,
        [price, userId, price]
      );
      if (debitResult.affectedRows === 0) {
        throw createError("Saldo insuficiente", "INSUFFICIENT_FUNDS");
      }

      await transaction.query(
        `UPDATE user_lives
         SET lives = ?, updated_at = NOW()
         WHERE user_id = ?`,
        [MAX_LIVES, userId]
      );

      const balanceRows = await transaction.query(
        `SELECT COALESCE(moedas, 0) AS moedas
         FROM user_profiles
         WHERE user_id = ?`,
        [userId]
      );

      return {
        saldo: balanceRows[0]?.moedas ?? 0,
        lives: MAX_LIVES,
        max: MAX_LIVES,
      };
    }),

  useLifeRefillItem: (userId, itemId) =>
    Inventory.ensureTable().then(() => withTransaction(async (transaction) => {
      await transaction.query(
        `INSERT IGNORE INTO user_lives (user_id, lives, updated_at)
         VALUES (?, ?, NOW())`,
        [userId, MAX_LIVES]
      );

      const lifeRows = await transaction.query(
        `SELECT lives, updated_at
         FROM user_lives
         WHERE user_id = ?
         FOR UPDATE`,
        [userId]
      );
      const lives = calculateRegeneratedLives(
        lifeRows[0]?.lives,
        lifeRows[0]?.updated_at
      );
      if (lives >= MAX_LIVES) {
        throw createError("As vidas já estão cheias", "LIVES_FULL");
      }

      const itemRows = await transaction.query(
        `SELECT id, quantidade
         FROM inventario
         WHERE id = ? AND user_id = ? AND tipo = 'utilizavel'
           AND nome = 'Recarga de Vidas' AND quantidade > 0
         FOR UPDATE`,
        [itemId, userId]
      );
      if (!itemRows.length) {
        throw createError("Recarga não encontrada", "ITEM_NOT_FOUND");
      }

      const quantity = Number(itemRows[0].quantidade) || 0;
      if (quantity <= 1) {
        await transaction.query(
          "DELETE FROM inventario WHERE id = ? AND user_id = ?",
          [itemId, userId]
        );
      } else {
        await transaction.query(
          `UPDATE inventario
           SET quantidade = quantidade - 1
           WHERE id = ? AND user_id = ?`,
          [itemId, userId]
        );
      }

      await transaction.query(
        `UPDATE user_lives
         SET lives = ?, updated_at = NOW()
         WHERE user_id = ?`,
        [MAX_LIVES, userId]
      );

      return {
        lives: MAX_LIVES,
        max: MAX_LIVES,
        remaining: Math.max(0, quantity - 1),
      };
    })),

  rewardLessonCompletion: async ({
    userId,
    moduleId,
    lessonIndex,
    correctCount,
    totalQuestions,
  }) => {
    await Promise.all([ensureTables(), ActivityProgress.ensureTable()]);

    const lessons = ALLOWED_LESSONS[moduleId];
    const lesson = Number(lessonIndex);
    const correct = Number(correctCount);
    const total = Number(totalQuestions);
    const expectedQuestions = lessons?.[lesson];

    if (
      !lessons ||
      !Number.isInteger(lesson) ||
      lesson < 0 ||
      lesson >= lessons.length ||
      !Number.isInteger(correct) ||
      !Number.isInteger(total) ||
      total !== expectedQuestions ||
      correct < 0 ||
      correct > total
    ) {
      throw createError("Dados da atividade inválidos", "INVALID_REWARD");
    }

    const eventKey = `${moduleId}:lesson:${lesson}`;
    const reward =
      LESSON_REWARD_BASE + correct * COINS_PER_CORRECT_ANSWER;

    return withTransaction(async (transaction) => {
      await transaction.query(
        `INSERT IGNORE INTO activity_progress
           (user_id, module_key, completed_activities)
         VALUES (?, ?, 0)`,
        [userId, moduleId]
      );

      const progressRows = await transaction.query(
        `SELECT completed_activities
         FROM activity_progress
         WHERE user_id = ? AND module_key = ?
         FOR UPDATE`,
        [userId, moduleId]
      );
      const completedActivities =
        Number(progressRows[0]?.completed_activities) || 0;

      if (lesson > completedActivities) {
        throw createError(
          "A atividade anterior ainda não foi concluída",
          "INVALID_SEQUENCE"
        );
      }

      const eventResult = await transaction.query(
        `INSERT IGNORE INTO economy_events
           (user_id, event_type, event_key, coins_delta,
            correct_answers, total_questions)
         VALUES (?, 'lesson_completion', ?, ?, ?, ?)`,
        [userId, eventKey, reward, correct, total]
      );

      if (eventResult.affectedRows === 0) {
        const rows = await transaction.query(
          `SELECT COALESCE(moedas, 0) AS moedas
           FROM user_profiles
           WHERE user_id = ?`,
          [userId]
        );
        return {
          awarded: false,
          reward: 0,
          saldo: rows[0]?.moedas ?? 0,
          completedActivities,
        };
      }

      const creditResult = await transaction.query(
        `UPDATE user_profiles
         SET moedas = COALESCE(moedas, 0) + ?
         WHERE user_id = ?`,
        [reward, userId]
      );
      if (creditResult.affectedRows === 0) {
        throw createError("Perfil não encontrado", "PROFILE_NOT_FOUND");
      }

      const rows = await transaction.query(
        `SELECT COALESCE(moedas, 0) AS moedas
         FROM user_profiles
         WHERE user_id = ?`,
        [userId]
      );

      const nextCompletedActivities = Math.max(
        completedActivities,
        lesson + 1
      );
      await transaction.query(
        `UPDATE activity_progress
         SET completed_activities = ?
         WHERE user_id = ? AND module_key = ?`,
        [nextCompletedActivities, userId, moduleId]
      );

      return {
        awarded: true,
        reward,
        saldo: rows[0]?.moedas ?? 0,
        completedActivities: nextCompletedActivities,
      };
    });
  },
};

module.exports = {
  Economy,
  LESSON_REWARD_BASE,
  COINS_PER_CORRECT_ANSWER,
};
