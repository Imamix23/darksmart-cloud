// Simple logging utility
const fs = require("fs")
const path = require("path")

const logsDir = path.join(__dirname, "../../logs")

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

const log = (level, message, data = {}) => {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    message,
    ...data,
  }

  console.log(`[${level}] ${timestamp} - ${message}`, data)

  // Write to file
  const logFile = path.join(logsDir, `${level.toLowerCase()}.log`)
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + "\n")
}

module.exports = {
  info: (message, data) => log("INFO", message, data),
  error: (message, data) => log("ERROR", message, data),
  warn: (message, data) => log("WARN", message, data),
  debug: (message, data) => log("DEBUG", message, data),
}
