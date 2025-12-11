const db = require("../config/database");

const UserProfile = {
  // Cria um perfil padrão para um novo usuário
  create: (userId, callback) => {
    const defaultProfile = {
      user_id: userId,
      pontuacao_total: 0,
      moedas: 0,
      avatar: "macaco.png",
    };

    db.query(
      "INSERT INTO user_profiles SET ?",
      [defaultProfile],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.insertId);
      }
    );
  },

  updateUsername: (userId, newUsername, callback) => {
    db.query(
      "UPDATE user_profiles SET username = ? WHERE user_id = ?",
      [newUsername, userId],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.affectedRows);
      }
    );
  },
  updateAvatar: (userId, avatar, callback) => {
    db.query(
      "UPDATE user_profiles SET avatar = ? WHERE user_id = ?",
      [avatar, userId],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.affectedRows);
      }
    );
  },
  findByUserId: (userId, callback) => {
    db.query(
      "SELECT user_id, username, avatar, moedas FROM user_profiles WHERE user_id = ?",
      [userId],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results[0]);
      }
    );
  },
  updateCoins: (userId, delta, callback) => {
    // Usa COALESCE para evitar problemas com valores nulos
    const sql = `
      UPDATE user_profiles
      SET moedas = COALESCE(moedas, 0) + ?
      WHERE user_id = ? AND (COALESCE(moedas, 0) + ?) >= 0
    `;
    db.query(sql, [delta, userId, delta], (err, result) => {
      if (err) return callback(err, null);
      if (result.affectedRows === 0) {
        const error = new Error("Saldo insuficiente");
        error.code = "INSUFFICIENT_FUNDS";
        return callback(error, null);
      }
      // Busca saldo atualizado
      db.query(
        "SELECT COALESCE(moedas, 0) as moedas FROM user_profiles WHERE user_id = ?",
        [userId],
        (err2, rows) => {
          if (err2) return callback(err2, null);
          callback(null, rows[0]?.moedas ?? 0);
        }
      );
    });
  },
  ensureProfile: (userId, username, callback) => {
    const insertDefault = {
      user_id: userId,
      username: username || null,
      pontuacao_total: 0,
      moedas: 0,
      avatar: null,
    };
    db.query(
      "INSERT IGNORE INTO user_profiles SET ?",
      insertDefault,
      (err) => {
        if (err) return callback(err);
        callback(null);
      }
    );
  },
  // Você pode adicionar métodos findById, update, etc. aqui
};

module.exports = UserProfile;
