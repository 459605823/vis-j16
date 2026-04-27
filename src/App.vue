<template>
  <RouterView />
</template>

<script setup lang="ts">
import autofit from 'autofit.js';

onMounted(() => {
  autofit.init({
    dw: 1920,
    dh: 1080,
    resize: true,
  });
});
</script>

<style scoped lang="scss"></style>
