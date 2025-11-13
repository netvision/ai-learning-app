import pool from '../database/connection.js';
import { generateStudyMaterial, assessBloomLevel, recognizeAndEvaluateHandwriting } from '../services/openaiService.js';

export const getStudyMaterial = async (req, res) => {
  try {
    const { subject, topic } = req.query;
    const userId = req.user.id;

    if (!subject || !topic) {
      return res.status(400).json({ error: 'Subject and topic are required' });
    }

    // Get user's grade
    const userResult = await pool.query('SELECT grade FROM users WHERE id = $1', [userId]);
    const grade = userResult.rows[0].grade;

    // Generate study material using OpenAI
    const content = await generateStudyMaterial(grade, subject, topic);

    // Save to database
    await pool.query(
      'INSERT INTO study_sessions (user_id, subject, topic, content_type, content) VALUES ($1, $2, $3, $4, $5)',
      [userId, subject, topic, 'study_material', JSON.stringify(content)]
    );

    res.json(content);
  } catch (error) {
    console.error('Error getting study material:', error);
    res.status(500).json({ error: 'Failed to generate study material' });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { subject, topic, question, answer, bloomLevel } = req.body;
    const userId = req.user.id;

    if (!subject || !topic || !question || !answer || !bloomLevel) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Assess the answer using OpenAI
    const assessment = await assessBloomLevel(question, answer, bloomLevel);

    // Update bloom_progress
    await pool.query(
      `INSERT INTO bloom_progress (user_id, subject, topic, bloom_level, score, attempts, last_updated)
       VALUES ($1, $2, $3, $4, $5, 1, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, subject, topic, bloom_level)
       DO UPDATE SET 
         score = ((bloom_progress.score * bloom_progress.attempts) + $5) / (bloom_progress.attempts + 1),
         attempts = bloom_progress.attempts + 1,
         last_updated = CURRENT_TIMESTAMP`,
      [userId, subject, topic, bloomLevel, assessment.score]
    );

    res.json(assessment);
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ error: 'Failed to assess answer' });
  }
};

export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subject, topic } = req.query;

    let query = 'SELECT * FROM bloom_progress WHERE user_id = $1';
    const params = [userId];

    if (subject && topic) {
      query += ' AND subject = $2 AND topic = $3';
      params.push(subject, topic);
    }

    query += ' ORDER BY bloom_level';

    const result = await pool.query(query, params);

    // Group by subject and topic
    const progressMap = {};

    result.rows.forEach(row => {
      const key = `${row.subject}|${row.topic}`;
      if (!progressMap[key]) {
        progressMap[key] = {
          subject: row.subject,
          topic: row.topic,
          bloomLevels: {}
        };
      }
      progressMap[key].bloomLevels[row.bloom_level] = {
        score: Math.round(row.score),
        attempts: row.attempts,
        lastUpdated: row.last_updated
      };
    });

    res.json(Object.values(progressMap));
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ error: 'Failed to retrieve progress' });
  }
};

// New endpoint for handwriting recognition and evaluation
export const submitHandwrittenAnswer = async (req, res) => {
  try {
    const { subject, topic, question, imageData, bloomLevel, typedAnswer } = req.body;
    const userId = req.user.id;

    if (!subject || !topic || !question || !imageData || !bloomLevel) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Recognize and evaluate handwriting using OpenAI Vision
    const assessment = await recognizeAndEvaluateHandwriting(
      imageData, 
      question, 
      bloomLevel,
      typedAnswer ? `Student also typed: ${typedAnswer}` : ''
    );

    // Update bloom_progress
    await pool.query(
      `INSERT INTO bloom_progress (user_id, subject, topic, bloom_level, score, attempts, last_updated)
       VALUES ($1, $2, $3, $4, $5, 1, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, subject, topic, bloom_level)
       DO UPDATE SET 
         score = ((bloom_progress.score * bloom_progress.attempts) + $5) / (bloom_progress.attempts + 1),
         attempts = bloom_progress.attempts + 1,
         last_updated = CURRENT_TIMESTAMP`,
      [userId, subject, topic, bloomLevel, assessment.score]
    );

    res.json(assessment);
  } catch (error) {
    console.error('Error submitting handwritten answer:', error);
    res.status(500).json({ error: 'Failed to assess handwritten answer' });
  }
};
