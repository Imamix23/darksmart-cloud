// Reusable database query functions
const pool = require("./pool")

// User queries
const getUserById = (id) => pool.query("SELECT * FROM users WHERE id = $1", [id])
const getUserByEmail = (email) => pool.query("SELECT * FROM users WHERE email = $1", [email])
const createUser = (email, passwordHash, name) =>
  pool.query("INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING *", [
    email,
    passwordHash,
    name,
  ])

// Device queries
const createDevice = (deviceId, userId, name, type, traits, attributes, room) =>
  pool.query(
    "INSERT INTO devices (id, user_id, name, type, traits, attributes, room, is_online) VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *",
    [deviceId, userId, name, type, JSON.stringify(traits), JSON.stringify(attributes), room],
  )

const getDevicesByUserId = (userId) =>
  pool.query("SELECT * FROM devices WHERE user_id = $1 ORDER BY created_at DESC", [userId])

const getDeviceById = (deviceId) => pool.query("SELECT * FROM devices WHERE id = $1", [deviceId])

const updateDeviceMetadata = (deviceId, name, room) =>
  pool.query("UPDATE devices SET name = $1, room = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *", [
    name,
    room,
    deviceId,
  ])

const updateDeviceOnlineStatus = (deviceId, isOnline) =>
  pool.query(
    "UPDATE devices SET is_online = $1, last_seen = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
    [isOnline, deviceId],
  )

const deleteDevice = (deviceId) => pool.query("DELETE FROM devices WHERE id = $1 RETURNING *", [deviceId])

// Device state queries
const getDeviceState = (deviceId) => pool.query("SELECT * FROM device_states WHERE device_id = $1", [deviceId])

const updateDeviceState = (deviceId, state) =>
  pool.query(
    "INSERT INTO device_states (device_id, state, updated_at, reported_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ON CONFLICT (device_id) DO UPDATE SET state = $2, updated_at = CURRENT_TIMESTAMP, reported_at = CURRENT_TIMESTAMP RETURNING *",
    [deviceId, JSON.stringify(state)],
  )

// Device access token queries
const createDeviceAccessToken = (deviceId, tokenHash, name, expiresAt) =>
  pool.query(
    "INSERT INTO device_access_tokens (device_id, token_hash, name, expires_at) VALUES ($1, $2, $3, $4) RETURNING *",
    [deviceId, tokenHash, name, expiresAt],
  )

const getDeviceAccessTokensByDeviceId = (deviceId) =>
  pool.query(
    "SELECT id, device_id, name, created_at, expires_at, revoked FROM device_access_tokens WHERE device_id = $1",
    [deviceId],
  )

const revokeDeviceAccessToken = (tokenId) =>
  pool.query("UPDATE device_access_tokens SET revoked = true WHERE id = $1 RETURNING *", [tokenId])

// Room queries
const createRoom = (userId, name, description) =>
  pool.query("INSERT INTO rooms (user_id, name, description) VALUES ($1, $2, $3) RETURNING *", [
    userId,
    name,
    description,
  ])

const getRoomsByUserId = (userId) =>
  pool.query("SELECT * FROM rooms WHERE user_id = $1 ORDER BY created_at DESC", [userId])

const getRoomById = (roomId) => pool.query("SELECT * FROM rooms WHERE id = $1", [roomId])

const updateRoom = (roomId, name, description) =>
  pool.query("UPDATE rooms SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *", [
    name,
    description,
    roomId,
  ])

const deleteRoom = (roomId) => pool.query("DELETE FROM rooms WHERE id = $1 RETURNING *", [roomId])

const addDeviceToRoom = (roomId, deviceId) =>
  pool.query("INSERT INTO room_devices (room_id, device_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *", [
    roomId,
    deviceId,
  ])

const removeDeviceFromRoom = (roomId, deviceId) =>
  pool.query("DELETE FROM room_devices WHERE room_id = $1 AND device_id = $2 RETURNING *", [roomId, deviceId])

const getDevicesInRoom = (roomId) =>
  pool.query("SELECT d.* FROM devices d JOIN room_devices rd ON d.id = rd.device_id WHERE rd.room_id = $1", [roomId])

// OAuth token queries
const createOAuthToken = (userId, accessTokenHash, refreshTokenHash, clientId, scope, expiresAt) =>
  pool.query(
    "INSERT INTO oauth_tokens (user_id, access_token_hash, refresh_token_hash, client_id, scope, expires_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [userId, accessTokenHash, refreshTokenHash, clientId, scope, expiresAt],
  )
const getOAuthTokenByAccessHash = (hash) =>
  pool.query("SELECT * FROM oauth_tokens WHERE access_token_hash = $1 AND revoked = false", [hash])

// Audit log queries
const createAuditLog = (userId, deviceId, action, ipAddress, userAgent, metadata) =>
  pool.query(
    "INSERT INTO audit_logs (user_id, device_id, action, ip_address, user_agent, metadata) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [userId, deviceId, action, ipAddress, userAgent, JSON.stringify(metadata)],
  )

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
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
  createRoom,
  getRoomsByUserId,
  getRoomById,
  updateRoom,
  deleteRoom,
  addDeviceToRoom,
  removeDeviceFromRoom,
  getDevicesInRoom,
  createOAuthToken,
  getOAuthTokenByAccessHash,
  createAuditLog,
  pool,
}
