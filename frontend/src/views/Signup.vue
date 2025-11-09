<template>
  <div class="container">
    <div class="auth-wrapper">
      <div class="card auth-card">
        <h2>Student Signup</h2>
        <div v-if="error" class="error">{{ error }}</div>
        <form @submit.prevent="handleSignup">
          <div class="input-group">
            <label for="name">Full Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              placeholder="Enter your name"
            />
          </div>
          <div class="input-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Enter your email"
            />
          </div>
          <div class="input-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="Create a password"
            />
          </div>
          <div class="input-group">
            <label for="grade">Grade</label>
            <select id="grade" v-model="grade" required>
              <option value="">Select your grade</option>
              <option value="K">Kindergarten</option>
              <option value="1">1st Grade</option>
              <option value="2">2nd Grade</option>
              <option value="3">3rd Grade</option>
              <option value="4">4th Grade</option>
              <option value="5">5th Grade</option>
              <option value="6">6th Grade</option>
              <option value="7">7th Grade</option>
              <option value="8">8th Grade</option>
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
              <option value="11">11th Grade</option>
              <option value="12">12th Grade</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary full-width" :disabled="loading">
            {{ loading ? 'Signing up...' : 'Sign Up' }}
          </button>
        </form>
        <p class="auth-link">
          Already have an account? <router-link to="/login">Login here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const grade = ref('');
const error = ref('');
const loading = ref(false);

const handleSignup = async () => {
  error.value = '';
  loading.value = true;
  
  try {
    await authStore.signup(email.value, password.value, name.value, grade.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.auth-card {
  width: 100%;
  max-width: 400px;
}

.auth-card h2 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--primary-color);
}

.full-width {
  width: 100%;
}

.auth-link {
  text-align: center;
  margin-top: 15px;
  color: #6b7280;
}

.auth-link a {
  color: var(--primary-color);
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>
