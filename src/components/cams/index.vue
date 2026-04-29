<template>
  <div class="cams-container section-container">
    <div class="section-title">
      监控画面
    </div>
    <div class="section-content px-16px flex items-center justify-between">
      <div v-for="(cam, index) in camUrls" :key="index" class="h-100px w-178px">
        <cam-player :order="index" :rtsp="cam" />
      </div>
    </div>
  </div>

  <popwindow
    v-if="popMode !== null"
    :mode="popMode"
    :cam-index="popCamIndex"
    :cam-urls="camUrls"
    @close="popMode = null"
  />
</template>

<script setup lang="ts">
import {useEventListener, useFetch} from '@vueuse/core';
import camPlayer from './cam-player.vue';
import popwindow from './popwindow.vue';

const {data} = useFetch('/config.json').json<{camUrls: string[]}>();
const camUrls = computed(() => data.value?.camUrls ?? []);

const popMode = ref<'single' | 'all' | null>(null);
const popCamIndex = ref(0);

useEventListener('keydown', (e: KeyboardEvent) => {
  // Ctrl+A → 全部模式
  if (e.key === '`' || e.key === '~') {
    e.preventDefault();
    popMode.value = 'all';
    return;
  }
  // 数字键 0-9 → 单路模式（无修饰键）
  if (!e.ctrlKey && !e.altKey && !e.metaKey && /^\d$/.test(e.key)) {
    popCamIndex.value = Number(e.key);
    popMode.value = 'single';
  }
});
</script>

<style scoped lang="scss">
.cams-container {
  height: 168px;
  width: 100%;
  background-image: url(@/assets/images/cams-bg.png);
  background-size: cover;
  background-position: center;
}
</style>
