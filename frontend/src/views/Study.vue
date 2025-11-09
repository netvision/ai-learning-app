<template>
  <div class="container">
    <div class="header">
      <button @click="goBack" class="btn btn-secondary">← Back to Dashboard</button>
      <h2>📖 Study Material</h2>
      <div class="topic-info">
        <strong>{{ subject }}</strong> - {{ topic }}
      </div>
    </div>

    <div v-if="contentStore.loading" class="loading">
      <p>🤖 AI is generating your personalized study material...</p>
    </div>

    <div v-else-if="contentStore.error" class="error">
      {{ contentStore.error }}
    </div>

    <div v-else-if="contentStore.studyMaterial">
      <div class="card study-guide-card">
        <h3>📚 Comprehensive Study Guide</h3>
        
        <!-- Introduction -->
        <div v-if="contentStore.studyMaterial.studyGuide.introduction" class="study-section">
          <h4>📝 Introduction</h4>
          <p class="section-content">{{ contentStore.studyMaterial.studyGuide.introduction }}</p>
        </div>

        <!-- Key Concepts -->
        <div v-if="contentStore.studyMaterial.studyGuide.keyConcepts" class="study-section">
          <h4>💡 Key Concepts</h4>
          <ul class="concepts-list">
            <li v-for="(concept, index) in contentStore.studyMaterial.studyGuide.keyConcepts" :key="index">
              {{ concept }}
            </li>
          </ul>
        </div>

        <!-- Detailed Explanation -->
        <div v-if="contentStore.studyMaterial.studyGuide.detailedExplanation" class="study-section">
          <h4>📖 Detailed Explanation</h4>
          <div class="section-content explanation">{{ contentStore.studyMaterial.studyGuide.detailedExplanation }}</div>
        </div>

        <!-- Examples -->
        <div v-if="contentStore.studyMaterial.studyGuide.examples" class="study-section">
          <h4>✏️ Worked Examples</h4>
          <div 
            v-for="(example, index) in contentStore.studyMaterial.studyGuide.examples" 
            :key="index"
            class="example-box"
          >
            <strong>Example {{ index + 1 }}:</strong>
            <p>{{ example }}</p>
          </div>
        </div>

        <!-- Important Terms -->
        <div v-if="contentStore.studyMaterial.studyGuide.importantTerms" class="study-section">
          <h4>📌 Important Terms</h4>
          <div class="terms-grid">
            <div 
              v-for="(term, index) in contentStore.studyMaterial.studyGuide.importantTerms" 
              :key="index"
              class="term-card"
            >
              <strong>{{ term.term }}:</strong>
              <span>{{ term.definition }}</span>
            </div>
          </div>
        </div>

        <!-- Common Mistakes -->
        <div v-if="contentStore.studyMaterial.studyGuide.commonMistakes" class="study-section">
          <h4>⚠️ Common Mistakes to Avoid</h4>
          <ul class="mistakes-list">
            <li v-for="(mistake, index) in contentStore.studyMaterial.studyGuide.commonMistakes" :key="index">
              {{ mistake }}
            </li>
          </ul>
        </div>

        <!-- Tips and Tricks -->
        <div v-if="contentStore.studyMaterial.studyGuide.tipsAndTricks" class="study-section">
          <h4>💪 Tips and Tricks</h4>
          <ul class="tips-list">
            <li v-for="(tip, index) in contentStore.studyMaterial.studyGuide.tipsAndTricks" :key="index">
              {{ tip }}
            </li>
          </ul>
        </div>

        <!-- Summary -->
        <div v-if="contentStore.studyMaterial.studyGuide.summary" class="study-section summary">
          <h4>📋 Summary</h4>
          <p class="section-content">{{ contentStore.studyMaterial.studyGuide.summary }}</p>
        </div>

        <!-- Fallback for old format -->
        <div v-if="typeof contentStore.studyMaterial.studyGuide === 'string'" class="study-section">
          <div class="section-content">{{ contentStore.studyMaterial.studyGuide }}</div>
        </div>
      </div>

      <div class="card">
        <h3>📝 Practice Questions by Bloom's Taxonomy</h3>
        <p class="info-text">
          These questions are designed to help you progress through all levels of understanding.
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
              
              <button 
                v-if="!showSolution[index]"
                @click="toggleSolution(index, 'hint')"
                class="btn btn-secondary btn-sm"
              >
                💡 Show Hint
              </button>
              
              <div v-if="showHint[index]" class="hint">
                <strong>Hint:</strong> {{ question.hint }}
              </div>
              
              <button 
                v-if="!showSolution[index]"
                @click="toggleSolution(index, 'solution')"
                class="btn btn-primary btn-sm"
              >
                ✅ Show Solution
              </button>
              
              <div v-if="showSolution[index]" class="solution">
                <strong>Solution:</strong>
                <p>{{ question.solution }}</p>
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

const router = useRouter();
const route = useRoute();
const contentStore = useContentStore();

const subject = ref(route.query.subject || '');
const topic = ref(route.query.topic || '');
const showSolution = reactive({});
const showHint = reactive({});

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

const toggleSolution = (index, type) => {
  if (type === 'hint') {
    showHint[index] = !showHint[index];
  } else {
    showSolution[index] = !showSolution[index];
  }
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

.study-guide {
  line-height: 1.8;
  white-space: pre-wrap;
  font-size: 16px;
}

.study-guide-card {
  margin-bottom: 30px;
}

.study-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.study-section:last-child {
  border-bottom: none;
}

.study-section h4 {
  color: var(--primary-color);
  margin-bottom: 15px;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-content {
  line-height: 1.8;
  font-size: 16px;
  color: var(--text-color);
  white-space: pre-wrap;
}

.explanation {
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.concepts-list,
.mistakes-list,
.tips-list {
  list-style: none;
  padding: 0;
}

.concepts-list li,
.mistakes-list li,
.tips-list li {
  padding: 12px 15px;
  margin-bottom: 10px;
  background-color: #f3f4f6;
  border-radius: 6px;
  border-left: 4px solid var(--secondary-color);
  line-height: 1.6;
}

.concepts-list li {
  border-left-color: #3b82f6;
}

.mistakes-list li {
  border-left-color: var(--warning-color);
  background-color: #fef3c7;
}

.tips-list li {
  border-left-color: var(--secondary-color);
  background-color: #d1fae5;
}

.example-box {
  background-color: #ede9fe;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border-left: 4px solid #8b5cf6;
}

.example-box strong {
  color: #7c3aed;
  display: block;
  margin-bottom: 8px;
}

.example-box p {
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
}

.terms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.term-card {
  background-color: #fff7ed;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
}

.term-card strong {
  color: #d97706;
  display: block;
  margin-bottom: 5px;
}

.term-card span {
  color: var(--text-color);
  line-height: 1.5;
}

.summary {
  background-color: #ecfccb;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid var(--secondary-color);
}

.summary h4 {
  color: var(--secondary-color);
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
  transition: border-color 0.3s;
}

.question-card:hover {
  border-color: var(--primary-color);
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
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
  width: fit-content;
}

.hint {
  background-color: #fef3c7;
  border-left: 4px solid var(--warning-color);
  padding: 12px;
  border-radius: 4px;
}

.solution {
  background-color: #d1fae5;
  border-left: 4px solid var(--secondary-color);
  padding: 12px;
  border-radius: 4px;
}

.solution p {
  margin-top: 8px;
  white-space: pre-wrap;
}
</style>
