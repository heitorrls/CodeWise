const db = require("../config/database");

const Inventory = {
  addItem: (userId, item) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO inventario (user_id, tipo, nome, descricao, quantidade, meta)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(
        sql,
        [
          userId,
          item.tipo || "utilizavel",
          item.nome || "Item",
          item.descricao || "",
          item.quantidade || 1,
          item.meta || null,
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  },
  listByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT id, tipo, nome, descricao, quantidade, meta, created_at FROM inventario WHERE user_id = ?",
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  },
};

module.exports = Inventory;
