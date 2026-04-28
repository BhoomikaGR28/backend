// =============================================
// controllers/authController.js
// =============================================
// Handles: Signup, Login
// These are the functions called by the auth routes.

const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const Settings = require("../models/Settings");
const { AppError, asyncHandler } = require("../middleware/errorMiddleware");

// =============================================
// Helper: Generate JWT Token
// =============================================
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                          // Payload - what's encoded inside
    process.env.JWT_SECRET,                  // Secret key to sign with
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // Token expiry
  );
};

// =============================================
// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
// =============================================
const signup = asyncHandler(async (req, res) => {
  // Check for validation errors (from express-validator in the route)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password } = req.body;

  // Check if a user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("An account with this email already exists", 400);
  }

  // Create the new user (password is hashed via pre-save hook in User model)
  const user = await User.create({ name, email, password });

  // Auto-create default settings for the new user
  await Settings.create({ user: user._id });

  // Generate JWT
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// =============================================
// @route   POST /api/auth/login
// @desc    Login user and return JWT
// @access  Public
// =============================================
const login = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  // Find user by email - include password (it's excluded by default)
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare the entered password with the hashed one
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// =============================================
// @route   GET /api/auth/me
// @desc    Get current logged-in user profile
// @access  Private (requires token)
// =============================================
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

module.exports = { signup, login, getMe };
