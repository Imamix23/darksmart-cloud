// Device authentication middleware for device-to-cloud communication
const { hashToken } = require("../utils/crypto")
const { getDeviceAccessTokensByDeviceId } = require("../../db/queries")
const { AuthenticationError } = require("../utils/errors")

const authenticateDevice = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      throw new AuthenticationError("No device token provided")
    }

    const deviceId = req.params.deviceId || req.body.deviceId

    if (!deviceId) {
      throw new AuthenticationError("Device ID required")
    }

    // Hash the token to look it up in database
    const tokenHash = hashToken(token)
    const result = await getDeviceAccessTokensByDeviceId(deviceId)

    const validToken = result.rows.find((t) => t.token_hash === tokenHash && !t.revoked)

    if (!validToken) {
      throw new AuthenticationError("Invalid device token")
    }

    // Check if token is expired
    if (validToken.expires_at && new Date(validToken.expires_at) < new Date()) {
      throw new AuthenticationError("Device token expired")
    }

    req.device = {
      id: deviceId,
      tokenId: validToken.id,
    }

    next()
  } catch (error) {
    res.status(error.statusCode || 401).json({ error: error.message })
  }
}

module.exports = {
  authenticateDevice,
}
