const db = require("../config/database");

const LoginHistory = {
  // Registra o login de hoje (se já existir, ignora graças ao UNIQUE KEY no banco)
  logVisit: (userId, callback) => {
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const sql = "INSERT IGNORE INTO user_logins (user_id, login_date) VALUES (?, ?)";
    db.query(sql, [userId, today], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },

  // Busca todos os dias que o usuário logou
  getUserHistory: (userId, callback) => {
    const sql = "SELECT login_date FROM user_logins WHERE user_id = ? ORDER BY login_date DESC";
    db.query(sql, [userId], (err, results) => {
      if (err) return callback(err, null);
      // Retorna apenas um array de strings de data (ex: ['2023-10-01', '2023-10-02'])
      const dates = results.map(row => {
         // Ajuste para fuso horário se necessário, ou pega a string crua do banco
         const d = new Date(row.login_date);
         return d.toISOString().split('T')[0];
      });
      callback(null, dates);
    });
  }
};

module.exports = LoginHistory;