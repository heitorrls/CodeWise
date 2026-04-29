const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jjjb3509",
  database: "codewisedb",
});

module.exports = connection;
