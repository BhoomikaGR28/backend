// =============================================
// models/Meeting.js - Meeting Archive Schema
// =============================================
// Stores finalized meeting records in the
// Cognitive Repository (Archive module).
// Supports full-text search, keyword & participant filtering.

const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Meeting title is required"],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number,           // Duration in minutes
      default: 0,
    },
    participants: [
      {
        name: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true },
        role: { type: String, default: "attendee" },
      },
    ],
    transcript: {
      type: String,           // Full transcript text (for search)
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative", "mixed"],
      default: "neutral",
    },
    actionItems: [String],
    keywords: [String],       // Auto-extracted keywords for filtering
    tags: [String],           // User-assigned tags
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
  },
  { timestamps: true }
);

// =============================================
// TEXT INDEX - Enables MongoDB full-text search
// =============================================
// This lets us do $text searches across title,
// transcript, summary, and participant names.
MeetingSchema.index({
  title: "text",
  transcript: "text",
  summary: "text",
  keywords: "text",
});

module.exports = mongoose.model("Meeting", MeetingSchema);
