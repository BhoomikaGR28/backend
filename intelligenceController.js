// =============================================
// controllers/intelligenceController.js
// =============================================
// Module 3: Intelligence in Motion
// Handles: Live transcripts, messages, AI analysis

const Transcript = require("../models/Transcript");
const { AppError, asyncHandler } = require("../middleware/errorMiddleware");

// =============================================
// @route   POST /api/intelligence/transcripts
// @desc    Create a new live transcript session
// @access  Private
// =============================================
const createTranscript = asyncHandler(async (req, res) => {
  const { title, participants } = req.body;

  if (!title) {
    throw new AppError("Transcript title is required", 400);
  }

  const transcript = await Transcript.create({
    user: req.user._id,
    title,
    participants: participants || [],
    status: "live",
    messages: [],
  });

  res.status(201).json({
    success: true,
    message: "Live transcript session started",
    transcript,
  });
});

// =============================================
// @route   GET /api/intelligence/transcripts/:id
// @desc    Get a transcript by ID (with all messages)
// @access  Private
// =============================================
const getTranscript = asyncHandler(async (req, res) => {
  const transcript = await Transcript.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transcript) {
    throw new AppError("Transcript not found", 404);
  }

  res.json({ success: true, transcript });
});

// =============================================
// @route   GET /api/intelligence/transcripts
// @desc    Get all transcripts for logged-in user
// @access  Private
// =============================================
const getAllTranscripts = asyncHandler(async (req, res) => {
  const transcripts = await Transcript.find({ user: req.user._id })
    .select("-messages")    // Exclude messages array for list view (for performance)
    .sort({ createdAt: -1 });

  res.json({ success: true, count: transcripts.length, transcripts });
});

// =============================================
// @route   POST /api/intelligence/transcripts/:id/messages
// @desc    Append a message to an existing transcript
// @access  Private
// =============================================
const appendMessage = asyncHandler(async (req, res) => {
  const { speaker, content, role } = req.body;

  if (!speaker || !content) {
    throw new AppError("Speaker and content are required", 400);
  }

  const transcript = await Transcript.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transcript) {
    throw new AppError("Transcript not found", 404);
  }

  if (transcript.status === "archived") {
    throw new AppError("Cannot add messages to an archived transcript", 400);
  }

  // Push the new message into the messages array
  const newMessage = {
    speaker,
    content,
    role: role || "user",
    timestamp: new Date(),
  };

  transcript.messages.push(newMessage);

  // Add speaker to participants if not already listed
  if (!transcript.participants.includes(speaker)) {
    transcript.participants.push(speaker);
  }

  await transcript.save();

  res.status(201).json({
    success: true,
    message: "Message appended",
    newMessage,
    totalMessages: transcript.messages.length,
  });
});

// =============================================
// @route   POST /api/intelligence/transcripts/:id/analyze
// @desc    Generate mock AI summary, sentiment, and action items
// @access  Private
// =============================================
const analyzeTranscript = asyncHandler(async (req, res) => {
  const transcript = await Transcript.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transcript) {
    throw new AppError("Transcript not found", 404);
  }

  if (transcript.messages.length === 0) {
    throw new AppError("Cannot analyze an empty transcript", 400);
  }

  // ---- MOCK AI ANALYSIS ENGINE ----
  // In production, this would call OpenAI/Claude/Gemini APIs.
  // For now, we generate intelligent-looking mock outputs.

  const messageCount = transcript.messages.length;
  const participants = transcript.participants.join(", ") || "Unknown participants";

  // Mock summary based on actual transcript data
  const summary = `This ${messageCount}-message session between ${participants} covered key topics 
  including system capabilities, integration workflows, and next steps. 
  The discussion was productive with clear outcomes identified. 
  Session duration: approximately ${Math.ceil(messageCount * 0.5)} minutes.`.trim();

  // Mock sentiment analysis (weighted random, slightly positive-biased)
  const sentiments = ["positive", "neutral", "negative", "mixed"];
  const weights = [0.45, 0.35, 0.10, 0.10];
  let rand = Math.random(), cumulative = 0;
  let detectedSentiment = "neutral";
  for (let i = 0; i < sentiments.length; i++) {
    cumulative += weights[i];
    if (rand <= cumulative) { detectedSentiment = sentiments[i]; break; }
  }

  const sentimentScore = {
    positive: 0.7, neutral: 0.0, negative: -0.6, mixed: 0.1
  }[detectedSentiment] + (Math.random() * 0.2 - 0.1); // ±0.1 noise

  // Mock action items extracted from transcript
  const actionItemPool = [
    `Follow up with ${participants.split(",")[0]} on integration setup`,
    "Schedule next review meeting within 5 business days",
    "Share meeting notes and summary with all stakeholders",
    "Complete API documentation for agreed endpoints",
    "Test the Slack integration in staging environment",
    "Review action items from previous session",
    "Prepare demo for upcoming product walkthrough",
  ];
  // Pick 3 random action items
  const actionItems = actionItemPool.sort(() => 0.5 - Math.random()).slice(0, 3);

  // Save analysis back to the transcript
  transcript.analysis = {
    summary,
    sentiment: detectedSentiment,
    sentimentScore: parseFloat(sentimentScore.toFixed(2)),
    actionItems,
    generatedAt: new Date(),
  };
  transcript.status = "completed";
  await transcript.save();

  res.json({
    success: true,
    message: "Analysis complete",
    analysis: transcript.analysis,
  });
});

module.exports = { createTranscript, getTranscript, getAllTranscripts, appendMessage, analyzeTranscript };
