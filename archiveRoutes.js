// =============================================
// routes/archiveRoutes.js
// =============================================
// Module 4: Cognitive Repository routes

const express = require("express");
const router = express.Router();
const {
  getMeetings,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  searchMeetings,
} = require("../controllers/archiveController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// GET /api/archive/search?q=keyword    - Full-text search
router.get("/search", searchMeetings);

// GET  /api/archive/meetings           - List/filter meetings
// POST /api/archive/meetings           - Create meeting
router.route("/meetings")
  .get(getMeetings)
  .post(createMeeting);

// GET    /api/archive/meetings/:id     - Get meeting details
// PUT    /api/archive/meetings/:id     - Update meeting
// DELETE /api/archive/meetings/:id     - Delete meeting
router.route("/meetings/:id")
  .get(getMeetingById)
  .put(updateMeeting)
  .delete(deleteMeeting);

module.exports = router;
