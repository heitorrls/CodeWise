const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "blaladalasdas",
  database: "codewisedb",
});

module.exports = connection;
