// Device management route handlers
const deviceService = require("../services/device.service")
const logger = require("../utils/logger")

const registerDevice = async (req, res, next) => {
  try {
    const { name, type, traits, attributes, room } = req.body
    const ipAddress = req.ip
    const userAgent = req.get("user-agent")

    const device = await deviceService.registerDevice(
      req.user.id,
      name,
      type,
      traits || [],
      attributes || {},
      room,
      ipAddress,
      userAgent,
    )

    res.status(201).json(device)
  } catch (error) {
    next(error)
  }
}

const listDevices = async (req, res, next) => {
  try {
    const devices = await deviceService.listDevices(req.user.id)
    res.status(200).json(devices)
  } catch (error) {
    next(error)
  }
}

const getDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params
    const device = await deviceService.getDevice(req.user.id, deviceId)
    res.status(200).json(device)
  } catch (error) {
    next(error)
  }
}

const updateDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params
    const { name, room } = req.body

    const device = await deviceService.updateDevice(req.user.id, deviceId, name, room)
    res.status(200).json(device)
  } catch (error) {
    next(error)
  }
}

const deleteDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params
    const result = await deviceService.removeDevice(req.user.id, deviceId)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

const getDeviceState = async (req, res, next) => {
  try {
    const { deviceId } = req.params
    const state = await deviceService.getDeviceCurrentState(req.user.id, deviceId)
    res.status(200).json(state)
  } catch (error) {
    next(error)
  }
}

const updateDeviceState = async (req, res, next) => {
  try {
    const { deviceId } = req.params
    const { state } = req.body

    const updated = await deviceService.updateDeviceCurrentState(deviceId, state)
    res.status(200).json(updated)
  } catch (error) {
    next(error)
  }
}

const generateToken = async (req, res, next) => {
  try {
    const { deviceId } = req.params
    const { name } = req.body

    const token = await deviceService.generateDeviceToken(req.user.id, deviceId, name)
    res.status(201).json(token)
  } catch (error) {
    next(error)
  }
}

const listTokens = async (req, res, next) => {
  try {
    const { deviceId } = req.params
    const tokens = await deviceService.listDeviceTokens(req.user.id, deviceId)
    res.status(200).json(tokens)
  } catch (error) {
    next(error)
  }
}

const revokeToken = async (req, res, next) => {
  try {
    const { deviceId, tokenId } = req.params
    const result = await deviceService.revokeToken(req.user.id, deviceId, tokenId)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  registerDevice,
  listDevices,
  getDevice,
  updateDevice,
  deleteDevice,
  getDeviceState,
  updateDeviceState,
  generateToken,
  listTokens,
  revokeToken,
}
