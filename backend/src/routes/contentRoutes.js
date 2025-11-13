import express from 'express';
import { getStudyMaterial, submitAnswer, getProgress, submitHandwrittenAnswer } from '../controllers/contentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/study-material', authenticateToken, getStudyMaterial);
router.post('/submit-answer', authenticateToken, submitAnswer);
router.post('/submit-handwritten-answer', authenticateToken, submitHandwrittenAnswer);
router.get('/progress', authenticateToken, getProgress);

export default router;
