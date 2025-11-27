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
      "SELECT user_id, username, avatar FROM user_profiles WHERE user_id = ?",
      [userId],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results[0]);
      }
    );
  },
  // Você pode adicionar métodos findById, update, etc. aqui
};

module.exports = UserProfile;
