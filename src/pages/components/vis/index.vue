<template>
  <div ref="visRef" class="vis" />
</template>

<script setup lang="ts">
import Vis from './index';

const visRef = ref<HTMLElement | null>(null);

let vis: Vis | null = null;

onMounted(async () => {
  if (visRef.value) {
    vis = new Vis(visRef.value);
    await vis.init();
  }
});

onUnmounted(() => {
  vis?.dispose();
  vis = null;
});
</script>

<style scoped lang="scss">
.vis {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
