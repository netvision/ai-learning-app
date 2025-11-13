import axios from 'axios';
import API_URL from '../config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const contentAPI = {
  getStudyMaterial: (subject, topic) => 
    api.get(`/content/study-material?subject=${subject}&topic=${topic}`),
  submitAnswer: (data) => api.post('/content/submit-answer', data),
  submitHandwrittenAnswer: (data) => api.post('/content/submit-handwritten-answer', data),
  getProgress: (subject, topic) => {
    let url = '/content/progress';
    if (subject && topic) {
      url += `?subject=${subject}&topic=${topic}`;
    }
    return api.get(url);
  },
};

export const chatAPI = {
  sendMessage: (data) => api.post('/chat/chat', data),
  getHistory: (sessionId) => api.get(`/chat/history?sessionId=${sessionId}`),
  recognizeHandwriting: (imageData) => api.post('/chat/recognize-handwriting', { imageData }),
};

export const syllabusAPI = {
  getSubjects: (grade) => api.get(`/syllabus/subjects/${grade}`),
  getTopics: (grade, subject) => api.get(`/syllabus/topics/${grade}/${encodeURIComponent(subject)}`),
};

export default api;
