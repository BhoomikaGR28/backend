// =============================================
// server.js - Main Entry Point
// =============================================
// This is where everything comes together.
// We initialize Express, connect to MongoDB,
// register all routes, and start listening.

// Load environment variables FIRST — before any other require
// On Render/Railway/Heroku, these come from the dashboard (no .env file needed)
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Safely load connectDB after env vars are set
let connectDB;
try {
  connectDB = require("./config/db");
} catch (e) {
  console.error("❌ Could not load config/db.js:", e.message);
  console.error("Make sure the config/ folder exists and db.js is inside it.");
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// =============================================
// GLOBAL MIDDLEWARE
// =============================================

// Allow cross-origin requests (so your frontend can talk to this backend)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (shows method, URL, status, response time in dev)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// =============================================
// ROUTES
// =============================================

// Health check - quick way to verify server is running
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Cognitive AI API is running 🚀", timestamp: new Date() });
});

// Module 1: Authentication (signup, login)
app.use("/api/auth", require("./routes/authRoutes"));

// Module 2: Live Command Center (stats, conversations)
app.use("/api/command", require("./routes/commandRoutes"));

// Module 3: Intelligence in Motion (transcripts, messages)
app.use("/api/intelligence", require("./routes/intelligenceRoutes"));

// Module 4: Cognitive Repository (meeting archive)
app.use("/api/archive", require("./routes/archiveRoutes"));

// Module 5: Core Parameters (user settings)
app.use("/api/settings", require("./routes/settingsRoutes"));

// =============================================
// 404 HANDLER
// =============================================
// Catches any request that didn't match a route above
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// =============================================
// GLOBAL ERROR HANDLER
// =============================================
// Any error passed to next(err) lands here
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only show stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// =============================================
// START SERVER
// =============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Cognitive AI Backend running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
});
