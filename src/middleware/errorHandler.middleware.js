// Global error handler middleware
const logger = require("../utils/logger")

const errorHandler = (err, req, res, next) => {
  logger.error("Request error", {
    message: err.message,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
  })

  const statusCode = err.statusCode || 500
  const message = err.message || "Internal server error"

  res.status(statusCode).json({
    error: message,
    statusCode,
  })
}

module.exports = {
  errorHandler,
}
