# Testing Guide

## Manual Testing Checklist

### 1. Authentication Flow ✅

#### Signup
- [ ] Navigate to signup page
- [ ] Fill in all fields (name, email, password, grade)
- [ ] Submit form
- [ ] Verify redirect to dashboard
- [ ] Check user info appears in navbar

**Test Data:**
```
Name: Test Student
Email: student@test.com
Password: test123
Grade: 5
```

#### Login
- [ ] Logout from navbar
- [ ] Navigate to login page
- [ ] Enter credentials
- [ ] Verify successful login
- [ ] Check redirect to dashboard

#### Error Handling
- [ ] Try signup with existing email (should show error)
- [ ] Try login with wrong password (should show error)
- [ ] Leave fields empty (should show validation)

---

### 2. Dashboard ✅

#### Subject & Topic Selection
- [ ] Select a subject from dropdown
- [ ] Enter a topic in text field
- [ ] Verify buttons are enabled

**Test Topics:**
- Mathematics: "Fractions"
- Science: "Photosynthesis"
- English: "Parts of Speech"

#### Navigation
- [ ] Click "Study Material" button (should navigate)
- [ ] Return to dashboard
- [ ] Click "Practice Questions" button
- [ ] Return to dashboard
- [ ] Click "Chatbot Tutor" button

#### Progress Display
- [ ] Check if progress section is empty initially
- [ ] After completing practice questions, verify progress appears
- [ ] Check color-coded Bloom's level badges
- [ ] Verify score percentages display correctly

---

### 3. Study Material Page ✅

#### Content Generation
- [ ] Select subject and topic, navigate to Study
- [ ] Verify loading message appears
- [ ] Wait for AI generation (may take 10-30 seconds)
- [ ] Verify study guide appears
- [ ] Check 6 questions are displayed (one per Bloom's level)

#### Bloom's Level Display
- [ ] Verify each question has a colored badge
- [ ] Check badges show correct levels: Remember, Understand, Apply, Analyze, Evaluate, Create
- [ ] Verify colors match: Blue, Purple, Green, Yellow, Red, Pink

#### Hints & Solutions
- [ ] Click "Show Hint" on a question
- [ ] Verify hint appears
- [ ] Click "Show Solution"
- [ ] Verify solution appears
- [ ] Try on multiple questions

#### Navigation
- [ ] Click "Back to Dashboard"
- [ ] Verify return to dashboard

---

### 4. Practice Questions Page ✅

#### Question Display
- [ ] Navigate to Practice page
- [ ] Verify same 6 questions appear
- [ ] Check each has answer textarea

#### Answer Submission
- [ ] Type answer in first question (Remember level)
- [ ] Click "Submit Answer"
- [ ] Wait for AI assessment (10-15 seconds)
- [ ] Verify feedback appears with:
  - Score percentage in circle
  - Overall feedback
  - Strengths
  - Areas to improve

**Test Answers:**
For Mathematics "Fractions" topic:
- Remember: "A fraction represents a part of a whole"
- Understand: "The numerator shows how many parts we have, denominator shows total parts"

#### Score Display
- [ ] Check score circle color (green = 80+, yellow = 60-79, red = <60)
- [ ] Verify percentage is reasonable
- [ ] Read feedback for accuracy

#### Try Again
- [ ] Click "Try Again" button
- [ ] Verify form resets
- [ ] Submit different answer
- [ ] Check new assessment appears

#### Progress Update
- [ ] Complete at least 2 questions
- [ ] Return to dashboard
- [ ] Verify progress section updated
- [ ] Check scores match submissions

---

### 5. Chatbot Page ✅

#### Initial State
- [ ] Navigate to Chatbot page
- [ ] Verify welcome message displays
- [ ] Check Bloom's level selector shows "Remember"
- [ ] Verify subject and topic appear in header

#### Conversation Flow
- [ ] Type message: "Can you explain this topic to me?"
- [ ] Click Send or press Enter
- [ ] Wait for response (5-15 seconds)
- [ ] Verify bot message appears with Bloom's badge
- [ ] Check feedback text appears

**Test Conversation:**
1. "What is photosynthesis?" (Remember level)
2. "Can you explain how it works?" (Understand level)
3. "How would this apply to a plant in my garden?" (Apply level)

#### Bloom's Level Progression
- [ ] Answer questions correctly
- [ ] Watch for level-up notification
- [ ] Click "Yes, level up!"
- [ ] Verify current level changes in selector
- [ ] Continue conversation at new level

#### Manual Level Change
- [ ] Change Bloom's level in dropdown
- [ ] Send message
- [ ] Verify bot responds at selected level

#### Chat History
- [ ] Verify all messages stay visible
- [ ] Check scroll works properly
- [ ] Verify user messages on right (blue)
- [ ] Verify bot messages on left (white with border)

---

### 6. Progress Tracking Integration ✅

#### End-to-End Flow
1. [ ] Complete all Remember level questions in Practice
2. [ ] Return to dashboard, check Remember score
3. [ ] Complete Understand level questions
4. [ ] Check both scores in dashboard
5. [ ] Use chatbot for Apply level
6. [ ] Verify overall progress increases

#### Multiple Topics
1. [ ] Study "Fractions" in Math (complete practice)
2. [ ] Study "Photosynthesis" in Science (complete practice)
3. [ ] Return to dashboard
4. [ ] Verify both topics show separately
5. [ ] Check each has independent Bloom's progress

---

## Backend API Testing

### Using curl or Postman

#### 1. Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test Student",
    "grade": "5"
  }'
```

Expected: JWT token and user object

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

Expected: JWT token and user object

#### 3. Get Study Material
```bash
curl -X GET "http://localhost:3000/api/content/study-material?subject=Mathematics&topic=Fractions" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected: JSON with studyGuide and questions array

#### 4. Submit Answer
```bash
curl -X POST http://localhost:3000/api/content/submit-answer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "subject": "Mathematics",
    "topic": "Fractions",
    "question": "What is a fraction?",
    "answer": "A fraction represents a part of a whole",
    "bloomLevel": "Remember"
  }'
```

Expected: Assessment with score, feedback, strengths, improvements

#### 5. Chat
```bash
curl -X POST http://localhost:3000/api/chat/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "message": "What is photosynthesis?",
    "subject": "Science",
    "topic": "Photosynthesis",
    "currentBloomLevel": "Remember"
  }'
```

Expected: Bot response with message, bloomLevel, feedback

---

## Database Verification

### Check Data in PostgreSQL

```bash
# Connect to database
psql ai_learning_db

# View users
SELECT id, email, name, grade FROM users;

# View progress
SELECT * FROM bloom_progress ORDER BY user_id, subject, bloom_level;

# View chat history
SELECT user_id, message, is_user, bloom_level FROM chat_history LIMIT 10;

# Exit
\q
```

---

## Performance Testing

### Response Times
- Study material generation: 10-30 seconds (OpenAI API)
- Answer assessment: 5-15 seconds (OpenAI API)
- Chatbot response: 5-15 seconds (OpenAI API)
- Regular API calls: < 1 second

### Expected Behavior
- Frontend should show loading states
- No UI freezing during API calls
- Errors handled gracefully

---

## Common Issues & Solutions

### Issue: "OpenAI rate limit exceeded"
**Solution:** Wait a few seconds and try again, or upgrade OpenAI plan

### Issue: Study material doesn't match topic
**Solution:** Be more specific with topic (e.g., "Adding fractions with like denominators")

### Issue: Progress not updating
**Solution:** 
1. Check browser console for errors
2. Verify backend connection
3. Check database bloom_progress table

### Issue: Chatbot responses generic
**Solution:**
1. Provide more context in messages
2. Verify grade level is set correctly
3. Be specific about what you need help with

---

## Test Results Log

| Date | Tester | Feature | Result | Notes |
|------|--------|---------|--------|-------|
| | | | | |
| | | | | |
| | | | | |

---

## Automated Testing (Future Enhancement)

Consider adding:
- Jest for unit tests
- Cypress for E2E tests
- API integration tests
- Database migration tests
