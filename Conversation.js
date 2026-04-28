// =============================================
// models/Conversation.js - Conversation Schema
// =============================================
// Stores individual conversations shown in the
// Live Command Center (recent conversations list).

const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",           // Links to the User who owns this
      required: true,
    },
    title: {
      type: String,
      required: [true, "Conversation title is required"],
      trim: true,
    },
    preview: {
      type: String,          // Short preview text shown in the list
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "archived", "resolved"],
      default: "active",
    },
    tags: [String],          // e.g. ["sales", "support", "onboarding"]
    messageCount: {
      type: Number,
      default: 0,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
