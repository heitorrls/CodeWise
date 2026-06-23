const db = require("../config/database");

const OPTIONAL_PROFILE_COLUMNS = ["foto_perfil", "decoracao_foto_id"];
let optionalColumnsCache = null;

const getOptionalProfileColumns = (callback) => {
  if (optionalColumnsCache !== null) {
    return callback(null, optionalColumnsCache);
  }

  db.query(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'user_profiles'
       AND COLUMN_NAME IN (?, ?)`,
    OPTIONAL_PROFILE_COLUMNS,
    (err, rows) => {
      if (err) {
        // Foto e decoração são opcionais. As operações básicas devem continuar
        // funcionando mesmo sem acesso aos metadados do banco.
        optionalColumnsCache = [];
        return callback(null, optionalColumnsCache);
      }

      optionalColumnsCache = rows
        .map((row) => String(row.COLUMN_NAME).toLowerCase())
        .filter((column) => OPTIONAL_PROFILE_COLUMNS.includes(column));

      callback(null, optionalColumnsCache);
    }
  );
};

const UserProfile = {
  create: (userId, callback) => {
    db.query(
      `INSERT INTO user_profiles (user_id, pontuacao_total, moedas)
       VALUES (?, 0, 0)`,
      [userId],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.insertId);
      }
    );
  },

  ensureProfile: (userId, username, callback) => {
    db.query(
      `INSERT IGNORE INTO user_profiles
         (user_id, username, pontuacao_total, moedas)
       VALUES (?, ?, 0, 0)`,
      [userId, username || null],
      (err) => {
        if (err) return callback(err);
        callback(null);
      }
    );
  },

  findByUserId: (userId, callback) => {
    getOptionalProfileColumns((_columnErr, columns = []) => {
      const selectedColumns = [
        "user_id",
        "username",
        "pontuacao_total",
        "moedas",
        ...columns,
      ];

      db.query(
        `SELECT ${selectedColumns.join(", ")}
         FROM user_profiles
         WHERE user_id = ?`,
        [userId],
        (err, results) => {
          if (err) return callback(err, null);
          callback(null, results[0]);
        }
      );
    });
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

  updateProfilePhoto: (userId, profilePhoto, callback) => {
    getOptionalProfileColumns((_columnErr, columns = []) => {
      if (!columns.includes("foto_perfil")) {
        const error = new Error("Foto de perfil não disponível neste banco.");
        error.code = "PROFILE_PHOTO_UNAVAILABLE";
        return callback(error, null);
      }

      db.query(
        "UPDATE user_profiles SET foto_perfil = ? WHERE user_id = ?",
        [profilePhoto, userId],
        (err, results) => {
          if (err) return callback(err, null);
          callback(null, results.affectedRows);
        }
      );
    });
  },

  updateProfileDecoration: (userId, decorationId, callback) => {
    getOptionalProfileColumns((_columnErr, columns = []) => {
      if (!columns.includes("decoracao_foto_id")) {
        const error = new Error("Decoração de perfil não disponível neste banco.");
        error.code = "PROFILE_DECORATION_UNAVAILABLE";
        return callback(error, null);
      }

      db.query(
        "UPDATE user_profiles SET decoracao_foto_id = ? WHERE user_id = ?",
        [decorationId, userId],
        (err, results) => {
          if (err) return callback(err, null);
          callback(null, results.affectedRows);
        }
      );
    });
  },

  updateCoins: (userId, delta, callback) => {
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

      db.query(
        "SELECT COALESCE(moedas, 0) AS moedas FROM user_profiles WHERE user_id = ?",
        [userId],
        (selectErr, rows) => {
          if (selectErr) return callback(selectErr, null);
          callback(null, rows[0]?.moedas ?? 0);
        }
      );
    });
  },
};

module.exports = UserProfile;
