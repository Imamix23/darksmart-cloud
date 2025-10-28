const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const authRoutes = require("./routes/auth.routes")
const devicesRoutes = require("./routes/devices.routes")
const roomsRoutes = require("./routes/rooms.routes")
const smarthomeRoutes = require("./routes/smarthome.routes")
const { errorHandler } = require("./middleware/errorHandler.middleware")
const { apiLimiter } = require("./middleware/rateLimit.middleware")

const app = express()

// Security middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
app.use(apiLimiter)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/devices", devicesRoutes)
app.use("/api/rooms", roomsRoutes)
app.use("/api/smarthome", smarthomeRoutes)

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

// Error handling
app.use(errorHandler)

module.exports = app
