// Room management business logic
const {
  createRoom,
  getRoomsByUserId,
  getRoomById,
  updateRoom,
  deleteRoom,
  addDeviceToRoom,
  removeDeviceFromRoom,
  getDevicesInRoom,
  createAuditLog,
} = require("../../db/queries")
const { NotFoundError, AuthorizationError } = require("../utils/errors")
const logger = require("../utils/logger")

const createNewRoom = async (userId, name, description, ipAddress, userAgent) => {
  try {
    const result = await createRoom(userId, name, description)
    const room = result.rows[0]

    await createAuditLog(userId, null, "room_created", ipAddress, userAgent, { roomId: room.id, name })

    logger.info("Room created", { roomId: room.id, userId, name })

    return {
      id: room.id,
      name: room.name,
      description: room.description,
      createdAt: room.created_at,
    }
  } catch (error) {
    logger.error("Create room failed", { userId, error: error.message })
    throw error
  }
}

const listRooms = async (userId) => {
  try {
    const result = await getRoomsByUserId(userId)
    return result.rows.map((room) => ({
      id: room.id,
      name: room.name,
      description: room.description,
      createdAt: room.created_at,
    }))
  } catch (error) {
    logger.error("List rooms failed", { userId, error: error.message })
    throw error
  }
}

const getRoom = async (userId, roomId) => {
  try {
    const result = await getRoomById(roomId)

    if (result.rows.length === 0) {
      throw new NotFoundError("Room not found")
    }

    const room = result.rows[0]

    if (room.user_id !== userId) {
      throw new AuthorizationError("You do not have access to this room")
    }

    return {
      id: room.id,
      name: room.name,
      description: room.description,
      createdAt: room.created_at,
    }
  } catch (error) {
    logger.error("Get room failed", { userId, roomId, error: error.message })
    throw error
  }
}

const updateRoomInfo = async (userId, roomId, name, description) => {
  try {
    // Verify ownership
    const roomResult = await getRoomById(roomId)
    if (roomResult.rows.length === 0) {
      throw new NotFoundError("Room not found")
    }

    const room = roomResult.rows[0]
    if (room.user_id !== userId) {
      throw new AuthorizationError("You do not have access to this room")
    }

    const result = await updateRoom(roomId, name, description)
    const updated = result.rows[0]

    logger.info("Room updated", { roomId, userId, name })

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
    }
  } catch (error) {
    logger.error("Update room failed", { userId, roomId, error: error.message })
    throw error
  }
}

const removeRoom = async (userId, roomId) => {
  try {
    // Verify ownership
    const roomResult = await getRoomById(roomId)
    if (roomResult.rows.length === 0) {
      throw new NotFoundError("Room not found")
    }

    const room = roomResult.rows[0]
    if (room.user_id !== userId) {
      throw new AuthorizationError("You do not have access to this room")
    }

    await deleteRoom(roomId)

    logger.info("Room deleted", { roomId, userId })

    return { message: "Room deleted successfully" }
  } catch (error) {
    logger.error("Delete room failed", { userId, roomId, error: error.message })
    throw error
  }
}

const addDevice = async (userId, roomId, deviceId) => {
  try {
    // Verify room ownership
    const roomResult = await getRoomById(roomId)
    if (roomResult.rows.length === 0) {
      throw new NotFoundError("Room not found")
    }

    const room = roomResult.rows[0]
    if (room.user_id !== userId) {
      throw new AuthorizationError("You do not have access to this room")
    }

    await addDeviceToRoom(roomId, deviceId)

    logger.info("Device added to room", { roomId, deviceId, userId })

    return { message: "Device added to room" }
  } catch (error) {
    logger.error("Add device to room failed", { userId, roomId, deviceId, error: error.message })
    throw error
  }
}

const removeDevice = async (userId, roomId, deviceId) => {
  try {
    // Verify room ownership
    const roomResult = await getRoomById(roomId)
    if (roomResult.rows.length === 0) {
      throw new NotFoundError("Room not found")
    }

    const room = roomResult.rows[0]
    if (room.user_id !== userId) {
      throw new AuthorizationError("You do not have access to this room")
    }

    await removeDeviceFromRoom(roomId, deviceId)

    logger.info("Device removed from room", { roomId, deviceId, userId })

    return { message: "Device removed from room" }
  } catch (error) {
    logger.error("Remove device from room failed", { userId, roomId, deviceId, error: error.message })
    throw error
  }
}

const getRoomDevices = async (userId, roomId) => {
  try {
    // Verify room ownership
    const roomResult = await getRoomById(roomId)
    if (roomResult.rows.length === 0) {
      throw new NotFoundError("Room not found")
    }

    const room = roomResult.rows[0]
    if (room.user_id !== userId) {
      throw new AuthorizationError("You do not have access to this room")
    }

    const result = await getDevicesInRoom(roomId)

    return result.rows.map((device) => ({
      id: device.id,
      name: device.name,
      type: device.type,
      isOnline: device.is_online,
    }))
  } catch (error) {
    logger.error("Get room devices failed", { userId, roomId, error: error.message })
    throw error
  }
}

module.exports = {
  createNewRoom,
  listRooms,
  getRoom,
  updateRoomInfo,
  removeRoom,
  addDevice,
  removeDevice,
  getRoomDevices,
}
