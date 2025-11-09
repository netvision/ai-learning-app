# 🎓 AI Learning App - Bloom's Taxonomy K12 Platform

> A comprehensive K12 learning platform that integrates AI-generated educational content with Bloom's Taxonomy framework. Students can access personalized study materials, practice questions, and an intelligent chatbot tutor that guides them through progressively complex learning levels.

[![Status](https://img.shields.io/badge/status-ready-success)]()
[![Vue](https://img.shields.io/badge/vue-3.3-brightgreen)]()
[![Node](https://img.shields.io/badge/node-16+-blue)]()
[![PostgreSQL](https://img.shields.io/badge/postgresql-12+-blue)]()
[![OpenAI](https://img.shields.io/badge/openai-GPT--4-purple)]()

## 🚀 Quick Start

**New here?** Start with **[START_HERE.md](START_HERE.md)** for a quick overview!

**Ready to install?** Follow **[QUICKSTART.md](QUICKSTART.md)** for 5-minute setup!

**Need help?** Check **[DOCS_INDEX.md](DOCS_INDEX.md)** for all documentation!

---

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[START_HERE.md](START_HERE.md)** | Quick overview & getting started |
| **[QUICKSTART.md](QUICKSTART.md)** | 5-minute setup guide |
| **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** | Detailed verification steps |
| **[TESTING.md](TESTING.md)** | Testing procedures & checklist |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Visual flow diagrams |
| **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** | Executive summary |
| **[DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md)** | Complete delivery report |
| **[DOCS_INDEX.md](DOCS_INDEX.md)** | Documentation navigator |

---

## 📑 Table of Contents

- [Features](#-features)
- [Bloom's Taxonomy Integration](#-blooms-taxonomy-integration)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [OpenAI Integration](#-openai-integration)
- [Development Notes](#-development-notes)
- [Future Enhancements](#-future-enhancements)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Features

### 🎓 Student Features
- **User Authentication**: Secure signup/login with grade selection
- **Subject & Topic Selection**: Choose from various subjects and custom topics
- **AI-Generated Content**: 
  - Comprehensive study guides
  - Practice questions aligned with all 6 Bloom's Taxonomy levels
  - Detailed solutions and hints
- **Interactive Chatbot Tutor**: 
  - Conversational AI that adapts to student's learning level
  - Guides students through Bloom's levels progressively
  - Provides personalized feedback and encouragement
- **Progress Tracking**: 
  - Visual dashboard showing proficiency in each Bloom's level
  - Per-subject and per-topic progress tracking
  - Score tracking with attempt history

### 🧠 Bloom's Taxonomy Integration
All content is explicitly categorized by Bloom's levels:
1. **Remember** - Recall facts and basic concepts
2. **Understand** - Explain ideas or concepts
3. **Apply** - Use information in new situations
4. **Analyze** - Draw connections among ideas
5. **Evaluate** - Justify a stand or decision
6. **Create** - Produce new or original work

## Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express** - Web application framework
- **PostgreSQL** - Relational database
- **OpenAI API** - AI content generation
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## Project Structure

```
ai_learning_app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── contentController.js
│   │   │   └── chatController.js
│   │   ├── database/
│   │   │   ├── connection.js
│   │   │   └── init.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── contentRoutes.js
│   │   │   └── chatRoutes.js
│   │   ├── services/
│   │   │   └── openaiService.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js
│   │   ├── stores/
│   │   │   ├── auth.js
│   │   │   └── content.js
│   │   ├── views/
│   │   │   ├── Login.vue
│   │   │   ├── Signup.vue
│   │   │   ├── Dashboard.vue
│   │   │   ├── Study.vue
│   │   │   ├── Practice.vue
│   │   │   └── Chatbot.vue
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- OpenAI API key

### 1. Clone and Navigate
```bash
cd /Volumes/Untitled/dev/ai_learning_app
```

### 2. Database Setup

Install PostgreSQL if not already installed:
```bash
# macOS
brew install postgresql
brew services start postgresql

# Create database
createdb ai_learning_db

# Or using psql
psql postgres
CREATE DATABASE ai_learning_db;
\q
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=3000
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/ai_learning_db
JWT_SECRET=your_secure_random_secret_here
OPENAI_API_KEY=sk-your-openai-api-key-here
```

Initialize the database:
```bash
npm run init-db
```

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### 4. Frontend Setup

Open a new terminal:
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage Guide

### 1. Student Registration
- Navigate to `http://localhost:5173`
- Click "Sign up here"
- Enter name, email, password, and select grade level
- You'll be automatically logged in after signup

### 2. Dashboard
- Select a subject from the dropdown
- Enter a specific topic (e.g., "Fractions", "Photosynthesis")
- Choose between:
  - **Study Material** - View AI-generated study guide and questions
  - **Practice Questions** - Submit answers for AI assessment
  - **Chatbot Tutor** - Interactive learning with AI guidance

### 3. Study Material
- View comprehensive study guide
- See 6 practice questions, one for each Bloom's level
- Click hints for guidance
- Reveal solutions when ready

### 4. Practice Mode
- Answer questions with written responses
- Submit for AI assessment
- Receive scores and detailed feedback
- Track which Bloom's levels you're mastering

### 5. Chatbot Tutor
- Start conversation about the topic
- Chatbot adapts questions to current Bloom's level
- Progress through levels as you demonstrate mastery
- Receive encouragement and personalized guidance

### 6. Progress Tracking
- Return to dashboard to view overall progress
- See proficiency scores for each Bloom's level
- Track attempts and improvement over time

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Content
- `GET /api/content/study-material?subject=X&topic=Y` - Generate study material
- `POST /api/content/submit-answer` - Submit answer for assessment
- `GET /api/content/progress?subject=X&topic=Y` - Get student progress

### Chat
- `POST /api/chat/chat` - Send message to chatbot
- `GET /api/chat/history?sessionId=X` - Get chat history

## Database Schema

### users
- `id` - Primary key
- `email` - Unique email address
- `password_hash` - Hashed password
- `name` - Student name
- `grade` - Grade level
- `created_at` - Account creation timestamp

### bloom_progress
- `id` - Primary key
- `user_id` - Foreign key to users
- `subject` - Subject name
- `topic` - Topic name
- `bloom_level` - Bloom's taxonomy level
- `score` - Average score (0-100)
- `attempts` - Number of attempts
- `last_updated` - Last update timestamp

### study_sessions
- `id` - Primary key
- `user_id` - Foreign key to users
- `subject` - Subject name
- `topic` - Topic name
- `content_type` - Type of content
- `content` - JSON content
- `created_at` - Creation timestamp

### chat_history
- `id` - Primary key
- `user_id` - Foreign key to users
- `session_id` - Chat session ID
- `message` - Message text
- `is_user` - Boolean flag
- `bloom_level` - Associated Bloom's level
- `created_at` - Message timestamp

## OpenAI Integration

The app uses OpenAI's GPT-4 model for:

1. **Study Material Generation**: Creates comprehensive study guides and 6 questions (one per Bloom's level)
2. **Answer Assessment**: Evaluates student responses with scores and feedback
3. **Chatbot Responses**: Generates adaptive, encouraging tutoring responses

Sample prompt structure:
```
Generate a study guide and 6 questions (with solutions), one for each 
Bloom's Taxonomy level—Remember, Understand, Apply, Analyze, Evaluate, 
Create—for grade [X], subject: [Y], topic: [Z]. Clearly label each item 
by Bloom's level.
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `JWT_SECRET` | Secret for JWT token signing | `your_random_secret` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |

## Development Notes

### Running Both Services
Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Database Reset
To reset the database:
```bash
# Drop and recreate database
dropdb ai_learning_db
createdb ai_learning_db

# Re-initialize
cd backend
npm run init-db
```

## Future Enhancements

- [ ] Teacher dashboard for monitoring student progress
- [ ] Adaptive learning paths based on performance
- [ ] Gamification with badges and achievements
- [ ] Peer collaboration features
- [ ] Mobile app version
- [ ] Offline mode with sync
- [ ] Multi-language support
- [ ] Video/image content integration
- [ ] Export progress reports

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `brew services list`
- Verify DATABASE_URL in .env
- Ensure OpenAI API key is valid

### Frontend can't connect to backend
- Verify backend is running on port 3000
- Check browser console for CORS errors
- Ensure proxy is configured in vite.config.js

### Database errors
- Run `npm run init-db` to initialize tables
- Check PostgreSQL logs for connection issues
- Verify user permissions on database

## License

MIT License - Feel free to use this project for educational purposes.

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions, please open an issue on the repository.

---

Built with ❤️ for K12 education using AI and Bloom's Taxonomy
