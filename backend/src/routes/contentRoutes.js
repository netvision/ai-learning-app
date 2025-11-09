import express from 'express';
import { getStudyMaterial, submitAnswer, getProgress } from '../controllers/contentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/study-material', authenticateToken, getStudyMaterial);
router.post('/submit-answer', authenticateToken, submitAnswer);
router.get('/progress', authenticateToken, getProgress);

export default router;
