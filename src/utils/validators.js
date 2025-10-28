// Input validation utilities
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password) => {
  // Min 8 chars, uppercase, lowercase, number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

const validatePasswordStrength = (password) => {
  const errors = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain lowercase letters")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain uppercase letters")
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain numbers")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 255
}

module.exports = {
  validateEmail,
  validatePassword,
  validatePasswordStrength,
  validateName,
}
