# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Prerequisites
Make sure you have installed:
- Node.js (v16+): `node --version`
- PostgreSQL: `brew install postgresql && brew services start postgresql`
- OpenAI API Key: Get from https://platform.openai.com/api-keys

### Step 2: Database Setup
```bash
# Create the database
createdb ai_learning_db
```

### Step 3: Configure Environment
Edit `backend/.env` file:
```env
DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/ai_learning_db
JWT_SECRET=your_random_secret_here
OPENAI_API_KEY=sk-your-openai-key-here
```

**Important:** Replace YOUR_USERNAME with your macOS username, and add your OpenAI API key.

### Step 4: Install Dependencies & Initialize

#### Option A: Using setup script (recommended)
```bash
./setup.sh
```

#### Option B: Manual installation
```bash
# Install all dependencies
cd backend && npm install
cd ../frontend && npm install

# Initialize database
cd backend && npm run init-db
```

### Step 5: Start the Application

#### Option A: Run both services (requires installing concurrently)
```bash
# From root directory
npm install
npm run dev
```

#### Option B: Run in separate terminals
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

### Step 6: Access the App
Open your browser to: **http://localhost:5173**

---

## 🎯 First Time User Flow

1. **Sign Up**
   - Click "Sign up here"
   - Enter your name, email, password
   - Select your grade level (K-12)

2. **Select Topic**
   - Choose a subject (Math, Science, etc.)
   - Enter a topic (e.g., "Fractions", "Photosynthesis")

3. **Try Features**
   - **Study Material**: Read AI-generated guide and questions
   - **Practice**: Submit answers for AI assessment
   - **Chatbot**: Chat with AI tutor for personalized help

4. **Track Progress**
   - Return to dashboard
   - See your Bloom's Taxonomy progress
   - Watch your scores improve!

---

## 🎓 Understanding Bloom's Taxonomy

The app organizes learning into 6 levels:

1. **🔵 Remember** - Recall facts (easiest)
2. **🟣 Understand** - Explain concepts
3. **🟢 Apply** - Use in new situations
4. **🟡 Analyze** - Make connections
5. **🔴 Evaluate** - Make judgments
6. **🌸 Create** - Produce original work (hardest)

The chatbot guides you from Remember → Create progressively!

---

## 🔧 Troubleshooting

### "Database connection failed"
```bash
# Check if PostgreSQL is running
brew services list

# Restart if needed
brew services restart postgresql
```

### "OpenAI API error"
- Verify your API key in `backend/.env`
- Check you have credits: https://platform.openai.com/usage
- Make sure key starts with `sk-`

### "Port already in use"
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### "Module not found" errors
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
```

---

## 📚 Example Topics to Try

### Mathematics
- Fractions and Decimals
- Pythagorean Theorem
- Linear Equations
- Probability

### Science
- Photosynthesis
- Newton's Laws of Motion
- The Water Cycle
- Chemical Reactions

### English
- Parts of Speech
- Literary Devices
- Essay Writing
- Poetry Analysis

### History
- American Revolution
- World War II
- Ancient Egypt
- Civil Rights Movement

---

## 💡 Tips for Best Results

1. **Be Specific**: Instead of "Math", try "Solving quadratic equations"
2. **Match Your Grade**: The AI adapts to your grade level
3. **Use the Chatbot**: It provides personalized guidance
4. **Track Progress**: Regular practice improves Bloom's scores
5. **Try All Levels**: Don't skip to Create - build foundation first!

---

## 🎨 Feature Highlights

### Color-Coded Bloom's Levels
Each level has a unique color for easy identification:
- Blue = Remember
- Purple = Understand  
- Green = Apply
- Yellow = Analyze
- Red = Evaluate
- Pink = Create

### Smart Progress Tracking
- Average scores per Bloom's level
- Number of practice attempts
- Last activity timestamp
- Subject and topic breakdown

### Adaptive Chatbot
- Starts at Remember level
- Suggests level-up when ready
- Provides hints and encouragement
- Remembers conversation context

---

## 📞 Need Help?

Check the main README.md for:
- Detailed API documentation
- Database schema
- Architecture overview
- Development notes

Happy Learning! 🎓✨
