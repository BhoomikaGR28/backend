# Cognitive AI Backend - API Reference

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 3. Seed sample data (optional)
npm run seed

# 4. Start development server
npm run dev

# 5. Health check
curl http://localhost:5000/api/health
```

---

## 📁 Project Structure

```
cognitive-ai-backend/
├── server.js                   # Entry point
├── config/
│   └── db.js                   # MongoDB connection
├── middleware/
│   ├── authMiddleware.js        # JWT protection
│   └── errorMiddleware.js       # AppError + asyncHandler
├── models/
│   ├── User.js                  # User schema + bcrypt
│   ├── Conversation.js          # Command center
│   ├── Transcript.js            # Live transcripts
│   ├── Meeting.js               # Archive + text index
│   └── Settings.js              # User preferences
├── controllers/
│   ├── authController.js
│   ├── commandController.js
│   ├── intelligenceController.js
│   ├── archiveController.js
│   └── settingsController.js
├── routes/
│   ├── authRoutes.js
│   ├── commandRoutes.js
│   ├── intelligenceRoutes.js
│   ├── archiveRoutes.js
│   └── settingsRoutes.js
├── seed/
│   └── seedData.js              # Demo data
├── .env.example
├── .gitignore
└── package.json
```

---

## 🔐 Module 1: Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |

### Signup
```json
POST /api/auth/signup
{
  "name": "Alex Chen",
  "email": "alex@example.com",
  "password": "securepassword"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "alex@example.com",
  "password": "securepassword"
}
// Returns: { token: "eyJ..." }
```

**Use the token in all protected routes:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 📡 Module 2: Live Command Center

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/command/stats` | System latency & token efficiency |
| GET | `/api/command/conversations` | Recent conversations (paginated) |
| POST | `/api/command/conversations` | Create conversation |
| DELETE | `/api/command/conversations/:id` | Delete conversation |

```
GET /api/command/conversations?page=1&limit=10
```

---

## 🧠 Module 3: Intelligence in Motion

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/intelligence/transcripts` | All transcripts |
| POST | `/api/intelligence/transcripts` | Start new session |
| GET | `/api/intelligence/transcripts/:id` | Get transcript |
| POST | `/api/intelligence/transcripts/:id/messages` | Append message |
| POST | `/api/intelligence/transcripts/:id/analyze` | Generate AI analysis |

### Append Message
```json
POST /api/intelligence/transcripts/:id/messages
{
  "speaker": "Alice",
  "content": "Let's review the Q4 roadmap.",
  "role": "agent"
}
```

### Analyze Transcript
```
POST /api/intelligence/transcripts/:id/analyze
Returns: { summary, sentiment, sentimentScore, actionItems }
```

---

## 🗄️ Module 4: Cognitive Repository

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/archive/search?q=keyword` | Full-text search |
| GET | `/api/archive/meetings` | List/filter meetings |
| POST | `/api/archive/meetings` | Archive new meeting |
| GET | `/api/archive/meetings/:id` | Get meeting details |
| PUT | `/api/archive/meetings/:id` | Update meeting |
| DELETE | `/api/archive/meetings/:id` | Delete meeting |

### Filtering
```
GET /api/archive/meetings?keyword=strategy&participant=alice&sentiment=positive&page=1
```

---

## ⚙️ Module 5: Core Parameters (Settings)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get user settings |
| PUT | `/api/settings` | Update settings |
| PATCH | `/api/settings/integrations` | Toggle integration |
| PATCH | `/api/settings/toggles` | Update feature toggles |
| POST | `/api/settings/reset` | Reset to defaults |

### Toggle Integration
```json
PATCH /api/settings/integrations
{
  "integration": "slack",
  "enabled": true,
  "config": { "channelName": "#ai-insights" }
}
```

### Update Toggles
```json
PATCH /api/settings/toggles
{
  "darkMode": true,
  "autoSummary": false
}
```

---

## 🌱 Demo Credentials (after `npm run seed`)

| Email | Password | Role |
|-------|----------|------|
| alex@cognitiveai.com | password123 | admin |
| sarah@cognitiveai.com | password123 | user |
