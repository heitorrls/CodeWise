const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ceub123456",
  database: "codewise",
});

module.exports = connection;
