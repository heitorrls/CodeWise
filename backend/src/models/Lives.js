const db = require("../config/database");

const MAX_LIVES = 5;
const REGEN_MS = 5 * 60 * 1000; // 5 minutos

// Cria a tabela se não existir
db.query(
  `CREATE TABLE IF NOT EXISTS user_lives (
    user_id INT NOT NULL UNIQUE,
    lives INT NOT NULL DEFAULT ${MAX_LIVES},
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_lives_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  (err) => {
    if (err) console.error("Erro ao criar tabela user_lives:", err);
  }
);

function ensureRow(userId, cb) {
  db.query(
    "INSERT IGNORE INTO user_lives (user_id, lives, updated_at) VALUES (?, ?, NOW())",
    [userId, MAX_LIVES],
    (err) => cb(err)
  );
}

function applyRegen(row) {
  const now = Date.now();
  const last = row.updated_at ? new Date(row.updated_at).getTime() : now;
  let lives = row.lives ?? MAX_LIVES;
  if (lives >= MAX_LIVES) return { lives, updated_at: new Date(now) };
  const diff = now - last;
  if (diff >= REGEN_MS) {
    const regen = Math.floor(diff / REGEN_MS);
    lives = Math.min(MAX_LIVES, lives + regen);
  }
  return { lives, updated_at: new Date(now) };
}

function getState(userId, cb) {
  ensureRow(userId, (errEnsure) => {
    if (errEnsure) return cb(errEnsure);
    db.query(
      "SELECT lives, updated_at FROM user_lives WHERE user_id = ?",
      [userId],
      (err, rows) => {
        if (err) return cb(err);
        if (!rows.length) return cb(null, { lives: MAX_LIVES, updated_at: new Date() });
        const regen = applyRegen(rows[0]);
        if (regen.lives !== rows[0].lives) {
          return setLives(userId, regen.lives, regen.updated_at, (err2) => {
            if (err2) return cb(err2);
            cb(null, regen);
          });
        }
        cb(null, regen);
      }
    );
  });
}

function setLives(userId, lives, updatedAt = new Date(), cb) {
  const safeLives = Math.max(0, Math.min(MAX_LIVES, lives));
  db.query(
    "UPDATE user_lives SET lives = ?, updated_at = ? WHERE user_id = ?",
    [safeLives, new Date(updatedAt), userId],
    (err) => cb(err, safeLives)
  );
}

function updateLives(userId, { delta, setTo }, cb) {
  getState(userId, (err, state) => {
    if (err) return cb(err);
    const target =
      typeof setTo === "number" ? setTo : (state.lives ?? MAX_LIVES) + (delta || 0);
    setLives(userId, target, new Date(), (err2, lives) => {
      if (err2) return cb(err2);
      cb(null, { lives });
    });
  });
}

function consume(userId, amount, cb) {
  const qty = Math.max(1, amount || 1);
  getState(userId, (err, state) => {
    if (err) return cb(err);
    if ((state.lives ?? 0) < qty) {
      const error = new Error("Sem vidas suficientes");
      error.code = "NO_LIVES";
      return cb(error);
    }
    setLives(userId, state.lives - qty, new Date(), (err2, lives) => {
      if (err2) return cb(err2);
      cb(null, { lives });
    });
  });
}

module.exports = {
  MAX_LIVES,
  REGEN_MS,
  getState,
  updateLives,
  consume,
  setLives,
};
