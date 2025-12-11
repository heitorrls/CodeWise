const db = require("../config/database");

const PasswordReset = {
  // Salva um novo código de redefinição
  create: (email, code, expires, callback) => {
    // Apaga códigos antigos para este email antes de inserir o novo
    db.query("DELETE FROM password_resets WHERE email = ?", [email], (err) => {
      if (err) return callback(err, null);

      db.query(
        "INSERT INTO password_resets (email, code, expires_at) VALUES (?, ?, ?)",
        [email, code, expires],
        (err, results) => {
          if (err) return callback(err, null);
          callback(null, results.insertId);
        }
      );
    });
  },

  // Encontra um código válido (que exista e não tenha expirado)
  findByEmailAndCode: (email, code, callback) => {
    db.query(
      "SELECT * FROM password_resets WHERE email = ? AND code = ? AND expires_at > NOW()",
      [email, code],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results[0]);
      }
    );
  },

  // Deleta um código após ser usado
  delete: (email, code, callback) => {
    db.query(
      "DELETE FROM password_resets WHERE email = ? AND code = ?",
      [email, code],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.affectedRows);
      }
    );
  },
};

module.exports = PasswordReset;
