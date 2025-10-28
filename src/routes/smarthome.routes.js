// Google Home fulfillment routes
const express = require("express")
const router = express.Router()
const smarthomeController = require("../controllers/smarthome.controller")
const { authenticateToken } = require("../middleware/auth.middleware")
const { authenticateDevice } = require("../middleware/deviceAuth.middleware")

// Google Home fulfillment endpoint (requires OAuth token)
router.post("/fulfillment", authenticateToken, smarthomeController.handleFulfillment)

// Request sync endpoint
router.post("/request-sync", authenticateToken, smarthomeController.requestSync)

// Report state endpoint (can be called by device or user)
router.post("/report-state", authenticateToken, smarthomeController.reportState)

// Device state update endpoint (for physical devices)
router.post("/devices/:deviceId/state", authenticateDevice, async (req, res, next) => {
  try {
    const { state } = req.body
    const result = await require("../services/googleHome.service").reportState(req.device.id, req.device.id, state)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = router
