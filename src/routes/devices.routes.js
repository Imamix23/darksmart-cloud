// Device management routes
const express = require("express")
const router = express.Router()
const devicesController = require("../controllers/devices.controller")
const { authenticateToken } = require("../middleware/auth.middleware")
const { apiLimiter } = require("../middleware/rateLimit.middleware")

// All device routes require authentication
router.use(authenticateToken)
router.use(apiLimiter)

// Device management
router.post("/", devicesController.registerDevice)
router.get("/", devicesController.listDevices)
router.get("/:deviceId", devicesController.getDevice)
router.patch("/:deviceId", devicesController.updateDevice)
router.delete("/:deviceId", devicesController.deleteDevice)

// Device state
router.get("/:deviceId/state", devicesController.getDeviceState)
router.post("/:deviceId/state", devicesController.updateDeviceState)

// Device tokens
router.post("/:deviceId/tokens", devicesController.generateToken)
router.get("/:deviceId/tokens", devicesController.listTokens)
router.delete("/:deviceId/tokens/:tokenId", devicesController.revokeToken)

module.exports = router
