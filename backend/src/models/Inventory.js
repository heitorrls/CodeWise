const db = require("../config/database");
const { withTransaction } = require("../utils/transaction");

let decorationStorageType = null;
let tableReady = null;

const ensureTable = () => {
  if (tableReady) return tableReady;

  tableReady = new Promise((resolve, reject) => {
    db.query(
      `CREATE TABLE IF NOT EXISTS inventario (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        tipo ENUM('visual', 'decoracao', 'utilizavel')
          NOT NULL DEFAULT 'utilizavel',
        nome VARCHAR(255) NOT NULL,
        descricao TEXT NULL,
        quantidade INT NOT NULL DEFAULT 1,
        meta JSON NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_inventario_user_id (user_id),
        CONSTRAINT fk_inventario_user
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
      (err) => {
        if (err) {
          tableReady = null;
          return reject(err);
        }
        resolve();
      }
    );
  });

  return tableReady;
};

const getDecorationStorageType = (callback) => {
  if (decorationStorageType) return callback(null, decorationStorageType);

  ensureTable()
    .then(() => {
      db.query("SHOW COLUMNS FROM inventario LIKE 'tipo'", (err, rows) => {
        if (err) return callback(err, null);

        const enumDefinition = String(rows[0]?.Type || "");
        decorationStorageType = enumDefinition.includes("'decoracao'")
          ? "decoracao"
          : "visual";
        callback(null, decorationStorageType);
      });
    })
    .catch((err) => callback(err, null));
};

const normalizePublicType = (type) =>
  type === "visual" || type === "decoracao" ? "decoracao" : "utilizavel";

const normalizeItem = (item) => {
  return {
    ...item,
    tipo: normalizePublicType(item.tipo),
  };
};

const Inventory = {
  addItem: (userId, item) =>
    new Promise((resolve, reject) => {
      getDecorationStorageType((typeErr, storedDecorationType) => {
        if (typeErr) return reject(typeErr);
        const publicType = normalizePublicType(item.tipo);
        const storedType =
          publicType === "decoracao" ? storedDecorationType : "utilizavel";

        db.query(
          `INSERT INTO inventario
             (user_id, tipo, nome, descricao, quantidade, meta)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            userId,
            storedType,
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
    }),

  purchaseItem: (userId, item, price) =>
    new Promise((resolve, reject) => {
      getDecorationStorageType((typeErr, storedDecorationType) => {
        if (typeErr) return reject(typeErr);

        const publicType = normalizePublicType(item.tipo);
        const storedType =
          publicType === "decoracao" ? storedDecorationType : "utilizavel";

        withTransaction(async (transaction) => {
          if (publicType === "decoracao") {
            const ownedRows = await transaction.query(
              `SELECT id FROM inventario
               WHERE user_id = ? AND tipo = ? AND nome = ?
               LIMIT 1
               FOR UPDATE`,
              [userId, storedType, item.nome]
            );
            if (ownedRows.length) {
              const error = new Error("Decoração já adquirida");
              error.code = "ALREADY_OWNED";
              throw error;
            }
          }

          const debitResult = await transaction.query(
            `UPDATE user_profiles
             SET moedas = COALESCE(moedas, 0) - ?
             WHERE user_id = ? AND COALESCE(moedas, 0) >= ?`,
            [price, userId, price]
          );
          if (debitResult.affectedRows === 0) {
            const error = new Error("Saldo insuficiente");
            error.code = "INSUFFICIENT_FUNDS";
            throw error;
          }

          const insertResult = await transaction.query(
            `INSERT INTO inventario
               (user_id, tipo, nome, descricao, quantidade, meta)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              userId,
              storedType,
              item.nome,
              item.descricao || "",
              1,
              item.meta || null,
            ]
          );
          const rows = await transaction.query(
            `SELECT COALESCE(moedas, 0) AS moedas
             FROM user_profiles
             WHERE user_id = ?`,
            [userId]
          );

          return {
            itemId: insertResult.insertId,
            saldo: rows[0]?.moedas ?? 0,
          };
        }).then(resolve, reject);
      });
    }),

  findOwnedDecoration: (userId, itemId) =>
    new Promise((resolve, reject) => {
      getDecorationStorageType((typeErr, storedDecorationType) => {
        if (typeErr) return reject(typeErr);
        db.query(
          `SELECT id, user_id, tipo, nome, descricao, quantidade, meta, created_at
           FROM inventario
           WHERE id = ? AND user_id = ? AND tipo = ?
           LIMIT 1`,
          [itemId, userId, storedDecorationType],
          (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0] ? normalizeItem(rows[0]) : null);
          }
        );
      });
    }),

  consumeItem: (userId, itemId) =>
    ensureTable().then(
      () =>
        new Promise((resolve, reject) => {
          db.query(
        `UPDATE inventario
         SET quantidade = quantidade - 1
         WHERE id = ? AND user_id = ? AND tipo = 'utilizavel' AND quantidade > 0`,
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
            (selectErr, rows) => {
              if (selectErr) return reject(selectErr);
              const quantity = rows[0]?.quantidade ?? 0;

              if (quantity <= 0) {
                return db.query(
                  "DELETE FROM inventario WHERE id = ? AND user_id = ?",
                  [itemId, userId],
                  () => resolve(0)
                );
              }
              resolve(quantity);
            }
          );
        }
          );
        })
    ),

  listByUser: (userId) =>
    ensureTable().then(
      () =>
        new Promise((resolve, reject) => {
          db.query(
            `SELECT id, tipo, nome, descricao, quantidade, meta, created_at
             FROM inventario
             WHERE user_id = ?`,
            [userId],
            (err, rows) => {
              if (err) return reject(err);
              resolve(rows.map(normalizeItem));
            }
          );
        })
    ),

  ensureTable,
};

module.exports = Inventory;
