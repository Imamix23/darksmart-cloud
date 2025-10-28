// Authentication route handlers
const authService = require("../services/auth.service")
const logger = require("../utils/logger")

const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body
    const ipAddress = req.ip
    const userAgent = req.get("user-agent")

    const user = await authService.signup(email, password, name, ipAddress, userAgent)

    res.status(201).json({
      message: "User created successfully",
      user,
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const clientId = req.query.client_id || "default-client"
    const scope = req.query.scope || "openid profile email"
    const ipAddress = req.ip
    const userAgent = req.get("user-agent")

    const result = await authService.login(email, password, clientId, scope, ipAddress, userAgent)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    // Token revocation would be handled in database
    logger.info("User logged out", { userId: req.user.id })
    res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  signup,
  login,
  getCurrentUser,
  logout,
}
