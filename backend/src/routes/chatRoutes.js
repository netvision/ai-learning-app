import express from 'express';
import { chat, getChatHistory, recognizeHandwriting } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', authenticateToken, chat);
router.get('/history', authenticateToken, getChatHistory);
router.post('/recognize-handwriting', authenticateToken, recognizeHandwriting);

export default router;
