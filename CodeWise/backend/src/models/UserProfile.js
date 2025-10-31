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
    db.query(
      "INSERT INTO user_profiles SET ?",
      [defaultProfile],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.insertId);
      }
    );
  },
  // Você pode adicionar métodos findById, update, etc. aqui
};

module.exports = UserProfile;
