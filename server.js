require("dotenv").config()
const app = require("./src/app")
const { initializeDatabase } = require("./src/config/database")

const PORT = process.env.PORT || 5050

const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase()

    // Start server
    app.listen(PORT, () => {
      console.log(`DarkSmart API Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
