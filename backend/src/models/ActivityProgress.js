const db = require("../config/database");
const {
  MIN_LESSON_PASS_PERCENTAGE,
} = require("../services/activityCatalog");

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

    const progressRows = await new Promise((resolve, reject) => {
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

    const completionRows = await new Promise((resolve) => {
      db.query(
        `SELECT module_key AS moduleId,
                lesson_index AS lessonIndex,
                percentage
         FROM activity_completions
         WHERE user_id = ?
         ORDER BY module_key ASC, lesson_index ASC`,
        [userId],
        (err, rows) => {
          resolve(err ? [] : rows || []);
        }
      );
    });

    const completionsByModule = new Map();
    completionRows.forEach((row) => {
      const moduleId = row.moduleId;
      if (!completionsByModule.has(moduleId)) {
        completionsByModule.set(moduleId, []);
      }
      completionsByModule.get(moduleId).push(row);
    });

    return progressRows.map((row) => {
      const completions = completionsByModule.get(row.moduleId);
      if (!completions?.length) return row;

      const passedLessons = new Set(
        completions
          .filter((completion) => (
            Number(completion.percentage) >= MIN_LESSON_PASS_PERCENTAGE
          ))
          .map((completion) => Number(completion.lessonIndex))
      );
      let contiguousCompleted = 0;
      while (passedLessons.has(contiguousCompleted)) {
        contiguousCompleted++;
      }

      return {
        ...row,
        completedActivities: contiguousCompleted,
      };
    });
  },
};

module.exports = ActivityProgress;
