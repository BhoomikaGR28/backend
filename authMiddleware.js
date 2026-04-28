// =============================================
// middleware/authMiddleware.js - JWT Guard
// =============================================
// This middleware protects private routes.
// Attach it to any route that requires login.
//
// How it works:
// 1. Reads the Authorization header: "Bearer <token>"
// 2. Verifies the JWT signature
// 3. Attaches the decoded user to req.user
// 4. Calls next() to proceed, or returns 401 if invalid

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract the token part (after "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User no longer exists" });
      }

      next(); // Token is valid, proceed to the route handler
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
