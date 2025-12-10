const db = require("../config/database");

// Garante a existência da tabela user_stats
function ensureTable() {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS user_stats (
        user_id INT NOT NULL,
        total_answered INT NOT NULL DEFAULT 0,
        total_correct INT NOT NULL DEFAULT 0,
        total_wrong INT NOT NULL DEFAULT 0,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id),
        CONSTRAINT fk_user_stats_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    db.query(sql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

const Progress = {
  async addSession(userId, answeredCount, correctCount, wrongCount) {
    if (!userId) throw new Error("userId é obrigatório");
    const a = Number(answeredCount) || 0;
    const c = Number(correctCount) || 0;
    const w = Number(wrongCount) || 0;
    await ensureTable();
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO user_stats (user_id, total_answered, total_correct, total_wrong)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          total_answered = total_answered + VALUES(total_answered),
          total_correct = total_correct + VALUES(total_correct),
          total_wrong = total_wrong + VALUES(total_wrong);
      `;
      db.query(sql, [userId, a, c, w], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  async getSummary(userId) {
    if (!userId) throw new Error("userId é obrigatório");
    await ensureTable();
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT total_answered AS totalAnswered,
               total_correct AS totalCorrect,
               total_wrong AS totalWrong
        FROM user_stats
        WHERE user_id = ?
      `;
      db.query(sql, [userId], (err, rows) => {
        if (err) return reject(err);
        if (!rows || rows.length === 0) {
          return resolve({ totalAnswered: 0, totalCorrect: 0, totalWrong: 0 });
        }
        resolve(rows[0]);
      });
    });
  },
};

module.exports = Progress;
