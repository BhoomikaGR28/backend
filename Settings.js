// =============================================
// models/Settings.js - User Settings Schema
// =============================================
// Stores per-user preferences for the
// Core Parameters (Settings) module.
// One settings document per user.

const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,         // Each user has exactly one settings document
    },

    // AI Mode configuration
    aiMode: {
      type: String,
      enum: ["standard", "enhanced", "turbo", "research"],
      default: "standard",
    },
    responseStyle: {
      type: String,
      enum: ["concise", "balanced", "detailed"],
      default: "balanced",
    },
    language: {
      type: String,
      default: "en",
    },

    // Third-party integrations
    integrations: {
      slack: {
        enabled: { type: Boolean, default: false },
        webhookUrl: { type: String, default: "" },
        channelName: { type: String, default: "" },
      },
      github: {
        enabled: { type: Boolean, default: false },
        repoUrl: { type: String, default: "" },
        accessToken: { type: String, default: "", select: false }, // Hide by default
      },
      notion: {
        enabled: { type: Boolean, default: false },
        workspaceId: { type: String, default: "" },
        apiKey: { type: String, default: "", select: false },
      },
    },

    // Feature toggles
    toggles: {
      autoSummary: { type: Boolean, default: true },
      sentimentAnalysis: { type: Boolean, default: true },
      actionItemExtraction: { type: Boolean, default: true },
      realTimeTranscription: { type: Boolean, default: false },
      emailNotifications: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: false },
      compactView: { type: Boolean, default: false },
    },

    // Notification preferences
    notifications: {
      email: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
      digest: {
        type: String,
        enum: ["none", "daily", "weekly"],
        default: "daily",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema);
