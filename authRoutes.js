// =============================================
// routes/authRoutes.js
// =============================================
// Maps HTTP endpoints to controller functions.
// Also applies express-validator rules here.

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { signup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Validation rules for signup
const signupValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

// Validation rules for login
const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// POST /api/auth/signup
router.post("/signup", signupValidation, signup);

// POST /api/auth/login
router.post("/login", loginValidation, login);

// GET /api/auth/me - Protected route (requires JWT)
router.get("/me", protect, getMe);

module.exports = router;
