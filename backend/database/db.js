const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "Zemjegulata123!",
  database: "FEITsecurity",
  waitForConnections: true,
  connectionLimit: 10, // počet paralelných spojení
  queueLimit: 0
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connection to database successful");
    connection.release();
  } catch (err) {
    console.error("Connection to database failed:", err.message);
  }
})();

module.exports = pool;
