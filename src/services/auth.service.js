// Authentication business logic
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")
const { getUserByEmail, createUser, createOAuthToken, createAuditLog } = require("../../db/queries")
const { hashPassword, comparePassword, generateToken, hashToken } = require("../utils/crypto")
const { AuthenticationError, ConflictError, NotFoundError } = require("../utils/errors")
const logger = require("../utils/logger")

const signup = async (email, password, name, ipAddress, userAgent) => {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser.rows.length > 0) {
      throw new ConflictError("Email already registered")
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const result = await createUser(email, passwordHash, name)
    const user = result.rows[0]

    // Log signup
    await createAuditLog(user.id, null, "signup", ipAddress, userAgent, { email })

    logger.info("User signed up", { userId: user.id, email })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  } catch (error) {
    logger.error("Signup failed", { email, error: error.message })
    throw error
  }
}

const login = async (email, password, clientId, scope, ipAddress, userAgent) => {
  try {
    // Find user
    const userResult = await getUserByEmail(email)
    if (userResult.rows.length === 0) {
      throw new AuthenticationError("Invalid email or password")
    }

    const user = userResult.rows[0]

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash)
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password")
    }

    // Generate tokens
    const accessToken = generateToken()
    const refreshToken = generateToken()
    const accessTokenHash = hashToken(accessToken)
    const refreshTokenHash = hashToken(refreshToken)

    // Create JWT
    const jwtPayload = {
      sub: user.id,
      client_id: clientId,
      scope: scope,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    }
    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET)

    // Store tokens in database
    const expiresAt = new Date(Date.now() + 3600 * 1000) // 1 hour
    await createOAuthToken(user.id, accessTokenHash, refreshTokenHash, clientId, scope, expiresAt)

    // Log login
    await createAuditLog(user.id, null, "login", ipAddress, userAgent, { clientId })

    logger.info("User logged in", { userId: user.id, email })

    return {
      accessToken: jwtToken,
      refreshToken,
      expiresIn: 3600,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }
  } catch (error) {
    logger.error("Login failed", { email, error: error.message })
    throw error
  }
}

const getCurrentUser = async (userId) => {
  try {
    const { getUserById } = require("../../db/queries")
    const result = await getUserById(userId)

    if (result.rows.length === 0) {
      throw new NotFoundError("User not found")
    }

    const user = result.rows[0]
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.email_verified,
      isActive: user.is_active,
      createdAt: user.created_at,
    }
  } catch (error) {
    logger.error("Get current user failed", { userId, error: error.message })
    throw error
  }
}

module.exports = {
  signup,
  login,
  getCurrentUser,
}
