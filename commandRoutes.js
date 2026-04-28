// =============================================
// routes/commandRoutes.js
// =============================================
// Module 2: Live Command Center routes
// All routes are protected (require JWT)

const express = require("express");
const router = express.Router();
const {
  getSystemStats,
  getRecentConversations,
  createConversation,
  deleteConversation,
} = require("../controllers/commandController");
const { protect } = require("../middleware/authMiddleware");

// Apply protect middleware to ALL routes in this file
router.use(protect);

// GET /api/command/stats
router.get("/stats", getSystemStats);

// GET  /api/command/conversations       - List conversations
// POST /api/command/conversations       - Create conversation
router.route("/conversations")
  .get(getRecentConversations)
  .post(createConversation);

// DELETE /api/command/conversations/:id
router.delete("/conversations/:id", deleteConversation);

module.exports = router;
