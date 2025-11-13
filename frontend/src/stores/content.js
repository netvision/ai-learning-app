import { defineStore } from 'pinia';
import { contentAPI } from '../api';

export const useContentStore = defineStore('content', {
  state: () => ({
    studyMaterial: null,
    progress: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchStudyMaterial(subject, topic) {
      this.loading = true;
      this.error = null;
      try {
        const response = await contentAPI.getStudyMaterial(subject, topic);
        this.studyMaterial = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to load study material';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async submitAnswer(subject, topic, question, answer, bloomLevel) {
      try {
        const response = await contentAPI.submitAnswer({
          subject,
          topic,
          question,
          answer,
          bloomLevel,
        });
        await this.fetchProgress(subject, topic);
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || 'Failed to submit answer';
      }
    },

    async submitHandwrittenAnswer(subject, topic, question, imageData, bloomLevel, typedAnswer = '') {
      try {
        const response = await contentAPI.submitHandwrittenAnswer({
          subject,
          topic,
          question,
          imageData,
          bloomLevel,
          typedAnswer,
        });
        await this.fetchProgress(subject, topic);
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || 'Failed to submit handwritten answer';
      }
    },

    async fetchProgress(subject, topic) {
      try {
        const response = await contentAPI.getProgress(subject, topic);
        this.progress = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to load progress';
        throw this.error;
      }
    },
  },
});
