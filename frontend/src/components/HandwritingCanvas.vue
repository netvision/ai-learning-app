<template>
  <div class="handwriting-canvas-container">
    <div class="canvas-header">
      <button @click="toggleMode" class="mode-toggle">
        {{ isHandwritingMode ? '✏️ Hide Drawing Pad' : '📝 Show Drawing Pad' }}
      </button>
      <div v-if="isHandwritingMode" class="canvas-controls">
        <button @click="clearCanvas" class="control-btn clear-btn">🗑️ Clear</button>
        <button @click="undoStroke" class="control-btn undo-btn">↶ Undo</button>
        <button v-if="enableRecognition" @click="recognizeDrawing" class="control-btn recognize-btn" :disabled="strokes.length === 0 || isRecognizing">
          {{ isRecognizing ? '🔍 Recognizing...' : '🔍 Recognize' }}
        </button>
      </div>
    </div>

    <!-- Always show text input -->
    <textarea
      v-model="recognizedText"
      @input="$emit('update:modelValue', recognizedText)"
      :placeholder="placeholder"
      class="text-input"
      :rows="rows"
    ></textarea>

    <!-- Optional drawing canvas -->
    <div v-if="isHandwritingMode" class="drawing-section">
      <div class="info-banner">
        <strong>✏️ Drawing Pad:</strong> Write, draw diagrams, or show your work here.
        <span v-if="enableRecognition">Click "Recognize" to convert handwriting to text, or just submit your drawing as-is.</span>
        <span v-else>Your drawing will be evaluated along with your typed answer.</span>
      </div>
      <canvas
        ref="canvas"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="stopDrawing"
        class="drawing-canvas"
      ></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';

export default {
  name: 'HandwritingCanvas',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Type your answer here...'
    },
    rows: {
      type: Number,
      default: 4
    },
    enableRecognition: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'canvas-data'],
  setup(props, { emit }) {
    const canvas = ref(null);
    const isHandwritingMode = ref(false);
    const isDrawing = ref(false);
    const recognizedText = ref(props.modelValue);
    const isRecognizing = ref(false);
    
    const strokes = ref([]);
    const currentStroke = ref([]);
    
    let ctx = null;

    onMounted(() => {
      if (canvas.value) {
        initCanvas();
      }
    });

    watch(() => props.modelValue, (newValue) => {
      recognizedText.value = newValue;
    });

    watch(strokes, () => {
      // Emit canvas data whenever strokes change
      if (canvas.value && strokes.value.length > 0) {
        const imageData = canvas.value.toDataURL('image/png');
        emit('canvas-data', imageData);
      } else {
        emit('canvas-data', null);
      }
    }, { deep: true });

    const initCanvas = () => {
      if (!canvas.value) return;
      ctx = canvas.value.getContext('2d');
      const rect = canvas.value.parentElement.getBoundingClientRect();
      
      // Make canvas larger for smartpanels
      canvas.value.width = Math.max(rect.width - 40, 800);
      canvas.value.height = 400; // Increased from 200 to 400
      
      // White background for better visibility
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);
      
      ctx.strokeStyle = '#2c3e50';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    const toggleMode = () => {
      isHandwritingMode.value = !isHandwritingMode.value;
      if (isHandwritingMode.value) {
        setTimeout(() => {
          if (canvas.value) {
            initCanvas();
          }
        }, 50);
      } else {
        // Clear canvas data when hiding
        emit('canvas-data', null);
      }
    };

    const getCoordinates = (event) => {
      const rect = canvas.value.getBoundingClientRect();
      const scaleX = canvas.value.width / rect.width;
      const scaleY = canvas.value.height / rect.height;

      if (event.type.startsWith('touch')) {
        const touch = event.touches[0] || event.changedTouches[0];
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY
        };
      } else {
        return {
          x: (event.clientX - rect.left) * scaleX,
          y: (event.clientY - rect.top) * scaleY
        };
      }
    };

    const startDrawing = (event) => {
      if (!ctx || !canvas.value) {
        initCanvas();
      }
      event.preventDefault();
      isDrawing.value = true;
      const coords = getCoordinates(event);
      currentStroke.value = [[coords.x, coords.y]];
      
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    };

    const draw = (event) => {
      if (!isDrawing.value) return;
      event.preventDefault();
      
      const coords = getCoordinates(event);
      currentStroke.value.push([coords.x, coords.y]);
      
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    };

    const stopDrawing = (event) => {
      if (!isDrawing.value) return;
      event.preventDefault();
      
      isDrawing.value = false;
      if (currentStroke.value.length > 0) {
        strokes.value.push([...currentStroke.value]);
        currentStroke.value = [];
      }
    };

    const handleTouchStart = (event) => {
      event.preventDefault();
      startDrawing(event);
    };

    const handleTouchMove = (event) => {
      event.preventDefault();
      draw(event);
    };

    const clearCanvas = () => {
      if (!ctx || !canvas.value) return;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);
      strokes.value = [];
      currentStroke.value = [];
    };

    const undoStroke = () => {
      if (strokes.value.length === 0) return;
      
      strokes.value.pop();
      redrawCanvas();
    };

    const redrawCanvas = () => {
      if (!ctx || !canvas.value) return;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);
      
      strokes.value.forEach(stroke => {
        ctx.beginPath();
        ctx.moveTo(stroke[0][0], stroke[0][1]);
        stroke.forEach(point => {
          ctx.lineTo(point[0], point[1]);
        });
        ctx.stroke();
      });
    };

    const recognizeDrawing = async () => {
      if (!canvas.value || strokes.value.length === 0) return;
      
      isRecognizing.value = true;
      
      try {
        const imageData = canvas.value.toDataURL('image/png');
        
        // Import the API here to avoid circular dependencies
        const { chatAPI } = await import('../api/index.js');
        const response = await chatAPI.recognizeHandwriting(imageData);
        
        if (response.data.text) {
          // Append or replace based on if there's existing text
          if (recognizedText.value.trim()) {
            recognizedText.value += '\n\n' + response.data.text;
          } else {
            recognizedText.value = response.data.text;
          }
          emit('update:modelValue', recognizedText.value);
        }
      } catch (error) {
        console.error('Error recognizing handwriting:', error);
        alert('Failed to recognize handwriting. Your drawing will still be submitted for evaluation.');
      } finally {
        isRecognizing.value = false;
      }
    };

    const useAsText = () => {
      // Removed - not practical for classroom use
    };

    return {
      canvas,
      isHandwritingMode,
      isDrawing,
      recognizedText,
      strokes,
      isRecognizing,
      toggleMode,
      startDrawing,
      draw,
      stopDrawing,
      handleTouchStart,
      handleTouchMove,
      clearCanvas,
      undoStroke,
      recognizeDrawing
    };
  }
};
</script>

<style scoped>
.handwriting-canvas-container {
  width: 100%;
  margin: 1rem 0;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.mode-toggle {
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.mode-toggle:hover {
  background: #2980b9;
}

.canvas-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.clear-btn {
  background: #e74c3c;
  color: white;
}

.clear-btn:hover {
  background: #c0392b;
}

.undo-btn {
  background: #95a5a6;
  color: white;
}

.undo-btn:hover {
  background: #7f8c8d;
}

.recognize-btn {
  background: #9b59b6;
  color: white;
}

.recognize-btn:hover:not(:disabled) {
  background: #8e44ad;
}

.recognize-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.text-input:focus {
  outline: none;
  border-color: #3498db;
}

.drawing-section {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  max-height: 600px;
  overflow-y: auto;
}

.info-banner {
  margin: 0 0 1rem 0;
  padding: 0.75rem;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  color: #856404;
  font-size: 0.9rem;
  line-height: 1.5;
  position: sticky;
  top: 0;
  z-index: 1;
}

.info-banner strong {
  color: #856404;
}

.canvas-label {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #2c3e50;
}

.drawing-canvas {
  width: 100%;
  max-width: 100%;
  border: 2px solid #3498db;
  border-radius: 8px;
  background: white;
  cursor: crosshair;
  touch-action: none;
  display: block;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.hint-text {
  margin: 0.5rem 0 0 0;
  font-size: 0.85rem;
  color: #6c757d;
  font-style: italic;
}

@media (max-width: 768px) {
  .canvas-header {
    flex-direction: column;
    align-items: stretch;
  }

  .canvas-controls {
    justify-content: space-between;
  }

  .control-btn {
    flex: 1;
  }
  
  .drawing-section {
    max-height: 500px;
  }
  
  .drawing-canvas {
    height: 350px;
  }
}
</style>

