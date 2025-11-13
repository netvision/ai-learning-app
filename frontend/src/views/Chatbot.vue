<template>
  <div class="container">
    <div class="header">
      <button @click="goBack" class="btn btn-secondary">← Back to Dashboard</button>
      <h2>💬 AI Tutor Chatbot</h2>
      <div class="topic-info">
        <strong>{{ subject }}</strong> - {{ topic }}
      </div>
    </div>

    <div class="chatbot-container">
      <div class="card chatbot-card">
        <div class="bloom-level-selector">
          <label>Current Bloom's Level:</label>
          <select v-model="currentBloomLevel" class="bloom-select">
            <option v-for="level in bloomLevels" :key="level" :value="level">
              {{ level }}
            </option>
          </select>
          <span :class="['bloom-badge', currentBloomLevel.toLowerCase()]">
            {{ currentBloomLevel }}
          </span>
        </div>

        <div class="chat-messages" ref="messagesContainer">
          <div v-if="messages.length === 0" class="welcome-message">
            <h3>👋 Welcome to your AI Tutor!</h3>
            <p>I'll guide you through {{ subject }}: {{ topic }} using Bloom's Taxonomy levels.</p>
            <p>We'll start at the <strong>{{ currentBloomLevel }}</strong> level. As you master concepts, I'll help you progress to higher levels!</p>
            <p>Ask me anything to get started!</p>
          </div>

          <div 
            v-for="(message, index) in messages" 
            :key="index"
            :class="['message', message.isUser ? 'user-message' : 'bot-message']"
          >
            <div class="message-content">
              <div v-if="!message.isUser && message.bloomLevel" class="message-bloom">
                <span :class="['bloom-badge', message.bloomLevel.toLowerCase()]">
                  {{ message.bloomLevel }}
                </span>
              </div>
              <p>{{ message.text }}</p>
              <div v-if="!message.isUser && message.feedback" class="message-feedback">
                <em>{{ message.feedback }}</em>
              </div>
            </div>
          </div>

          <div v-if="isTyping" class="message bot-message typing">
            <div class="message-content">
              <p>AI Tutor is thinking...</p>
            </div>
          </div>
        </div>

        <div v-if="suggestedLevelUp" class="level-up-notification">
          <p>🎉 Great job! Ready to move to the next Bloom's level?</p>
          <button @click="acceptLevelUp" class="btn btn-primary btn-sm">
            Yes, level up!
          </button>
          <button @click="suggestedLevelUp = false" class="btn btn-secondary btn-sm">
            Stay at {{ currentBloomLevel }}
          </button>
        </div>

        <div class="chat-input-area">
          <HandwritingCanvas 
            v-model="userInput"
            @canvas-data="handleCanvasData"
            placeholder="Write or type your message or question..."
            :rows="2"
            :enable-recognition="true"
          />
          <button 
            @click="sendMessage"
            class="btn btn-primary"
            :disabled="(!userInput.trim() && !currentCanvasData) || isTyping"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { chatAPI } from '../api';
import HandwritingCanvas from '../components/HandwritingCanvas.vue';

const router = useRouter();
const route = useRoute();

const subject = ref(route.query.subject || '');
const topic = ref(route.query.topic || '');

const bloomLevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
const currentBloomLevel = ref('Remember');

const messages = ref([]);
const userInput = ref('');
const currentCanvasData = ref(null);
const isTyping = ref(false);
const sessionId = ref(null);
const messagesContainer = ref(null);
const suggestedLevelUp = ref(false);
const pendingNextLevel = ref('');

const goBack = () => {
  router.push('/dashboard');
};

const handleCanvasData = (data) => {
  currentCanvasData.value = data;
};

const sendMessage = async () => {
  if (!userInput.value.trim() && !currentCanvasData.value) return;

  const messageText = userInput.value || '[Handwritten message]';
  userInput.value = '';
  const canvasData = currentCanvasData.value;
  currentCanvasData.value = null;

  // Add user message
  messages.value.push({
    text: messageText,
    isUser: true,
    hasDrawing: !!canvasData
  });

  scrollToBottom();
  isTyping.value = true;

  try {
    const response = await chatAPI.sendMessage({
      message: messageText,
      subject: subject.value,
      topic: topic.value,
      sessionId: sessionId.value,
      currentBloomLevel: currentBloomLevel.value,
    });

    sessionId.value = response.data.sessionId;

    // Add bot response
    messages.value.push({
      text: response.data.message,
      isUser: false,
      bloomLevel: response.data.bloomLevel,
      feedback: response.data.feedback,
    });

    // Check if level up is suggested
    if (response.data.suggestNextLevel) {
      const currentIndex = bloomLevels.indexOf(currentBloomLevel.value);
      if (currentIndex < bloomLevels.length - 1) {
        pendingNextLevel.value = bloomLevels[currentIndex + 1];
        suggestedLevelUp.value = true;
      }
    }

    scrollToBottom();
  } catch (error) {
    console.error('Failed to send message:', error);
    messages.value.push({
      text: 'Sorry, I encountered an error. Please try again.',
      isUser: false,
    });
  } finally {
    isTyping.value = false;
  }
};

const acceptLevelUp = () => {
  currentBloomLevel.value = pendingNextLevel.value;
  suggestedLevelUp.value = false;
  
  messages.value.push({
    text: `Great! Let's continue at the ${currentBloomLevel.value} level! 🎉`,
    isUser: false,
    bloomLevel: currentBloomLevel.value,
  });
  
  scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
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

.chatbot-container {
  max-width: 900px;
  margin: 0 auto;
}

.chatbot-card {
  height: calc(100vh - 250px);
  display: flex;
  flex-direction: column;
}

.bloom-level-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 15px;
}

.bloom-level-selector label {
  font-weight: 600;
  color: var(--text-color);
}

.bloom-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.welcome-message {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.welcome-message h3 {
  color: var(--primary-color);
  margin-bottom: 15px;
}

.welcome-message p {
  margin-bottom: 10px;
  line-height: 1.6;
}

.message {
  display: flex;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
}

.user-message .message-content {
  background-color: var(--primary-color);
  color: white;
  padding: 12px 16px;
  border-radius: 18px 18px 4px 18px;
}

.bot-message {
  align-self: flex-start;
}

.bot-message .message-content {
  background-color: white;
  color: var(--text-color);
  padding: 12px 16px;
  border-radius: 18px 18px 18px 4px;
  border: 1px solid var(--border-color);
}

.message-bloom {
  margin-bottom: 8px;
}

.message-feedback {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
  color: #6b7280;
  font-size: 14px;
}

.typing .message-content {
  font-style: italic;
  color: #6b7280;
}

.level-up-notification {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-up-notification p {
  flex: 1;
  font-weight: 500;
}

.chat-input-area {
  display: flex;
  gap: 10px;
}

.chat-input-area textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  resize: none;
  font-family: inherit;
}

.chat-input-area button {
  align-self: flex-end;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
}
</style>
