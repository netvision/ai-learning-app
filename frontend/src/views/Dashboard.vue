<template>
  <div class="container">
    <h2>Student Dashboard</h2>
    
    <div class="card">
      <h3>📚 Start Learning</h3>
      <div class="topic-selector">
        <div class="input-group">
          <label for="subject">Subject</label>
          <select id="subject" v-model="selectedSubject" @change="onSubjectChange">
            <option value="">Select a subject</option>
            <option v-for="subject in availableSubjects" :key="subject" :value="subject">
              {{ subject }}
            </option>
          </select>
        </div>
        <div class="input-group">
          <label for="topic">Topic</label>
          <select 
            id="topic" 
            v-model="selectedTopic"
            :disabled="!selectedSubject || loadingTopics"
          >
            <option value="">{{ topicPlaceholder }}</option>
            <option v-for="topic in availableTopics" :key="topic" :value="topic">
              {{ topic }}
            </option>
          </select>
          <small v-if="selectedSubject && availableTopics.length > 0" class="helper-text">
            Or type your own topic below
          </small>
        </div>
        <div class="input-group">
          <label for="customTopic">Custom Topic (Optional)</label>
          <input
            id="customTopic"
            v-model="customTopic"
            type="text"
            placeholder="Enter your own topic if not in the list above"
          />
        </div>
        <div class="action-buttons">
          <button 
            @click="goToStudy" 
            class="btn btn-primary"
            :disabled="!canProceed"
          >
            📖 Study Material
          </button>
          <button 
            @click="goToPractice" 
            class="btn btn-secondary"
            :disabled="!canProceed"
          >
            ✍️ Practice Questions
          </button>
          <button 
            @click="goToChatbot" 
            class="btn btn-primary"
            :disabled="!canProceed"
          >
            💬 Chatbot Tutor
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>📊 Your Bloom's Taxonomy Progress</h3>
      <div v-if="progressLoading" class="loading">Loading progress...</div>
      <div v-else-if="contentStore.progress.length === 0" class="empty-state">
        <p>Start learning to track your progress across Bloom's Taxonomy levels!</p>
      </div>
      <div v-else class="progress-grid">
        <div v-for="item in contentStore.progress" :key="`${item.subject}-${item.topic}`" class="progress-item">
          <h4>{{ item.subject }}: {{ item.topic }}</h4>
          <div class="bloom-levels">
            <div v-for="level in bloomLevels" :key="level" class="level-progress">
              <span :class="['bloom-badge', level.toLowerCase()]">{{ level }}</span>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: getProgress(item.bloomLevels[level]) + '%' }"
                  :class="level.toLowerCase()"
                ></div>
              </div>
              <span class="progress-text">
                {{ item.bloomLevels[level] ? item.bloomLevels[level].score + '%' : '0%' }}
                {{ item.bloomLevels[level] ? `(${item.bloomLevels[level].attempts} attempts)` : '' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useContentStore } from '../stores/content';
import { useAuthStore } from '../stores/auth';
import { syllabusAPI } from '../api';

const router = useRouter();
const contentStore = useContentStore();
const authStore = useAuthStore();

const selectedSubject = ref('');
const selectedTopic = ref('');
const customTopic = ref('');
const progressLoading = ref(false);
const loadingTopics = ref(false);

const availableSubjects = ref([]);
const availableTopics = ref([]);

const bloomLevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

const topicPlaceholder = computed(() => {
  if (!selectedSubject.value) return 'Select a subject first';
  if (loadingTopics.value) return 'Loading topics...';
  if (availableTopics.value.length === 0) return 'No topics available';
  return 'Select a topic from syllabus';
});

const canProceed = computed(() => {
  return selectedSubject.value && (selectedTopic.value || customTopic.value);
});

const finalTopic = computed(() => {
  return customTopic.value || selectedTopic.value;
});

onMounted(async () => {
  progressLoading.value = true;
  try {
    await contentStore.fetchProgress();
    
    // Load subjects based on user's grade
    if (authStore.user?.grade) {
      await loadSubjectsForGrade(authStore.user.grade);
    }
  } catch (error) {
    console.error('Failed to load initial data:', error);
  } finally {
    progressLoading.value = false;
  }
});

const loadSubjectsForGrade = async (grade) => {
  try {
    const response = await syllabusAPI.getSubjects(grade);
    availableSubjects.value = response.data.subjects;
  } catch (error) {
    console.error('Failed to load subjects:', error);
    // Fallback to default subjects
    availableSubjects.value = ['Mathematics', 'Science', 'English', 'History'];
  }
};

const onSubjectChange = async () => {
  selectedTopic.value = '';
  customTopic.value = '';
  availableTopics.value = [];
  
  if (!selectedSubject.value || !authStore.user?.grade) return;
  
  loadingTopics.value = true;
  try {
    const response = await syllabusAPI.getTopics(authStore.user.grade, selectedSubject.value);
    availableTopics.value = response.data.topics;
  } catch (error) {
    console.error('Failed to load topics:', error);
    availableTopics.value = [];
  } finally {
    loadingTopics.value = false;
  }
};

const goToStudy = () => {
  router.push({
    name: 'Study',
    query: { subject: selectedSubject.value, topic: finalTopic.value }
  });
};

const goToPractice = () => {
  router.push({
    name: 'Practice',
    query: { subject: selectedSubject.value, topic: finalTopic.value }
  });
};

const goToChatbot = () => {
  router.push({
    name: 'Chatbot',
    query: { subject: selectedSubject.value, topic: finalTopic.value }
  });
};

const getProgress = (levelData) => {
  return levelData ? levelData.score : 0;
};
</script>

<style scoped>
h2 {
  color: var(--primary-color);
  margin-bottom: 20px;
}

h3 {
  color: var(--text-color);
  margin-bottom: 15px;
}

.topic-selector {
  display: grid;
  gap: 15px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-buttons .btn {
  flex: 1;
  min-width: 150px;
}

.helper-text {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
}

.empty-state {
  text-align: center;
  color: #6b7280;
  padding: 40px 20px;
}

.progress-grid {
  display: grid;
  gap: 20px;
}

.progress-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
}

.progress-item h4 {
  margin-bottom: 15px;
  color: var(--primary-color);
}

.bloom-levels {
  display: grid;
  gap: 12px;
}

.level-progress {
  display: grid;
  grid-template-columns: 120px 1fr 150px;
  gap: 10px;
  align-items: center;
}

.progress-bar {
  height: 20px;
  background-color: #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-fill.remember { background-color: var(--bloom-remember); }
.progress-fill.understand { background-color: var(--bloom-understand); }
.progress-fill.apply { background-color: var(--bloom-apply); }
.progress-fill.analyze { background-color: var(--bloom-analyze); }
.progress-fill.evaluate { background-color: var(--bloom-evaluate); }
.progress-fill.create { background-color: var(--bloom-create); }

.progress-text {
  font-size: 14px;
  color: #6b7280;
}
</style>
