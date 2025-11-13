<template>
  <div class="container">
    <div class="header">
      <button @click="goBack" class="btn btn-secondary">← Back to Dashboard</button>
      <h2>✍️ Practice Questions</h2>
      <div class="topic-info">
        <strong>{{ subject }}</strong> - {{ topic }}
      </div>
    </div>

    <div v-if="contentStore.loading" class="loading">
      <p>🤖 AI is generating practice questions...</p>
    </div>

    <div v-else-if="contentStore.error" class="error">
      {{ contentStore.error }}
    </div>

    <div v-else-if="contentStore.studyMaterial">
      <div class="card">
        <h3>📝 Answer Questions by Bloom's Level</h3>
        <p class="info-text">
          Work through each question and submit your answer for AI assessment.
        </p>

        <div class="questions-list">
          <div 
            v-for="(question, index) in contentStore.studyMaterial.questions" 
            :key="index"
            class="question-card"
          >
            <div class="question-header">
              <span :class="['bloom-badge', question.bloomLevel.toLowerCase()]">
                {{ question.bloomLevel }}
              </span>
              <span class="question-number">Question {{ index + 1 }}</span>
            </div>
            
            <div class="question-content">
              <p class="question-text">{{ question.question }}</p>
              
              <div v-if="!submitted[index]" class="answer-section">
                <div class="input-group">
                  <label>Your Answer:</label>
                  <HandwritingCanvas 
                    v-model="answers[index]"
                    @canvas-data="(data) => canvasData[index] = data"
                    placeholder="Write or type your answer here..."
                    :rows="4"
                    :enable-recognition="true"
                  />
                </div>
                <button 
                  @click="submitAnswer(index, question)"
                  class="btn btn-primary"
                  :disabled="(!answers[index] && !canvasData[index]) || submitting[index]"
                >
                  {{ submitting[index] ? 'Submitting...' : 'Submit Answer' }}
                </button>
              </div>

              <div v-else class="assessment-result">
                <div class="score-display">
                  <div class="score-circle" :class="getScoreClass(assessments[index].score)">
                    {{ assessments[index].score }}%
                  </div>
                  <div class="feedback-section">
                    <div class="feedback-item">
                      <strong>📊 Feedback:</strong>
                      <p>{{ assessments[index].feedback }}</p>
                    </div>
                    <div class="feedback-item">
                      <strong>✅ Strengths:</strong>
                      <p>{{ assessments[index].strengths }}</p>
                    </div>
                    <div class="feedback-item">
                      <strong>💡 Areas to Improve:</strong>
                      <p>{{ assessments[index].improvements }}</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  @click="resetAnswer(index)"
                  class="btn btn-secondary btn-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useContentStore } from '../stores/content';
import HandwritingCanvas from '../components/HandwritingCanvas.vue';

const router = useRouter();
const route = useRoute();
const contentStore = useContentStore();

const subject = ref(route.query.subject || '');
const topic = ref(route.query.topic || '');
const answers = reactive({});
const canvasData = reactive({});
const submitted = reactive({});
const submitting = reactive({});
const assessments = reactive({});

onMounted(async () => {
  if (subject.value && topic.value) {
    try {
      await contentStore.fetchStudyMaterial(subject.value, topic.value);
    } catch (error) {
      console.error('Failed to load study material:', error);
    }
  }
});

const goBack = () => {
  router.push('/dashboard');
};

const submitAnswer = async (index, question) => {
  submitting[index] = true;
  
  try {
    let assessment;
    
    // Check if there's handwriting/drawing
    if (canvasData[index]) {
      // Submit handwritten answer
      assessment = await contentStore.submitHandwrittenAnswer(
        subject.value,
        topic.value,
        question.question,
        canvasData[index],
        question.bloomLevel,
        answers[index] || '' // Include typed text if any
      );
    } else {
      // Submit typed answer only
      assessment = await contentStore.submitAnswer(
        subject.value,
        topic.value,
        question.question,
        answers[index],
        question.bloomLevel
      );
    }
    
    assessments[index] = assessment;
    submitted[index] = true;
  } catch (error) {
    console.error('Failed to submit answer:', error);
    alert('Failed to submit answer. Please try again.');
  } finally {
    submitting[index] = false;
  }
};

const resetAnswer = (index) => {
  answers[index] = '';
  canvasData[index] = null;
  submitted[index] = false;
  delete assessments[index];
};

const getScoreClass = (score) => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  return 'needs-improvement';
};
</script>

<style scoped>
.header {
  margin-bottom: 20px;
}

h2 {
  color: var(--primary-color);
  margin: 15px 0;
}

.topic-info {
  font-size: 18px;
  color: #6b7280;
}

.info-text {
  color: #6b7280;
  margin-bottom: 20px;
}

.questions-list {
  display: grid;
  gap: 20px;
}

.question-card {
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.question-number {
  font-weight: 600;
  color: #6b7280;
}

.question-content {
  display: grid;
  gap: 15px;
}

.question-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 10px;
}

.answer-section {
  display: grid;
  gap: 10px;
}

.assessment-result {
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 8px;
}

.score-display {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 20px;
  margin-bottom: 15px;
}

.score-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.score-circle.excellent {
  background-color: var(--secondary-color);
}

.score-circle.good {
  background-color: var(--warning-color);
}

.score-circle.needs-improvement {
  background-color: var(--danger-color);
}

.feedback-section {
  display: grid;
  gap: 12px;
}

.feedback-item strong {
  display: block;
  margin-bottom: 5px;
  color: var(--text-color);
}

.feedback-item p {
  color: #6b7280;
  line-height: 1.6;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
  width: fit-content;
}
</style>
