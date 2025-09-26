const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "santos@santos11",
  database: "codewise",
});

module.exports = connection;
