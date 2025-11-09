import express from 'express';
import { chat, getChatHistory } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', authenticateToken, chat);
router.get('/history', authenticateToken, getChatHistory);

export default router;
