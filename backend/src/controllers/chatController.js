import pool from '../database/connection.js';
import { generateChatbotResponse } from '../services/openaiService.js';
import { v4 as uuidv4 } from 'uuid';

export const chat = async (req, res) => {
  try {
    const { message, subject, topic, sessionId, currentBloomLevel } = req.body;
    const userId = req.user.id;

    if (!message || !subject || !topic || !currentBloomLevel) {
      return res.status(400).json({ error: 'Message, subject, topic, and currentBloomLevel are required' });
    }

    const chatSessionId = sessionId || uuidv4();

    // Get user's grade
    const userResult = await pool.query('SELECT grade FROM users WHERE id = $1', [userId]);
    const grade = userResult.rows[0].grade;

    // Save user message
    await pool.query(
      'INSERT INTO chat_history (user_id, session_id, message, is_user, bloom_level) VALUES ($1, $2, $3, $4, $5)',
      [userId, chatSessionId, message, true, currentBloomLevel]
    );

    // Get recent chat history
    const historyResult = await pool.query(
      'SELECT message, is_user, bloom_level FROM chat_history WHERE user_id = $1 AND session_id = $2 ORDER BY created_at DESC LIMIT 10',
      [userId, chatSessionId]
    );

    const chatHistory = historyResult.rows.reverse();

    // Generate chatbot response
    const botResponse = await generateChatbotResponse(grade, subject, topic, chatHistory, currentBloomLevel);

    // Save bot message
    await pool.query(
      'INSERT INTO chat_history (user_id, session_id, message, is_user, bloom_level) VALUES ($1, $2, $3, $4, $5)',
      [userId, chatSessionId, botResponse.message, false, botResponse.bloomLevel]
    );

    res.json({
      message: botResponse.message,
      bloomLevel: botResponse.bloomLevel,
      suggestNextLevel: botResponse.suggestNextLevel,
      feedback: botResponse.feedback,
      sessionId: chatSessionId
    });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.query;
    const userId = req.user.id;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const result = await pool.query(
      'SELECT message, is_user, bloom_level, created_at FROM chat_history WHERE user_id = $1 AND session_id = $2 ORDER BY created_at ASC',
      [userId, sessionId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
};
