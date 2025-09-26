const db = require('../config/database');

const User = {
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },
  create: (email, password, callback) => {
    db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results.insertId);
    });
  }
};

module.exports = User;