# 🎓 AI Learning App - Project Overview

## Executive Summary

A full-stack K12 educational web application that leverages OpenAI's GPT-4 to generate personalized learning content structured around **Bloom's Taxonomy**. Students progress through six cognitive levels—from basic recall to creative synthesis—with AI-powered study materials, practice assessments, and an intelligent chatbot tutor.

---

## ✨ Key Features Delivered

### 1. **Student Authentication System**
- ✅ Secure signup and login with JWT
- ✅ Grade-level selection (K-12)
- ✅ Password hashing with bcrypt
- ✅ Protected routes and API endpoints

### 2. **Dashboard with Bloom's Taxonomy Progress**
- ✅ Subject and topic selection interface
- ✅ Visual progress tracking for all 6 Bloom's levels
- ✅ Color-coded proficiency indicators
- ✅ Score averaging and attempt tracking

### 3. **AI-Generated Study Materials**
- ✅ Comprehensive study guides per topic
- ✅ 6 practice questions (one per Bloom's level)
- ✅ Hints and detailed solutions
- ✅ Grade-appropriate content generation

### 4. **Practice Question System**
- ✅ Written answer submission
- ✅ AI-powered assessment with scoring
- ✅ Detailed feedback (strengths & improvements)
- ✅ Automatic progress tracking

### 5. **Interactive Chatbot Tutor**
- ✅ Context-aware conversations
- ✅ Bloom's level-specific guidance
- ✅ Progressive difficulty scaling
- ✅ Level-up suggestions based on mastery
- ✅ Encouraging feedback

### 6. **Bloom's Taxonomy Integration**
Every feature explicitly labels and tracks:
- 🔵 **Remember** - Recall facts
- 🟣 **Understand** - Explain concepts
- 🟢 **Apply** - Use in new situations
- 🟡 **Analyze** - Draw connections
- 🔴 **Evaluate** - Make judgments
- 🌸 **Create** - Produce original work

---

## 🏗️ Architecture

### Technology Stack

**Frontend (Vue 3)**
- Vue Router for navigation
- Pinia for state management
- Axios for API calls
- Vite for build tooling

**Backend (Node.js/Express)**
- RESTful API design
- JWT authentication
- PostgreSQL database
- OpenAI API integration

**Database (PostgreSQL)**
- Users table
- Bloom progress tracking
- Study session history
- Chat conversation logs

---

## 📂 Complete Project Structure

```
ai_learning_app/
├── README.md                    # Comprehensive documentation
├── QUICKSTART.md               # 5-minute setup guide
├── TESTING.md                  # Testing checklist & procedures
├── setup.sh                    # Automated setup script
├── package.json                # Root scripts for workspace
│
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   └── src/
│       ├── index.js                    # Express server entry
│       ├── database/
│       │   ├── connection.js           # PostgreSQL pool
│       │   └── init.js                 # Schema initialization
│       ├── middleware/
│       │   └── auth.js                 # JWT verification
│       ├── controllers/
│       │   ├── authController.js       # Signup, login, profile
│       │   ├── contentController.js    # Study material, progress
│       │   └── chatController.js       # Chatbot interactions
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── contentRoutes.js
│       │   └── chatRoutes.js
│       ├── services/
│       │   └── openaiService.js        # OpenAI API calls
│       └── constants/
│           └── bloomTaxonomy.js        # Bloom's definitions
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.js                     # Vue app entry
        ├── App.vue                     # Root component
        ├── style.css                   # Global styles
        ├── router/
        │   └── index.js                # Route definitions
        ├── stores/
        │   ├── auth.js                 # Auth state (Pinia)
        │   └── content.js              # Content state (Pinia)
        ├── api/
        │   └── index.js                # Axios API client
        ├── constants/
        │   └── index.js                # Frontend constants
        ├── components/
        │   └── BloomBadge.vue          # Reusable badge component
        └── views/
            ├── Login.vue               # Login page
            ├── Signup.vue              # Signup page
            ├── Dashboard.vue           # Main dashboard
            ├── Study.vue               # Study material view
            ├── Practice.vue            # Practice questions
            └── Chatbot.vue             # Chatbot interface
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new student account |
| POST | `/api/auth/login` | Login student |
| GET | `/api/auth/profile` | Get current user info |

### Content
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/content/study-material` | Generate study material |
| POST | `/api/content/submit-answer` | Submit answer for assessment |
| GET | `/api/content/progress` | Get Bloom's progress |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/chat` | Send message to chatbot |
| GET | `/api/chat/history` | Get chat history |

---

## 🗄️ Database Schema

### `users`
Stores student accounts
- `id`, `email`, `password_hash`, `name`, `grade`, `created_at`

### `bloom_progress`
Tracks proficiency in each Bloom's level
- `id`, `user_id`, `subject`, `topic`, `bloom_level`, `score`, `attempts`, `last_updated`
- Unique constraint on `(user_id, subject, topic, bloom_level)`

### `study_sessions`
Logs generated content
- `id`, `user_id`, `subject`, `topic`, `content_type`, `content (JSONB)`, `created_at`

### `chat_history`
Stores chatbot conversations
- `id`, `user_id`, `session_id`, `message`, `is_user`, `bloom_level`, `created_at`

---

## 🤖 OpenAI Integration

### Prompts Design
All prompts explicitly request content categorized by Bloom's levels:

**Study Material Generation:**
```
Generate a study guide and 6 questions (with solutions), 
one for each Bloom's Taxonomy level—Remember, Understand, 
Apply, Analyze, Evaluate, Create—for grade [X], subject: [Y], 
topic: [Z]. Clearly label each item by Bloom's level.
```

**Answer Assessment:**
```
Evaluate this student answer for a [Bloom Level] level question.
Provide score (0-100) and feedback on strengths and improvements.
```

**Chatbot Tutoring:**
```
You are a K12 tutor helping a grade [X] student learn [subject: topic].
Guide them through Bloom's level: [current level].
Provide hints, ask questions, and suggest level-up when ready.
```

### Response Format
All OpenAI responses use structured JSON:
```json
{
  "studyGuide": "...",
  "questions": [
    {
      "bloomLevel": "Remember",
      "question": "...",
      "solution": "...",
      "hint": "..."
    }
  ]
}
```

---

## 🎨 UI/UX Highlights

### Color System
Each Bloom's level has a distinct color:
- Remember: Blue (#3b82f6)
- Understand: Purple (#8b5cf6)
- Apply: Green (#10b981)
- Analyze: Yellow (#f59e0b)
- Evaluate: Red (#ef4444)
- Create: Pink (#ec4899)

### Visual Progress
- Horizontal progress bars per Bloom's level
- Percentage scores displayed
- Attempt counters
- Last activity timestamps

### Responsive Design
- Mobile-friendly layouts
- Card-based UI components
- Accessible form controls
- Loading states for AI generation

---

## 🚀 Deployment Checklist

### Environment Variables Required
```env
# Backend
PORT=3000
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=random_secret_string
OPENAI_API_KEY=sk-...
```

### Pre-deployment Steps
1. [ ] Set up PostgreSQL database
2. [ ] Run database initialization (`npm run init-db`)
3. [ ] Configure environment variables
4. [ ] Install all dependencies
5. [ ] Build frontend (`npm run build`)
6. [ ] Test API endpoints
7. [ ] Verify OpenAI API quota

### Production Considerations
- Use environment-specific .env files
- Enable HTTPS for API
- Set up database backups
- Implement rate limiting
- Add error logging (e.g., Sentry)
- Configure CORS properly
- Use production database credentials

---

## 📊 Sample User Journey

1. **Sign Up** → Student registers with grade level
2. **Dashboard** → Selects "Science" + "Photosynthesis"
3. **Study Material** → Reads AI-generated guide, views 6 questions
4. **Practice** → Submits answers, receives AI assessment
5. **Progress Update** → Dashboard shows scores for Remember, Understand levels
6. **Chatbot** → Asks questions, chatbot guides through Apply level
7. **Level Up** → Chatbot suggests advancing to Analyze
8. **Continued Learning** → Student masters all 6 Bloom's levels

---

## 🎯 Success Metrics

### Student Engagement
- Time spent per session
- Questions answered per topic
- Chatbot conversation length
- Return visit frequency

### Learning Outcomes
- Average Bloom's level scores
- Progress through taxonomy levels
- Topics completed
- Improvement over time

### System Performance
- API response times
- OpenAI token usage
- Database query efficiency
- Error rates

---

## 🔮 Future Enhancements

### Phase 2
- [ ] Teacher dashboard for class monitoring
- [ ] Parent portal for progress visibility
- [ ] Collaborative learning features
- [ ] Peer review system

### Phase 3
- [ ] Adaptive learning paths
- [ ] Gamification (badges, leaderboards)
- [ ] Mobile app (React Native)
- [ ] Offline mode with sync

### Phase 4
- [ ] Video content integration
- [ ] Virtual labs and simulations
- [ ] Multi-language support
- [ ] Accessibility improvements (WCAG 2.1)

---

## 📝 Development Notes

### Code Quality
- ES6+ JavaScript throughout
- Vue 3 Composition API
- Consistent naming conventions
- Error handling on all async operations

### Security
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire after 7 days
- SQL injection prevention (parameterized queries)
- XSS protection (Vue escaping)

### Performance
- Database indexes on foreign keys
- API response caching potential
- Lazy loading of Vue components
- Optimized OpenAI prompts

---

## 🤝 Contributing

To contribute:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📞 Support & Documentation

- **Quick Start:** See `QUICKSTART.md`
- **Testing:** See `TESTING.md`
- **Full Docs:** See `README.md`
- **API Docs:** Swagger/OpenAPI (future)

---

## 📜 License

MIT License - Open for educational use

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Bloom's Taxonomy framework creators
- Vue.js community
- PostgreSQL team

---

**Built with ❤️ for K12 Education**

*Version 1.0.0 - November 2025*
