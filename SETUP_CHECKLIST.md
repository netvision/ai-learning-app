# 🚀 Setup & Launch Checklist

## Pre-Flight Check ✈️

### System Requirements
- [ ] Node.js v16+ installed (`node --version`)
- [ ] PostgreSQL installed (`psql --version`)
- [ ] Git installed (optional)
- [ ] OpenAI API key obtained
- [ ] 2GB free disk space

---

## Installation Steps

### 1️⃣ Database Setup
```bash
# Start PostgreSQL
brew services start postgresql

# Verify it's running
brew services list | grep postgresql

# Create database
createdb ai_learning_db

# Verify database exists
psql -l | grep ai_learning_db
```
- [ ] PostgreSQL running
- [ ] Database created

### 2️⃣ Environment Configuration

**Backend .env file:**
```bash
cd /Volumes/Untitled/dev/ai_learning_app/backend
```

Edit `backend/.env`:
- [ ] Set `DATABASE_URL` with your PostgreSQL username
- [ ] Set `JWT_SECRET` to random string
- [ ] Set `OPENAI_API_KEY` with your key
- [ ] Verify `PORT=3000`

**Example:**
```env
PORT=3000
DATABASE_URL=postgresql://yourusername@localhost:5432/ai_learning_db
JWT_SECRET=my_super_secret_jwt_key_12345
OPENAI_API_KEY=sk-proj-xxx...
```

### 3️⃣ Install Dependencies

**Option A: Automatic (Recommended)**
```bash
cd /Volumes/Untitled/dev/ai_learning_app
./setup.sh
```
- [ ] Script completed successfully
- [ ] No error messages

**Option B: Manual**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Root (optional, for concurrent running)
cd ..
npm install
```
- [ ] Backend dependencies installed (node_modules exists)
- [ ] Frontend dependencies installed (node_modules exists)

### 4️⃣ Initialize Database

```bash
cd backend
npm run init-db
```

Expected output:
```
Initializing database...
Database initialized successfully!
```

- [ ] Success message appeared
- [ ] No errors

**Verify tables:**
```bash
psql ai_learning_db -c "\dt"
```

Should show:
- [ ] users
- [ ] bloom_progress
- [ ] study_sessions
- [ ] chat_history

---

## Launch Application 🚀

### Option A: Separate Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd /Volumes/Untitled/dev/ai_learning_app/backend
npm run dev
```

Expected output:
```
Server is running on port 3000
```

- [ ] Backend started without errors
- [ ] Shows "Server is running on port 3000"

**Terminal 2 - Frontend:**
```bash
cd /Volumes/Untitled/dev/ai_learning_app/frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

- [ ] Frontend started without errors
- [ ] Shows local URL

### Option B: Concurrent (Single Terminal)

```bash
cd /Volumes/Untitled/dev/ai_learning_app
npm install  # installs concurrently
npm run dev
```

- [ ] Both services started
- [ ] No errors in output

---

## Verification Tests ✅

### 1. Backend Health Check
```bash
curl http://localhost:3000/health
```

Expected: `{"status":"ok","message":"AI Learning App API is running"}`

- [ ] Returns successful response

### 2. Frontend Loads
Open browser to: `http://localhost:5173`

- [ ] Page loads without errors
- [ ] See login/signup interface
- [ ] No console errors (F12 → Console)

### 3. Create Test Account

In browser:
1. Click "Sign up here"
2. Fill form:
   - Name: Test Student
   - Email: test@example.com
   - Password: test123
   - Grade: 5

- [ ] Signup successful
- [ ] Redirected to dashboard
- [ ] Name appears in navbar

### 4. Test Study Material Generation

1. Select Subject: "Mathematics"
2. Enter Topic: "Fractions"
3. Click "Study Material"
4. Wait 10-30 seconds

- [ ] Loading message appears
- [ ] Study guide generated
- [ ] 6 questions appear
- [ ] Each has Bloom's badge (Remember, Understand, Apply, Analyze, Evaluate, Create)

### 5. Test Practice Questions

1. From dashboard, select same subject/topic
2. Click "Practice Questions"
3. Type answer for Remember question
4. Click "Submit Answer"
5. Wait 5-15 seconds

- [ ] Answer submitted
- [ ] Score appears (0-100%)
- [ ] Feedback provided
- [ ] Can click "Try Again"

### 6. Test Chatbot

1. From dashboard, click "Chatbot Tutor"
2. Type: "Can you explain this topic?"
3. Click Send or press Enter
4. Wait 5-15 seconds

- [ ] Message sent
- [ ] Bot responds
- [ ] Bloom's badge shows on response
- [ ] Can continue conversation

### 7. Test Progress Tracking

1. Return to dashboard
2. Scroll to "Your Bloom's Taxonomy Progress"

- [ ] Shows subject and topic you practiced
- [ ] Displays score for attempted Bloom's levels
- [ ] Shows attempt count
- [ ] Progress bars visible

---

## Troubleshooting Common Issues 🔧

### ❌ "ECONNREFUSED" or Database Connection Error

**Problem:** Can't connect to PostgreSQL

**Solutions:**
```bash
# Check if PostgreSQL is running
brew services list

# Start it if stopped
brew services start postgresql

# Test connection
psql postgres -c "SELECT 1"
```

- [ ] PostgreSQL started
- [ ] Connection works

### ❌ "OpenAI API Error" or 401 Unauthorized

**Problem:** Invalid API key

**Solutions:**
1. Verify key in `backend/.env`
2. Check key starts with `sk-`
3. Verify at: https://platform.openai.com/api-keys
4. Check you have credits: https://platform.openai.com/usage

- [ ] API key is correct
- [ ] Key is active
- [ ] Credits available

### ❌ "Port 3000 already in use"

**Problem:** Another process using port

**Solution:**
```bash
# Find process
lsof -ti:3000

# Kill it
lsof -ti:3000 | xargs kill -9

# Or change port in backend/.env
PORT=3001
```

- [ ] Port freed or changed

### ❌ "Port 5173 already in use"

**Problem:** Another Vite instance running

**Solution:**
```bash
# Kill process
lsof -ti:5173 | xargs kill -9
```

- [ ] Port freed

### ❌ Frontend can't reach backend (CORS or Network Error)

**Problem:** Proxy misconfiguration

**Verify:**
1. Backend is running on port 3000
2. Frontend `vite.config.js` has proxy configured
3. No firewall blocking

**Solution:**
```bash
# Test backend directly
curl http://localhost:3000/health

# Should return: {"status":"ok",...}
```

- [ ] Backend accessible
- [ ] Frontend can make requests

### ❌ No questions generated or empty response

**Problem:** OpenAI API issue or prompt problem

**Solutions:**
1. Check backend logs for errors
2. Verify OpenAI API status
3. Try different topic
4. Check if using GPT-4 model (requires tier 1+ account)

- [ ] OpenAI responding
- [ ] Content generates successfully

---

## Production Readiness Checklist 🏭

### Security
- [ ] Change JWT_SECRET to strong random value
- [ ] Use environment variables (never commit .env)
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Use production PostgreSQL credentials
- [ ] Implement rate limiting

### Performance
- [ ] Add database indexes
- [ ] Enable gzip compression
- [ ] Set up CDN for frontend
- [ ] Configure connection pooling
- [ ] Add caching layer (Redis)

### Monitoring
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Add analytics (Google Analytics, Mixpanel)
- [ ] Configure uptime monitoring
- [ ] Set up database backups
- [ ] Create health check endpoints

### Deployment
- [ ] Build frontend (`npm run build`)
- [ ] Set up hosting (Vercel, Netlify, Railway)
- [ ] Configure environment variables in hosting
- [ ] Set up CI/CD pipeline
- [ ] Test production build locally

---

## Development Workflow 💻

### Daily Development
```bash
# Start both servers (two terminals)
cd backend && npm run dev
cd frontend && npm run dev

# Or use concurrent mode
npm run dev
```

### Making Changes

**Backend:**
- Edit files in `backend/src/`
- Server auto-restarts (nodemon)
- Test with curl or Postman

**Frontend:**
- Edit files in `frontend/src/`
- Hot reload updates browser
- Check browser console for errors

### Database Changes

**Add migration:**
1. Edit `backend/src/database/init.js`
2. Drop and recreate database
3. Run `npm run init-db`

**Reset database:**
```bash
dropdb ai_learning_db
createdb ai_learning_db
cd backend && npm run init-db
```

---

## Success Criteria ✨

Your setup is successful when:

- [ ] ✅ Backend runs on port 3000
- [ ] ✅ Frontend runs on port 5173
- [ ] ✅ Database has all 4 tables
- [ ] ✅ Can create user account
- [ ] ✅ Can login successfully
- [ ] ✅ Study material generates
- [ ] ✅ Practice questions work
- [ ] ✅ Chatbot responds
- [ ] ✅ Progress tracks correctly
- [ ] ✅ All Bloom's levels labeled
- [ ] ✅ No console errors

---

## Next Steps 🎯

After successful setup:

1. **Explore Features**
   - Try different subjects and topics
   - Test all Bloom's levels
   - Chat with the AI tutor

2. **Read Documentation**
   - `README.md` - Full technical docs
   - `TESTING.md` - Testing guide
   - `PROJECT_OVERVIEW.md` - Architecture

3. **Customize**
   - Add more subjects
   - Adjust grade levels
   - Modify UI styling
   - Enhance prompts

4. **Share Feedback**
   - Report bugs
   - Suggest features
   - Contribute improvements

---

**🎉 Congratulations! You're ready to learn with AI and Bloom's Taxonomy!**

For help, check:
- Console logs (F12 in browser)
- Backend terminal output
- Database logs
- OpenAI dashboard
