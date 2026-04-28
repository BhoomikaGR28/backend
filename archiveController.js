// =============================================
// controllers/archiveController.js
// =============================================
// Module 4: Cognitive Repository (Archive)
// Handles: Storing meetings, search, filtering

const Meeting = require("../models/Meeting");
const { AppError, asyncHandler } = require("../middleware/errorMiddleware");

// =============================================
// @route   GET /api/archive/meetings
// @desc    Get all meetings with optional filtering
// @access  Private
//
// Query params:
//   ?keyword=sales        - search in title/transcript/summary
//   ?participant=alice    - filter by participant name/email
//   ?tag=important        - filter by tag
//   ?sentiment=positive   - filter by sentiment
//   ?page=1&limit=10      - pagination
// =============================================
const getMeetings = asyncHandler(async (req, res) => {
  const { keyword, participant, tag, sentiment, page = 1, limit = 10 } = req.query;

  // Start with a base filter for the current user
  let filter = { user: req.user._id };

  // --- Keyword Search ---
  // Uses MongoDB's $text index (defined in Meeting model)
  if (keyword) {
    filter.$text = { $search: keyword };
  }

  // --- Participant Filter ---
  // Searches both participant name and email
  if (participant) {
    filter["participants"] = {
      $elemMatch: {
        $or: [
          { name: { $regex: participant, $options: "i" } },     // case-insensitive
          { email: { $regex: participant, $options: "i" } },
        ],
      },
    };
  }

  // --- Tag Filter ---
  if (tag) {
    filter.tags = { $in: [tag] };
  }

  // --- Sentiment Filter ---
  if (sentiment) {
    filter.sentiment = sentiment;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const meetings = await Meeting.find(filter)
    .sort({ date: -1 })     // Most recent first
    .skip(skip)
    .limit(parseInt(limit))
    .select("-transcript"); // Exclude full transcript in list for performance

  const total = await Meeting.countDocuments(filter);

  res.json({
    success: true,
    count: meetings.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    meetings,
  });
});

// =============================================
// @route   GET /api/archive/meetings/:id
// @desc    Get a single meeting (full transcript)
// @access  Private
// =============================================
const getMeetingById = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findOne({ _id: req.params.id, user: req.user._id });

  if (!meeting) {
    throw new AppError("Meeting not found", 404);
  }

  res.json({ success: true, meeting });
});

// =============================================
// @route   POST /api/archive/meetings
// @desc    Store a new meeting in the archive
// @access  Private
// =============================================
const createMeeting = asyncHandler(async (req, res) => {
  const { title, date, duration, participants, transcript, summary, sentiment, actionItems, keywords, tags } = req.body;

  if (!title) {
    throw new AppError("Meeting title is required", 400);
  }

  const meeting = await Meeting.create({
    user: req.user._id,
    title,
    date: date || new Date(),
    duration,
    participants: participants || [],
    transcript,
    summary,
    sentiment: sentiment || "neutral",
    actionItems: actionItems || [],
    keywords: keywords || [],
    tags: tags || [],
  });

  res.status(201).json({ success: true, message: "Meeting archived successfully", meeting });
});

// =============================================
// @route   PUT /api/archive/meetings/:id
// @desc    Update a meeting record
// @access  Private
// =============================================
const updateMeeting = asyncHandler(async (req, res) => {
  let meeting = await Meeting.findOne({ _id: req.params.id, user: req.user._id });

  if (!meeting) {
    throw new AppError("Meeting not found", 404);
  }

  meeting = await Meeting.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }     // Return updated doc, run schema validators
  );

  res.json({ success: true, message: "Meeting updated", meeting });
});

// =============================================
// @route   DELETE /api/archive/meetings/:id
// @desc    Delete a meeting from the archive
// @access  Private
// =============================================
const deleteMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findOne({ _id: req.params.id, user: req.user._id });

  if (!meeting) {
    throw new AppError("Meeting not found", 404);
  }

  await meeting.deleteOne();
  res.json({ success: true, message: "Meeting deleted from archive" });
});

// =============================================
// @route   GET /api/archive/search
// @desc    Full-text search across all meetings
// @access  Private
// =============================================
const searchMeetings = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    throw new AppError("Search query (q) is required", 400);
  }

  const meetings = await Meeting.find({
    user: req.user._id,
    $text: { $search: q },
  })
    .sort({ score: { $meta: "textScore" } })  // Sort by relevance score
    .select("-transcript")                    // Exclude full transcript in results
    .limit(20);

  res.json({
    success: true,
    query: q,
    count: meetings.length,
    meetings,
  });
});

module.exports = { getMeetings, getMeetingById, createMeeting, updateMeeting, deleteMeeting, searchMeetings };
