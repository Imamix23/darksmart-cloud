// Room management route handlers
const roomService = require("../services/room.service")

const createRoom = async (req, res, next) => {
  try {
    const { name, description } = req.body
    const ipAddress = req.ip
    const userAgent = req.get("user-agent")

    const room = await roomService.createNewRoom(req.user.id, name, description, ipAddress, userAgent)
    res.status(201).json(room)
  } catch (error) {
    next(error)
  }
}

const listRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.listRooms(req.user.id)
    res.status(200).json(rooms)
  } catch (error) {
    next(error)
  }
}

const getRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params
    const room = await roomService.getRoom(req.user.id, roomId)
    res.status(200).json(room)
  } catch (error) {
    next(error)
  }
}

const updateRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params
    const { name, description } = req.body

    const room = await roomService.updateRoomInfo(req.user.id, roomId, name, description)
    res.status(200).json(room)
  } catch (error) {
    next(error)
  }
}

const deleteRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params
    const result = await roomService.removeRoom(req.user.id, roomId)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

const addDeviceToRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params
    const { deviceId } = req.body

    const result = await roomService.addDevice(req.user.id, roomId, deviceId)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

const removeDeviceFromRoom = async (req, res, next) => {
  try {
    const { roomId, deviceId } = req.params
    const result = await roomService.removeDevice(req.user.id, roomId, deviceId)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

const getRoomDevices = async (req, res, next) => {
  try {
    const { roomId } = req.params
    const devices = await roomService.getRoomDevices(req.user.id, roomId)
    res.status(200).json(devices)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createRoom,
  listRooms,
  getRoom,
  updateRoom,
  deleteRoom,
  addDeviceToRoom,
  removeDeviceFromRoom,
  getRoomDevices,
}
