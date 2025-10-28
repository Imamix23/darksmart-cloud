// Database configuration
const pool = require("../../db/pool")

const initializeDatabase = async () => {
  try {
    // Test connection
    const result = await pool.query("SELECT NOW()")
    console.log("Database connected:", result.rows[0])
    return pool
  } catch (error) {
    console.error("Database connection failed:", error)
    process.exit(1)
  }
}

module.exports = {
  initializeDatabase,
  pool,
}
