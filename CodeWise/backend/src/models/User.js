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
      "INSERT INTO users (email, username, password, leveling_completed, level) VALUES (?, ?, ?, 0, NULL)",
      [email, username, hash],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.insertId);
      }
    );
  },

  // Atualiza campos do usuário por ID (username e/ou email)
  updateById: (id, fields, callback) => {
    const sets = [];
    const values = [];
    if (fields.username !== undefined) {
      sets.push("username = ?");
      values.push(fields.username);
    }
    if (fields.email !== undefined) {
      sets.push("email = ?");
      values.push(fields.email);
    }
    if (sets.length === 0) return callback(null, 0);

    values.push(id);
    const sql = `UPDATE users SET ${sets.join(", ")} WHERE id = ?`;
    db.query(sql, values, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results.affectedRows);
    });
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

  // Marca o nivelamento como concluído (por id)
  markLevelingById: (id, level, callback) => {
    db.query(
      "UPDATE users SET leveling_completed = 1, level = ? WHERE id = ?",
      [level || null, id],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.affectedRows);
      }
    );
  },

  deleteById: (id, callback) => {
    db.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results.affectedRows);
    });
  },
};

module.exports = User;
