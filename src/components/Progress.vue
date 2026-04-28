<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{width: `${percentage}%`}" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: number;
  max: number;
}>();

const percentage = computed(() => {
  return Math.round((props.value / props.max) * 100);
});
</script>

<style scoped lang="scss">
.progress-container {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(90deg, #29ffd8 0%, #4ed0ff 100%);
}
</style>
