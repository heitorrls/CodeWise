const db = require("../config/database");
const bcrypt = require("bcryptjs");

const User = {
  findByEmail: (email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },

  // --- NOVO MÉTODO: Buscar por ID ---
  findById: (id, callback) => {
    // Seleciona apenas dados não sensíveis
    db.query(
      "SELECT id, email, created_at FROM users WHERE id = ?",
      [id],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results[0]);
      }
    );
  },

  create: (email, password, callback) => {
    // Gera o hash da senha
    const hash = bcrypt.hashSync(password, 10);

    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hash],
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

  // --- NOVO MÉTODO: Atualizar email por ID ---
  updateEmailByUserId: (userId, newEmail, callback) => {
    db.query(
      "UPDATE users SET email = ? WHERE id = ?",
      [newEmail, userId],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.affectedRows);
      }
    );
  },
  
  // --- MÉTODO ADICIONADO NA ETAPA ANTERIOR (Excluir Conta) ---
  deleteById: (userId, callback) => {
    db.query("DELETE FROM users WHERE id = ?", [userId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results.affectedRows);
    });
  },
};

module.exports = User;