// =============================================
// models/Transcript.js - Live Transcript Schema
// =============================================
// Stores a live/active transcript session.
// Messages are appended in real-time.
// Used by the "Intelligence in Motion" module.

const mongoose = require("mongoose");

// Each individual message in the transcript
const MessageSchema = new mongoose.Schema({
  speaker: {
    type: String,
    required: true,
    trim: true,            // e.g. "Alice", "Bot", "Agent"
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "agent", "system"],
    default: "user",
  },
});

// AI-generated analysis of the full transcript
const AnalysisSchema = new mongoose.Schema({
  summary: String,
  sentiment: {
    type: String,
    enum: ["positive", "neutral", "negative", "mixed"],
    default: "neutral",
  },
  sentimentScore: {
    type: Number,
    min: -1,
    max: 1,
    default: 0,
  },
  actionItems: [String],   // List of follow-up tasks
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

const TranscriptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Transcript title is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["live", "completed", "archived"],
      default: "live",
    },
    participants: [String],  // Names of speakers e.g. ["Alice", "Bob"]
    messages: [MessageSchema],
    analysis: AnalysisSchema,  // Populated when analysis is requested
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transcript", TranscriptSchema);
