// Room management routes
const express = require("express")
const router = express.Router()
const roomsController = require("../controllers/rooms.controller")
const { authenticateToken } = require("../middleware/auth.middleware")
const { apiLimiter } = require("../middleware/rateLimit.middleware")

// All room routes require authentication
router.use(authenticateToken)
router.use(apiLimiter)

// Room management
router.post("/", roomsController.createRoom)
router.get("/", roomsController.listRooms)
router.get("/:roomId", roomsController.getRoom)
router.patch("/:roomId", roomsController.updateRoom)
router.delete("/:roomId", roomsController.deleteRoom)

// Room devices
router.post("/:roomId/devices", roomsController.addDeviceToRoom)
router.get("/:roomId/devices", roomsController.getRoomDevices)
router.delete("/:roomId/devices/:deviceId", roomsController.removeDeviceFromRoom)

module.exports = router
