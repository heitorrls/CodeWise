const db = require("../config/database");

let tableReady = null;

const ensureTable = () => {
  if (tableReady) return tableReady;

  tableReady = new Promise((resolve, reject) => {
    db.query(
      `CREATE TABLE IF NOT EXISTS activity_progress (
        user_id INT NOT NULL,
        module_key VARCHAR(100) NOT NULL,
        completed_activities INT NOT NULL DEFAULT 0,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, module_key),
        CONSTRAINT fk_activity_progress_user
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
      (err) => {
        if (err) {
          tableReady = null;
          return reject(err);
        }
        resolve();
      }
    );
  });

  return tableReady;
};

const ActivityProgress = {
  ensureTable,

  async getByUser(userId) {
    await ensureTable();

    return new Promise((resolve, reject) => {
      db.query(
        `SELECT module_key AS moduleId,
                completed_activities AS completedActivities
         FROM activity_progress
         WHERE user_id = ?`,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  },
};

module.exports = ActivityProgress;
