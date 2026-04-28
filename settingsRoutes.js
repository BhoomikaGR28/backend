// =============================================
// routes/settingsRoutes.js
// =============================================
// Module 5: Core Parameters routes

const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateSettings,
  updateIntegration,
  updateToggles,
  resetSettings,
} = require("../controllers/settingsController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// GET /api/settings    - Get current settings
// PUT /api/settings    - Update settings (partial or full)
router.route("/")
  .get(getSettings)
  .put(updateSettings);

// PATCH /api/settings/integrations   - Enable/disable integrations
router.patch("/integrations", updateIntegration);

// PATCH /api/settings/toggles        - Update feature toggles
router.patch("/toggles", updateToggles);

// POST /api/settings/reset           - Reset to defaults
router.post("/reset", resetSettings);

module.exports = router;
