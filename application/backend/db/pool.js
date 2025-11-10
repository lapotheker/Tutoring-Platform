const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "50.18.23.168",
  user: "class_cto",
  password: "CTO_TEMP_PASSWORD",
  database: "main_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
