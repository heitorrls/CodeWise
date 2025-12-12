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
  consumeItem: (userId, itemId) => {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE inventario SET quantidade = quantidade - 1 WHERE id = ? AND user_id = ? AND quantidade > 0",
        [itemId, userId],
        (err, result) => {
          if (err) return reject(err);
          if (result.affectedRows === 0) {
            const error = new Error("Item indisponível");
            error.code = "NOT_FOUND";
            return reject(error);
          }
          db.query(
            "SELECT quantidade FROM inventario WHERE id = ? AND user_id = ?",
            [itemId, userId],
            (err2, rows) => {
              if (err2) return reject(err2);
              const qty = rows[0]?.quantidade ?? 0;
              if (qty <= 0) {
                db.query(
                  "DELETE FROM inventario WHERE id = ? AND user_id = ?",
                  [itemId, userId],
                  () => resolve(0)
                );
              } else {
                resolve(qty);
              }
            }
          );
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
