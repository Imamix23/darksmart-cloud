// Google Home fulfillment API handlers
const googleHomeService = require("../services/googleHome.service")
const { createAuditLog } = require("../../db/queries")
const logger = require("../utils/logger")

const handleFulfillment = async (req, res, next) => {
  try {
    const { requestId, inputs } = req.body
    const userId = req.user?.id

    if (!inputs || inputs.length === 0) {
      return res.status(400).json({ error: "No inputs provided" })
    }

    const responses = []

    for (const input of inputs) {
      const { intent, payload } = input

      let response

      switch (intent) {
        case "action.devices.SYNC":
          response = await googleHomeService.handleSync(userId)
          break

        case "action.devices.QUERY":
          response = await googleHomeService.handleQuery(
            userId,
            payload.devices.map((d) => d.id),
          )
          break

        case "action.devices.EXECUTE":
          response = await googleHomeService.handleExecute(userId, payload.commands)
          break

        case "action.devices.DISCONNECT":
          response = await googleHomeService.handleDisconnect(userId)
          break

        default:
          response = {
            requestId,
            payload: {
              errorCode: "unsupportedIntent",
            },
          }
      }

      responses.push(response)

      // Log the intent
      if (userId) {
        await createAuditLog(userId, null, `google_home_${intent.toLowerCase()}`, req.ip, req.get("user-agent"), {
          intent,
        })
      }
    }

    res.status(200).json({
      requestId,
      payload: responses.length === 1 ? responses[0].payload : { responses },
    })
  } catch (error) {
    next(error)
  }
}

const requestSync = async (req, res, next) => {
  try {
    const result = await googleHomeService.requestSync(req.user.id)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

const reportState = async (req, res, next) => {
  try {
    const { deviceId, state } = req.body

    const result = await googleHomeService.reportState(req.user.id, deviceId, state)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  handleFulfillment,
  requestSync,
  reportState,
}
