const db = require("../config/database");
const bcrypt = require("bcryptjs");

const User = {
  findByEmail: (email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },

  create: (email, username, password, callback) => {
    // Gera o hash da senha
    const hash = bcrypt.hashSync(password, 10);

    db.query(
      "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
      [email, username, hash],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.insertId);
      }
    );
  },

  // NOVO: Atualiza a senha do usuário
  updatePasswordByEmail: (email, newPassword, callback) => {
    // Gera o hash da nova senha
    const hash = bcrypt.hashSync(newPassword, 10);

    db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hash, email],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.affectedRows);
      }
    );
  },
};

module.exports = User;
