import { defineStore } from 'pinia';
import { authAPI } from '../api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
  }),

  actions: {
    async signup(email, password, name, grade) {
      try {
        const response = await authAPI.signup({ email, password, name, grade });
        this.token = response.data.token;
        this.user = response.data.user;
        this.isAuthenticated = true;
        localStorage.setItem('token', this.token);
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || 'Signup failed';
      }
    },

    async login(email, password) {
      try {
        const response = await authAPI.login({ email, password });
        this.token = response.data.token;
        this.user = response.data.user;
        this.isAuthenticated = true;
        localStorage.setItem('token', this.token);
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || 'Login failed';
      }
    },

    async loadUser() {
      if (!this.token) return;
      
      try {
        const response = await authAPI.getProfile();
        this.user = response.data;
        this.isAuthenticated = true;
      } catch (error) {
        this.logout();
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});
