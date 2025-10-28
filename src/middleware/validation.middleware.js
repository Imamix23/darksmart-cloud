// Request validation middleware
const { ValidationError } = require("../utils/errors")
const { validateEmail, validatePasswordStrength, validateName } = require("../utils/validators")

const validateSignup = (req, res, next) => {
  try {
    const { email, password, name } = req.body

    if (!email || !validateEmail(email)) {
      throw new ValidationError("Invalid email format")
    }

    if (!password) {
      throw new ValidationError("Password is required")
    }

    const passwordCheck = validatePasswordStrength(password)
    if (!passwordCheck.isValid) {
      throw new ValidationError(passwordCheck.errors.join(", "))
    }

    if (!name || !validateName(name)) {
      throw new ValidationError("Name must be between 2 and 255 characters")
    }

    next()
  } catch (error) {
    res.status(error.statusCode || 400).json({ error: error.message })
  }
}

const validateLogin = (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !validateEmail(email)) {
      throw new ValidationError("Invalid email format")
    }

    if (!password) {
      throw new ValidationError("Password is required")
    }

    next()
  } catch (error) {
    res.status(error.statusCode || 400).json({ error: error.message })
  }
}

module.exports = {
  validateSignup,
  validateLogin,
}
