const db = require("../config/database");

const UserProfile = {
  // 1. MODIFICADO: Aceita 'username' na criação
  create: (userId, username, callback) => {
    db.query(
      "INSERT INTO user_profiles (user_id, username) VALUES (?, ?)",
      [userId, username],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.insertId);
      }
    );
  },

  // --- 2. NOVO MÉTODO: Buscar perfil por user_id ---
  findByUserId: (userId, callback) => {
    db.query(
      "SELECT * FROM user_profiles WHERE user_id = ?",
      [userId],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results[0]);
      }
    );
  },

  // --- 3. NOVO MÉTODO: Atualizar username ---
  updateUsername: (userId, username, callback) => {
    db.query(
      "UPDATE user_profiles SET username = ? WHERE user_id = ?",
      [username, userId],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.affectedRows);
      }
    );
  },
};

module.exports = UserProfile;