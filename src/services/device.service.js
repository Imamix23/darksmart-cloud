// Device management business logic
const { v4: uuidv4 } = require("uuid")
const {
  createDevice,
  getDevicesByUserId,
  getDeviceById,
  updateDeviceMetadata,
  updateDeviceOnlineStatus,
  deleteDevice,
  getDeviceState,
  updateDeviceState,
  createDeviceAccessToken,
  getDeviceAccessTokensByDeviceId,
  revokeDeviceAccessToken,
  createAuditLog,
} = require("../../db/queries")
const { generateToken, hashToken } = require("../utils/crypto")
const { NotFoundError, AuthorizationError } = require("../utils/errors")
const logger = require("../utils/logger")

const registerDevice = async (userId, name, type, traits, attributes, room, ipAddress, userAgent) => {
  try {
    const deviceId = `device-${type.split(".").pop()}-${uuidv4().slice(0, 8)}`

    const result = await createDevice(deviceId, userId, name, type, traits, attributes, room)
    const device = result.rows[0]

    await createAuditLog(userId, deviceId, "device_registered", ipAddress, userAgent, { name, type })

    logger.info("Device registered", { deviceId, userId, name, type })

    return {
      id: device.id,
      name: device.name,
      type: device.type,
      traits: device.traits,
      room: device.room,
      isOnline: device.is_online,
      createdAt: device.created_at,
    }
  } catch (error) {
    logger.error("Device registration failed", { userId, error: error.message })
    throw error
  }
}

const listDevices = async (userId) => {
  try {
    const result = await getDevicesByUserId(userId)
    return result.rows.map((device) => ({
      id: device.id,
      name: device.name,
      type: device.type,
      traits: device.traits,
      room: device.room,
      isOnline: device.is_online,
      lastSeen: device.last_seen,
      createdAt: device.created_at,
    }))
  } catch (error) {
    logger.error("List devices failed", { userId, error: error.message })
    throw error
  }
}

const getDevice = async (userId, deviceId) => {
  try {
    const result = await getDeviceById(deviceId)

    if (result.rows.length === 0) {
      throw new NotFoundError("Device not found")
    }

    const device = result.rows[0]

    if (device.user_id !== userId) {
      throw new AuthorizationError("You do not have access to this device")
    }

    return {
      id: device.id,
      name: device.name,
      type: device.type,
      traits: device.traits,
      attributes: device.attributes,
      room: device.room,
      isOnline: device.is_online,
      lastSeen: device.last_seen,
      createdAt: device.created_at,
    }
  } catch (error) {
    logger.error("Get device failed", { userId, deviceId, error: error.message })
    throw error
  }
}

const updateDevice = async (userId, deviceId, name, room) => {
  try {
    // Verify ownership
    const deviceResult = await getDeviceById(deviceId)
    if (deviceResult.rows.length === 0) {
      throw new NotFoundError("Device not found")
    }

    const device = deviceResult.rows[0]
    if (device.user_id !== userId) {
      throw new AuthorizationError("You do not have access to this device")
    }

    const result = await updateDeviceMetadata(deviceId, name, room)
    const updated = result.rows[0]

    logger.info("Device updated", { deviceId, userId, name, room })

    return {
      id: updated.id,
      name: updated.name,
      type: updated.type,
      room: updated.room,
      isOnline: updated.is_online,
    }
  } catch (error) {
    logger.error("Update device failed", { userId, deviceId, error: error.message })
    throw error
  }
}

const removeDevice = async (userId, deviceId) => {
  try {
    // Verify ownership
    const deviceResult = await getDeviceById(deviceId)
    if (deviceResult.rows.length === 0) {
      throw new NotFoundError("Device not found")
    }

    const device = deviceResult.rows[0]
    if (device.user_id !== userId) {
      throw new AuthorizationError("You do not have access to this device")
    }

    await deleteDevice(deviceId)

    logger.info("Device deleted", { deviceId, userId })

    return { message: "Device deleted successfully" }
  } catch (error) {
    logger.error("Delete device failed", { userId, deviceId, error: error.message })
    throw error
  }
}

const getDeviceCurrentState = async (userId, deviceId) => {
  try {
    // Verify ownership
    const deviceResult = await getDeviceById(deviceId)
    if (deviceResult.rows.length === 0) {
      throw new NotFoundError("Device not found")
    }

    const device = deviceResult.rows[0]
    if (device.user_id !== userId) {
      throw new AuthorizationError("You do not have access to this device")
    }

    const stateResult = await getDeviceState(deviceId)

    if (stateResult.rows.length === 0) {
      return { deviceId, state: {} }
    }

    const state = stateResult.rows[0]
    return {
      deviceId: state.device_id,
      state: state.state,
      updatedAt: state.updated_at,
      reportedAt: state.reported_at,
    }
  } catch (error) {
    logger.error("Get device state failed", { userId, deviceId, error: error.message })
    throw error
  }
}

const updateDeviceCurrentState = async (deviceId, state) => {
  try {
    const result = await updateDeviceState(deviceId, state)
    const updated = result.rows[0]

    logger.info("Device state updated", { deviceId, state })

    return {
      deviceId: updated.device_id,
      state: updated.state,
      updatedAt: updated.updated_at,
    }
  } catch (error) {
    logger.error("Update device state failed", { deviceId, error: error.message })
    throw error
  }
}

const generateDeviceToken = async (userId, deviceId, tokenName) => {
  try {
    // Verify ownership
    const deviceResult = await getDeviceById(deviceId)
    if (deviceResult.rows.length === 0) {
      throw new NotFoundError("Device not found")
    }

    const device = deviceResult.rows[0]
    if (device.user_id !== userId) {
      throw new AuthorizationError("You do not have access to this device")
    }

    const token = generateToken()
    const tokenHash = hashToken(token)
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year

    const result = await createDeviceAccessToken(deviceId, tokenHash, tokenName, expiresAt)
    const tokenRecord = result.rows[0]

    logger.info("Device token generated", { deviceId, userId, tokenName })

    return {
      id: tokenRecord.id,
      token, // Only return once
      name: tokenRecord.name,
      expiresAt: tokenRecord.expires_at,
    }
  } catch (error) {
    logger.error("Generate device token failed", { userId, deviceId, error: error.message })
    throw error
  }
}

const listDeviceTokens = async (userId, deviceId) => {
  try {
    // Verify ownership
    const deviceResult = await getDeviceById(deviceId)
    if (deviceResult.rows.length === 0) {
      throw new NotFoundError("Device not found")
    }

    const device = deviceResult.rows[0]
    if (device.user_id !== userId) {
      throw new AuthorizationError("You do not have access to this device")
    }

    const result = await getDeviceAccessTokensByDeviceId(deviceId)

    return result.rows.map((token) => ({
      id: token.id,
      name: token.name,
      createdAt: token.created_at,
      expiresAt: token.expires_at,
      revoked: token.revoked,
    }))
  } catch (error) {
    logger.error("List device tokens failed", { userId, deviceId, error: error.message })
    throw error
  }
}

const revokeToken = async (userId, deviceId, tokenId) => {
  try {
    // Verify ownership
    const deviceResult = await getDeviceById(deviceId)
    if (deviceResult.rows.length === 0) {
      throw new NotFoundError("Device not found")
    }

    const device = deviceResult.rows[0]
    if (device.user_id !== userId) {
      throw new AuthorizationError("You do not have access to this device")
    }

    await revokeDeviceAccessToken(tokenId)

    logger.info("Device token revoked", { deviceId, userId, tokenId })

    return { message: "Token revoked successfully" }
  } catch (error) {
    logger.error("Revoke device token failed", { userId, deviceId, tokenId, error: error.message })
    throw error
  }
}

module.exports = {
  registerDevice,
  listDevices,
  getDevice,
  updateDevice,
  removeDevice,
  getDeviceCurrentState,
  updateDeviceCurrentState,
  generateDeviceToken,
  listDeviceTokens,
  revokeToken,
}
