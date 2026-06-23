const db = require("../config/database");

const query = (connection, sql, params = []) =>
  new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

const withTransaction = (work) =>
  new Promise((resolve, reject) => {
    db.getConnection((connectionErr, connection) => {
      if (connectionErr) return reject(connectionErr);

      connection.beginTransaction(async (transactionErr) => {
        if (transactionErr) {
          connection.release();
          return reject(transactionErr);
        }

        try {
          const result = await work({
            query: (sql, params) => query(connection, sql, params),
          });

          connection.commit((commitErr) => {
            if (commitErr) {
              return connection.rollback(() => {
                connection.release();
                reject(commitErr);
              });
            }
            connection.release();
            resolve(result);
          });
        } catch (error) {
          connection.rollback(() => {
            connection.release();
            reject(error);
          });
        }
      });
    });
  });

module.exports = { withTransaction };
