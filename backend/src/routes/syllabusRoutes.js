import express from 'express';
import { syllabus, getTopicsByGradeAndSubject, getSubjectsByGrade } from '../data/syllabus.js';

const router = express.Router();

// Get all subjects for a specific grade
router.get('/subjects/:grade', (req, res) => {
  try {
    const { grade } = req.params;
    const subjects = getSubjectsByGrade(grade);
    
    if (subjects.length === 0) {
      return res.status(404).json({ error: 'Grade not found' });
    }
    
    res.json({ grade, subjects });
  } catch (error) {
    console.error('Error getting subjects:', error);
    res.status(500).json({ error: 'Failed to get subjects' });
  }
});

// Get all topics for a specific grade and subject
router.get('/topics/:grade/:subject', (req, res) => {
  try {
    const { grade, subject } = req.params;
    const topics = getTopicsByGradeAndSubject(grade, subject);
    
    if (topics.length === 0) {
      return res.status(404).json({ error: 'No topics found for this grade and subject' });
    }
    
    res.json({ grade, subject, topics });
  } catch (error) {
    console.error('Error getting topics:', error);
    res.status(500).json({ error: 'Failed to get topics' });
  }
});

// Get entire syllabus (optional - for debugging)
router.get('/all', (req, res) => {
  res.json(syllabus);
});

export default router;
