// =============================================
// controllers/settingsController.js
// =============================================
// Module 5: Core Parameters (Settings)
// Handles: Fetching and updating user preferences

const Settings = require("../models/Settings");
const { asyncHandler } = require("../middleware/errorMiddleware");

// =============================================
// @route   GET /api/settings
// @desc    Get settings for the logged-in user
// @access  Private
// =============================================
const getSettings = asyncHandler(async (req, res) => {
  // Try to find existing settings, or create defaults if none exist
  let settings = await Settings.findOne({ user: req.user._id });

  if (!settings) {
    // Auto-create default settings if they don't exist yet
    settings = await Settings.create({ user: req.user._id });
  }

  res.json({ success: true, settings });
});

// =============================================
// @route   PUT /api/settings
// @desc    Update user settings (full or partial update)
// @access  Private
// =============================================
const updateSettings = asyncHandler(async (req, res) => {
  // findOneAndUpdate with upsert:true creates the doc if it doesn't exist
  const settings = await Settings.findOneAndUpdate(
    { user: req.user._id },           // Find by user
    { $set: req.body },               // Only update provided fields (partial update)
    {
      new: true,                      // Return the updated document
      upsert: true,                   // Create if doesn't exist
      runValidators: true,            // Validate against schema
    }
  );

  res.json({ success: true, message: "Settings updated", settings });
});

// =============================================
// @route   PATCH /api/settings/integrations
// @desc    Enable/disable a specific integration
// @access  Private
// =============================================
const updateIntegration = asyncHandler(async (req, res) => {
  const { integration, enabled, config } = req.body;

  // Allowed integrations
  const validIntegrations = ["slack", "github", "notion"];
  if (!validIntegrations.includes(integration)) {
    return res.status(400).json({
      success: false,
      message: `Invalid integration. Must be one of: ${validIntegrations.join(", ")}`,
    });
  }

  // Build dynamic update object for the specific integration
  const updateData = { [`integrations.${integration}.enabled`]: enabled };
  if (config) {
    Object.keys(config).forEach((key) => {
      updateData[`integrations.${integration}.${key}`] = config[key];
    });
  }

  const settings = await Settings.findOneAndUpdate(
    { user: req.user._id },
    { $set: updateData },
    { new: true, upsert: true }
  );

  res.json({
    success: true,
    message: `${integration} integration ${enabled ? "enabled" : "disabled"}`,
    integration: settings.integrations[integration],
  });
});

// =============================================
// @route   PATCH /api/settings/toggles
// @desc    Update one or more feature toggles
// @access  Private
// =============================================
const updateToggles = asyncHandler(async (req, res) => {
  const toggleUpdates = req.body; // e.g. { darkMode: true, autoSummary: false }

  const validToggles = ["autoSummary", "sentimentAnalysis", "actionItemExtraction",
    "realTimeTranscription", "emailNotifications", "darkMode", "compactView"];

  // Build update object, only for valid toggles
  const updateData = {};
  Object.keys(toggleUpdates).forEach((key) => {
    if (validToggles.includes(key)) {
      updateData[`toggles.${key}`] = toggleUpdates[key];
    }
  });

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ success: false, message: "No valid toggles provided" });
  }

  const settings = await Settings.findOneAndUpdate(
    { user: req.user._id },
    { $set: updateData },
    { new: true, upsert: true }
  );

  res.json({ success: true, message: "Toggles updated", toggles: settings.toggles });
});

// =============================================
// @route   POST /api/settings/reset
// @desc    Reset settings to defaults
// @access  Private
// =============================================
const resetSettings = asyncHandler(async (req, res) => {
  // Delete existing settings, then create fresh defaults
  await Settings.findOneAndDelete({ user: req.user._id });
  const settings = await Settings.create({ user: req.user._id });

  res.json({ success: true, message: "Settings reset to defaults", settings });
});

module.exports = { getSettings, updateSettings, updateIntegration, updateToggles, resetSettings };
