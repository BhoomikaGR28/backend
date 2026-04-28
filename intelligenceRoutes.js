// =============================================
// routes/intelligenceRoutes.js
// =============================================
// Module 3: Intelligence in Motion routes

const express = require("express");
const router = express.Router();
const {
  createTranscript,
  getTranscript,
  getAllTranscripts,
  appendMessage,
  analyzeTranscript,
} = require("../controllers/intelligenceController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// GET  /api/intelligence/transcripts     - List all transcripts
// POST /api/intelligence/transcripts     - Create new transcript
router.route("/transcripts")
  .get(getAllTranscripts)
  .post(createTranscript);

// GET /api/intelligence/transcripts/:id  - Get single transcript
router.get("/transcripts/:id", getTranscript);

// POST /api/intelligence/transcripts/:id/messages  - Append a message
router.post("/transcripts/:id/messages", appendMessage);

// POST /api/intelligence/transcripts/:id/analyze   - Run AI analysis
router.post("/transcripts/:id/analyze", analyzeTranscript);

module.exports = router;
