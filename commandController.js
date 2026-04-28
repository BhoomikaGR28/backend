// =============================================
// controllers/commandController.js
// =============================================
// Module 2: Live Command Center
// Handles: System stats, recent conversations

const Conversation = require("../models/Conversation");
const { asyncHandler } = require("../middleware/errorMiddleware");

// =============================================
// @route   GET /api/command/stats
// @desc    Get real-time system stats (latency, token efficiency)
// @access  Private
// =============================================
const getSystemStats = asyncHandler(async (req, res) => {
  // In a real app, these would come from monitoring services (Datadog, Prometheus, etc.)
  // Here we generate realistic mock stats with slight randomness

  const stats = {
    latency: {
      current: Math.floor(Math.random() * 50) + 20,     // 20–70ms
      average: Math.floor(Math.random() * 30) + 30,     // 30–60ms
      p95: Math.floor(Math.random() * 80) + 80,         // 80–160ms
      unit: "ms",
    },
    tokenEfficiency: {
      current: parseFloat((Math.random() * 0.2 + 0.78).toFixed(3)), // 0.78–0.98
      average: 0.85,
      tokensProcessed: Math.floor(Math.random() * 50000) + 100000,  // 100k–150k
      unit: "ratio",
    },
    activeConnections: Math.floor(Math.random() * 50) + 10,
    requestsPerMinute: Math.floor(Math.random() * 200) + 50,
    uptime: "99.97%",
    modelVersion: "cognitive-ai-v2.4",
    lastUpdated: new Date(),
  };

  res.json({ success: true, stats });
});

// =============================================
// @route   GET /api/command/conversations
// @desc    Get recent conversations for the logged-in user
// @access  Private
// =============================================
const getRecentConversations = asyncHandler(async (req, res) => {
  // Pagination support via query params: ?page=1&limit=10
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const conversations = await Conversation.find({ user: req.user._id })
    .sort({ lastMessageAt: -1 })   // Most recent first
    .skip(skip)
    .limit(limit);

  const total = await Conversation.countDocuments({ user: req.user._id });

  res.json({
    success: true,
    count: conversations.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    conversations,
  });
});

// =============================================
// @route   POST /api/command/conversations
// @desc    Create a new conversation
// @access  Private
// =============================================
const createConversation = asyncHandler(async (req, res) => {
  const { title, preview, tags } = req.body;

  const conversation = await Conversation.create({
    user: req.user._id,
    title,
    preview,
    tags: tags || [],
  });

  res.status(201).json({ success: true, conversation });
});

// =============================================
// @route   DELETE /api/command/conversations/:id
// @desc    Delete a conversation
// @access  Private
// =============================================
const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    user: req.user._id,   // Ensures users can only delete their own
  });

  if (!conversation) {
    return res.status(404).json({ success: false, message: "Conversation not found" });
  }

  await conversation.deleteOne();
  res.json({ success: true, message: "Conversation deleted" });
});

module.exports = { getSystemStats, getRecentConversations, createConversation, deleteConversation };
