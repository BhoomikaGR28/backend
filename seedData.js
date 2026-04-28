// =============================================
// seed/seedData.js - Sample Data Seeder
// =============================================
// Run with: npm run seed
// This populates your database with realistic
// sample data for development and testing.
//
// ⚠️  WARNING: This clears all existing data first!

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

// Import all models
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Transcript = require("../models/Transcript");
const Meeting = require("../models/Meeting");
const Settings = require("../models/Settings");

const seed = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ---- CLEAR ALL COLLECTIONS ----
    await User.deleteMany();
    await Conversation.deleteMany();
    await Transcript.deleteMany();
    await Meeting.deleteMany();
    await Settings.deleteMany();
    console.log("🗑️  Cleared existing data");

    // ---- CREATE DEMO USERS ----
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      {
        name: "Alex Chen",
        email: "alex@cognitiveai.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        name: "Sarah Miller",
        email: "sarah@cognitiveai.com",
        password: hashedPassword,
        role: "user",
      },
    ]);

    const [alex, sarah] = users;
    console.log(`👥 Created ${users.length} users`);

    // ---- CREATE SETTINGS ----
    await Settings.insertMany([
      {
        user: alex._id,
        aiMode: "enhanced",
        toggles: {
          autoSummary: true,
          sentimentAnalysis: true,
          actionItemExtraction: true,
          darkMode: true,
          emailNotifications: true,
        },
        integrations: {
          slack: { enabled: true, channelName: "#ai-insights" },
          github: { enabled: false },
          notion: { enabled: true },
        },
      },
      {
        user: sarah._id,
        aiMode: "standard",
        toggles: { autoSummary: true, sentimentAnalysis: false },
      },
    ]);
    console.log("⚙️  Created settings");

    // ---- CREATE CONVERSATIONS ----
    await Conversation.insertMany([
      {
        user: alex._id,
        title: "Q4 Product Strategy Review",
        preview: "Discussed roadmap priorities and resource allocation for Q4...",
        status: "active",
        tags: ["strategy", "Q4", "planning"],
        messageCount: 24,
        lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        user: alex._id,
        title: "Customer Onboarding - Acme Corp",
        preview: "Walkthrough of cognitive AI features and integration setup...",
        status: "resolved",
        tags: ["onboarding", "customer", "enterprise"],
        messageCount: 42,
        lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        user: alex._id,
        title: "Engineering Sprint Planning",
        preview: "Sprint 23 goals and task assignments for the engineering team...",
        status: "active",
        tags: ["engineering", "sprint", "planning"],
        messageCount: 18,
        lastMessageAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      },
    ]);
    console.log("💬 Created conversations");

    // ---- CREATE TRANSCRIPTS ----
    const transcript1 = await Transcript.create({
      user: alex._id,
      title: "Product Demo - Enterprise Client",
      status: "completed",
      participants: ["Alex Chen", "Sarah Miller", "John (Client)"],
      messages: [
        { speaker: "Alex Chen", content: "Welcome everyone. Today we'll walk through our Cognitive AI platform.", role: "agent", timestamp: new Date(Date.now() - 60 * 60 * 1000) },
        { speaker: "John (Client)", content: "Great, we're particularly interested in the real-time transcription features.", role: "user", timestamp: new Date(Date.now() - 59 * 60 * 1000) },
        { speaker: "Sarah Miller", content: "I can show you exactly that. The system captures every utterance with speaker diarization.", role: "agent", timestamp: new Date(Date.now() - 58 * 60 * 1000) },
        { speaker: "John (Client)", content: "Impressive. How does it handle multiple speakers simultaneously?", role: "user", timestamp: new Date(Date.now() - 57 * 60 * 1000) },
        { speaker: "Alex Chen", content: "The AI model differentiates speakers by voice profile. It achieves 97.3% accuracy in 2-speaker scenarios.", role: "agent", timestamp: new Date(Date.now() - 56 * 60 * 1000) },
      ],
      analysis: {
        summary: "Product demo session focused on real-time transcription. Client showed strong interest in speaker diarization accuracy. Discussion covered technical capabilities and enterprise integration options.",
        sentiment: "positive",
        sentimentScore: 0.72,
        actionItems: [
          "Send technical specifications to John by EOD",
          "Schedule follow-up demo with their engineering team",
          "Prepare enterprise pricing proposal",
        ],
        generatedAt: new Date(),
      },
    });
    console.log("📝 Created transcripts");

    // ---- CREATE MEETINGS (ARCHIVE) ----
    await Meeting.insertMany([
      {
        user: alex._id,
        title: "Board Meeting - AI Strategy Q3",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        duration: 90,
        participants: [
          { name: "Alex Chen", email: "alex@cognitiveai.com", role: "presenter" },
          { name: "James Wilson", email: "james@board.com", role: "board member" },
          { name: "Lisa Park", email: "lisa@board.com", role: "board member" },
        ],
        transcript: "The meeting opened with a review of Q3 AI adoption metrics. Alex presented the 47% increase in enterprise client acquisition. The board discussed expansion into the APAC market. Lisa raised questions about data sovereignty compliance. James recommended accelerating the SOC2 certification timeline. Final vote approved the $2M AI infrastructure investment.",
        summary: "Q3 performance exceeded targets with 47% client growth. Board approved $2M infrastructure investment and accelerated compliance timeline for APAC expansion.",
        sentiment: "positive",
        actionItems: ["Accelerate SOC2 certification", "Prepare APAC market entry plan", "Review data sovereignty requirements"],
        keywords: ["Q3", "board", "AI strategy", "APAC", "SOC2", "investment"],
        tags: ["board", "strategy", "Q3"],
        status: "published",
      },
      {
        user: alex._id,
        title: "Team Retrospective - Sprint 22",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        duration: 45,
        participants: [
          { name: "Alex Chen", email: "alex@cognitiveai.com", role: "facilitator" },
          { name: "Sarah Miller", email: "sarah@cognitiveai.com", role: "engineer" },
          { name: "Dev Patel", email: "dev@cognitiveai.com", role: "engineer" },
        ],
        transcript: "Sprint 22 retrospective. Team discussed the successful launch of the sentiment analysis feature. Highlighted blockers around the third-party API integration. Decided to improve code review process. Velocity was 87 points, exceeding the 80-point target.",
        summary: "Sprint 22 delivered sentiment analysis on time. Velocity at 87 points (target: 80). Key improvement: streamline code review with automated linting.",
        sentiment: "positive",
        actionItems: ["Set up automated linting in CI/CD", "Document sentiment API endpoints", "Plan capacity for Sprint 23"],
        keywords: ["sprint", "retrospective", "velocity", "sentiment analysis", "API"],
        tags: ["engineering", "retrospective", "sprint-22"],
        status: "published",
      },
      {
        user: alex._id,
        title: "Client Complaint - Data Latency Issue",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        duration: 30,
        participants: [
          { name: "Alex Chen", email: "alex@cognitiveai.com", role: "support" },
          { name: "Marcus (TechCorp)", email: "marcus@techcorp.com", role: "client" },
        ],
        transcript: "Marcus reported experiencing 300ms+ latency spikes during peak hours. Alex acknowledged the issue and explained it was related to database indexing. The team deployed a fix at 2pm. Marcus was initially frustrated but satisfied with the rapid response. Agreed to a 10% service credit for the downtime.",
        summary: "Addressed client-reported latency issue. Root cause was missing database index. Fix deployed same day. Service credit issued to maintain relationship.",
        sentiment: "mixed",
        actionItems: ["Issue 10% service credit to TechCorp", "Add monitoring alert for latency >100ms", "Review database indexing strategy"],
        keywords: ["latency", "performance", "client complaint", "database", "service credit"],
        tags: ["support", "incident", "client"],
        status: "published",
      },
    ]);
    console.log("🗄️  Created meetings in archive");

    console.log("\n✅ Seed complete! Demo credentials:");
    console.log("   Email: alex@cognitiveai.com | Password: password123 (admin)");
    console.log("   Email: sarah@cognitiveai.com | Password: password123 (user)\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
