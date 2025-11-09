<template>
  <span :class="['bloom-badge', level.toLowerCase()]">
    {{ level }}
  </span>
</template>

<script setup>
defineProps({
  level: {
    type: String,
    required: true,
    validator: (value) => {
      return ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'].includes(value);
    }
  }
});
</script>

<style scoped>
.bloom-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.bloom-badge.remember { background-color: var(--bloom-remember); }
.bloom-badge.understand { background-color: var(--bloom-understand); }
.bloom-badge.apply { background-color: var(--bloom-apply); }
.bloom-badge.analyze { background-color: var(--bloom-analyze); }
.bloom-badge.evaluate { background-color: var(--bloom-evaluate); }
.bloom-badge.create { background-color: var(--bloom-create); }
</style>
