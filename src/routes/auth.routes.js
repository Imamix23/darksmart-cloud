// Authentication routes
const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const { validateSignup, validateLogin } = require("../middleware/validation.middleware")
const { loginLimiter, signupLimiter } = require("../middleware/rateLimit.middleware")
const { authenticateToken } = require("../middleware/auth.middleware")

// Public routes
router.post("/signup", signupLimiter, validateSignup, authController.signup)
router.post("/login", loginLimiter, validateLogin, authController.login)

// Protected routes
router.get("/me", authenticateToken, authController.getCurrentUser)
router.post("/logout", authenticateToken, authController.logout)

module.exports = router
