<template>
  <Teleport to="body">
    <div class="pop-overlay" @click.self="emit('close')">
      <div class="pop-window" :class="mode">
        <div class="pop-title">
          监控
        </div>
        <button class="pop-close" @click="emit('close')">
          ×
        </button>

        <!-- 单路模式 -->
        <div v-if="mode === 'single'" class="single-content">
          <cam-player :order="camIndex" :rtsp="camUrls[camIndex] ?? ''" />
        </div>

        <!-- 全部模式 -->
        <div v-else class="all-content">
          <div v-for="(url, i) in camUrls" :key="i" class="all-cell">
            <cam-player :order="i" :rtsp="url" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {useEventListener} from '@vueuse/core';
import camPlayer from './cam-player.vue';

defineProps<{
  mode: 'single' | 'all';
  camIndex: number;
  camUrls: string[];
}>();

const emit = defineEmits<{
  close: [];
}>();

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape')
    emit('close');
});
</script>

<style scoped lang="scss">
.pop-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
}

.pop-window {
  position: relative;
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .pop-title {
    position: absolute;
    top: 6px;
    left: 20px;
    font-size: 16px;
    z-index: 10;
    font-family: ali-bold;
    font-weight: bold;
    @include textGradient(#dde9ff, #99bcff);
  }

  &.single {
    width: 1268px;
    height: 768px;
    background-image: url(@/assets/images/single-cam.png);

    .single-content {
      position: absolute;
      inset: 53px 22px 16px 22px;
    }
  }

  &.all {
    width: 1872px;
    height: 859px;
    background-image: url(@/assets/images/all-cam.png);

    .all-content {
      position: absolute;
      inset: 53px 22px 16px 22px;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 8px;
    }
  }
}

.pop-close {
  position: absolute;
  top: 6px;
  right: 12px;
  z-index: 10;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #a0c4e0;
  background: transparent;
  border: none;
  cursor: pointer;
  line-height: 1;

  &:hover {
    color: #fff;
  }
}
</style>
