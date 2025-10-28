// Authentication middleware
const jwt = require("jsonwebtoken")
const { AuthenticationError } = require("../utils/errors")
const { getOAuthTokenByAccessHash } = require("../../db/queries")
const { hashToken } = require("../utils/crypto")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      throw new AuthenticationError("No token provided")
    }

    // Hash the token to look it up in database
    const tokenHash = hashToken(token)
    const result = await getOAuthTokenByAccessHash(tokenHash)

    if (result.rows.length === 0) {
      throw new AuthenticationError("Invalid token")
    }

    const tokenData = result.rows[0]

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      throw new AuthenticationError("Token expired")
    }

    // Verify JWT signature
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = {
        id: decoded.sub,
        clientId: decoded.client_id,
        scope: decoded.scope,
      }
      next()
    } catch (err) {
      throw new AuthenticationError("Invalid token signature")
    }
  } catch (error) {
    res.status(error.statusCode || 401).json({ error: error.message })
  }
}

module.exports = {
  authenticateToken,
}
