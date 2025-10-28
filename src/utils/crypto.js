// Cryptographic utilities for password hashing and token generation
const crypto = require("crypto")
const bcrypt = require("bcryptjs")

// Hash password with bcrypt (cost factor 12)
const hashPassword = async (password) => {
  return bcrypt.hash(password, 12)
}

// Compare password with hash
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash)
}

// Generate secure random token
const generateToken = () => {
  return crypto.randomBytes(32).toString("hex")
}

// Hash token for storage
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex")
}

// Generate JWT payload
const generateJWTPayload = (userId, clientId, scope) => {
  return {
    sub: userId,
    client_id: clientId,
    scope: scope,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  hashToken,
  generateJWTPayload,
}
