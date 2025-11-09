# Application Flow Diagram

## User Journey & Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         STUDENT USER JOURNEY                         │
└─────────────────────────────────────────────────────────────────────┘

1. AUTHENTICATION
   ┌──────────┐
   │  Signup  │──────> Select Grade (K-12)
   │  Login   │──────> JWT Token Generated
   └──────────┘        Stored in localStorage

2. DASHBOARD
   ┌────────────────────┐
   │ Select Subject     │ (Math, Science, English, etc.)
   │ Enter Topic        │ (Fractions, Photosynthesis, etc.)
   └────────────────────┘
            │
            ├──> [Study Material] ──┐
            ├──> [Practice]         ├──> OpenAI API Call
            └──> [Chatbot]      ────┘

3. STUDY MATERIAL PATH
   ┌─────────────────────────────────────┐
   │ AI generates:                       │
   │  • Study Guide                      │
   │  • 6 Questions (one per Bloom's)    │
   │    - Remember    (Blue)             │
   │    - Understand  (Purple)           │
   │    - Apply       (Green)            │
   │    - Analyze     (Yellow)           │
   │    - Evaluate    (Red)              │
   │    - Create      (Pink)             │
   │  • Solutions & Hints                │
   └─────────────────────────────────────┘

4. PRACTICE PATH
   ┌─────────────────────────────────────┐
   │ Student submits answer              │
   │         ↓                            │
   │ AI Assessment (GPT-4)               │
   │         ↓                            │
   │ Returns:                            │
   │  • Score (0-100%)                   │
   │  • Feedback                         │
   │  • Strengths                        │
   │  • Improvements                     │
   │         ↓                            │
   │ Update bloom_progress table         │
   └─────────────────────────────────────┘

5. CHATBOT PATH
   ┌─────────────────────────────────────┐
   │ Current Bloom Level: Remember       │
   │         ↓                            │
   │ Student asks question               │
   │         ↓                            │
   │ AI Tutor responds                   │
   │  • Answers at current level         │
   │  • Provides hints                   │
   │  • Encourages learning              │
   │         ↓                            │
   │ Demonstrates mastery?               │
   │         ↓                            │
   │ Suggest Level Up → Understand       │
   │         ↓                            │
   │ Process repeats through Create      │
   └─────────────────────────────────────┘

6. PROGRESS TRACKING
   ┌─────────────────────────────────────┐
   │ Dashboard displays:                 │
   │  • Subject/Topic breakdown          │
   │  • Score per Bloom's level          │
   │  • Attempt count                    │
   │  • Visual progress bars             │
   │  • Color-coded badges               │
   └─────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                         TECHNICAL DATA FLOW                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────┐         ┌──────────┐         ┌────────────┐
│ Frontend │◄───────►│ Backend  │◄───────►│ PostgreSQL │
│  Vue 3   │         │ Express  │         │  Database  │
└──────────┘         └──────────┘         └────────────┘
     │                    │
     │                    │
     │                    ▼
     │            ┌──────────────┐
     │            │   OpenAI     │
     └───────────►│   GPT-4 API  │
  (via proxy)     └──────────────┘


DETAILED API FLOW:

1. Student Signup/Login
   ┌─────────┐
   │ Browser │ POST /api/auth/signup
   └─────────┘      {email, password, name, grade}
        │                    ↓
        │           ┌─────────────────┐
        │           │ authController  │
        │           │  • Hash password │
        │           │  • Insert DB     │
        │           │  • Generate JWT  │
        │           └─────────────────┘
        │                    ↓
        └──────────────── Returns: {token, user}

2. Get Study Material
   ┌─────────┐
   │ Browser │ GET /api/content/study-material
   └─────────┘      ?subject=Math&topic=Fractions
        │                    ↓
        │           ┌──────────────────────┐
        │           │ contentController    │
        │           │  • Verify JWT        │
        │           │  • Get user's grade  │
        │           └──────────────────────┘
        │                    ↓
        │           ┌──────────────────────┐
        │           │ openaiService        │
        │           │  • Build prompt      │
        │           │  • Call GPT-4        │
        │           │  • Parse response    │
        │           └──────────────────────┘
        │                    ↓
        │           ┌──────────────────────┐
        │           │ Save to DB           │
        │           │  study_sessions      │
        │           └──────────────────────┘
        │                    ↓
        └──────────────── Returns: {studyGuide, questions[]}

3. Submit Answer for Assessment
   ┌─────────┐
   │ Browser │ POST /api/content/submit-answer
   └─────────┘      {question, answer, bloomLevel, subject, topic}
        │                    ↓
        │           ┌──────────────────────┐
        │           │ contentController    │
        │           │  • Verify JWT        │
        │           └──────────────────────┘
        │                    ↓
        │           ┌──────────────────────┐
        │           │ openaiService        │
        │           │  • Assess answer     │
        │           │  • Score & feedback  │
        │           └──────────────────────┘
        │                    ↓
        │           ┌──────────────────────┐
        │           │ Update DB            │
        │           │  bloom_progress      │
        │           │  • Running avg score │
        │           │  • Increment attempts│
        │           └──────────────────────┘
        │                    ↓
        └──────────────── Returns: {score, feedback, strengths, improvements}

4. Chatbot Interaction
   ┌─────────┐
   │ Browser │ POST /api/chat/chat
   └─────────┘      {message, subject, topic, currentBloomLevel, sessionId}
        │                    ↓
        │           ┌──────────────────────┐
        │           │ chatController       │
        │           │  • Save user message │
        │           │  • Get chat history  │
        │           └──────────────────────┘
        │                    ↓
        │           ┌──────────────────────┐
        │           │ openaiService        │
        │           │  • Build context     │
        │           │  • Generate response │
        │           │  • Check if ready    │
        │           │    for level up      │
        │           └──────────────────────┘
        │                    ↓
        │           ┌──────────────────────┐
        │           │ Save to DB           │
        │           │  chat_history        │
        │           └──────────────────────┘
        │                    ↓
        └──────────────── Returns: {message, bloomLevel, suggestNextLevel, feedback}


┌─────────────────────────────────────────────────────────────────────┐
│                         BLOOM'S TAXONOMY FLOW                        │
└─────────────────────────────────────────────────────────────────────┘

Student Learning Progression:

Level 1: REMEMBER (Blue)
   ↓
   Student can recall facts
   Example: "What is photosynthesis?"
   ↓
Level 2: UNDERSTAND (Purple)
   ↓
   Student can explain concepts
   Example: "Explain how photosynthesis works"
   ↓
Level 3: APPLY (Green)
   ↓
   Student can use knowledge
   Example: "How would lack of sunlight affect a plant?"
   ↓
Level 4: ANALYZE (Yellow)
   ↓
   Student can break down information
   Example: "Compare photosynthesis and cellular respiration"
   ↓
Level 5: EVALUATE (Red)
   ↓
   Student can make judgments
   Example: "Evaluate the importance of photosynthesis to life"
   ↓
Level 6: CREATE (Pink)
   ↓
   Student can produce original work
   Example: "Design an experiment to test photosynthesis"


┌─────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA                            │
└─────────────────────────────────────────────────────────────────────┘

users
├── id (PRIMARY KEY)
├── email (UNIQUE)
├── password_hash
├── name
├── grade
└── created_at

bloom_progress
├── id (PRIMARY KEY)
├── user_id (FOREIGN KEY → users.id)
├── subject
├── topic
├── bloom_level (Remember, Understand, Apply, Analyze, Evaluate, Create)
├── score (0-100, running average)
├── attempts (counter)
└── last_updated
UNIQUE(user_id, subject, topic, bloom_level)

study_sessions
├── id (PRIMARY KEY)
├── user_id (FOREIGN KEY → users.id)
├── subject
├── topic
├── content_type
├── content (JSONB)
└── created_at

chat_history
├── id (PRIMARY KEY)
├── user_id (FOREIGN KEY → users.id)
├── session_id (UUID)
├── message (TEXT)
├── is_user (BOOLEAN)
├── bloom_level
└── created_at


┌─────────────────────────────────────────────────────────────────────┐
│                      COMPONENT ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────┘

Frontend (Vue 3):

App.vue (Root)
├── Navbar (conditional)
└── Router View
    ├── Login.vue
    ├── Signup.vue
    ├── Dashboard.vue
    │   ├── Subject Selector
    │   ├── Topic Input
    │   ├── Action Buttons
    │   └── Progress Grid
    │       └── BloomBadge.vue (x6 per topic)
    ├── Study.vue
    │   ├── Study Guide
    │   └── Questions List
    │       ├── Question Card (x6)
    │       │   ├── BloomBadge.vue
    │       │   ├── Hint Button
    │       │   └── Solution Button
    ├── Practice.vue
    │   └── Questions List
    │       ├── Question Card (x6)
    │       │   ├── BloomBadge.vue
    │       │   ├── Answer Textarea
    │       │   ├── Submit Button
    │       │   └── Assessment Result
    │       │       ├── Score Circle
    │       │       └── Feedback
    └── Chatbot.vue
        ├── Bloom Level Selector
        ├── Messages Container
        │   ├── Welcome Message
        │   ├── User Messages
        │   └── Bot Messages
        │       └── BloomBadge.vue
        ├── Level Up Notification
        └── Input Area

State Management (Pinia):

authStore
├── user (object)
├── token (string)
├── isAuthenticated (boolean)
├── signup()
├── login()
├── loadUser()
└── logout()

contentStore
├── studyMaterial (object)
├── progress (array)
├── loading (boolean)
├── error (string)
├── fetchStudyMaterial()
├── submitAnswer()
└── fetchProgress()


┌─────────────────────────────────────────────────────────────────────┐
│                        COLOR CODING SYSTEM                           │
└─────────────────────────────────────────────────────────────────────┘

Bloom's Level Colors (visible throughout UI):

🔵 Remember    → #3b82f6 (Blue)      → Easiest
🟣 Understand  → #8b5cf6 (Purple)    ↓
🟢 Apply       → #10b981 (Green)     ↓
🟡 Analyze     → #f59e0b (Yellow)    ↓
🔴 Evaluate    → #ef4444 (Red)       ↓
🌸 Create      → #ec4899 (Pink)      → Hardest

UI Elements:
• Badges on questions
• Progress bars
• Chat message labels
• Level selector highlight
```

---

## Quick Reference

### Ports
- Frontend: 5173
- Backend: 3000
- Database: 5432 (PostgreSQL default)

### Key Files
- Backend entry: `backend/src/index.js`
- Frontend entry: `frontend/src/main.js`
- Database init: `backend/src/database/init.js`
- OpenAI service: `backend/src/services/openaiService.js`

### Environment
- Backend config: `backend/.env`
- Frontend proxy: `frontend/vite.config.js`
