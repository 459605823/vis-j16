<template>
  <div class="ani-item" :class="status">
    <div class="ani-item-title">
      {{ title }}
      <img :src="statusIcon" alt="status" class="h-24px w-24px right-4px top-2px absolute">
    </div>
  </div>
</template>

<script setup lang="ts">
import pendingIcon from '@/assets/images/灰色.png';
import errorIcon from '@/assets/images/红色.png';
import successIcon from '@/assets/images/绿色.png';

const props = withDefaults(defineProps<{
  title: string;
  status?: 'pending' | 'success' | 'error';
}>(), {
  status: 'pending',
});

const statusIcon = computed(() => {
  switch (props.status) {
    case 'pending':
      return pendingIcon;
    case 'success':
      return successIcon;
    case 'error':
      return errorIcon;
    default:
      return pendingIcon;
  }
});
</script>

<style scoped lang="scss">
.ani-item {
  position: relative;
  width: 260px;
  height: 183px;
  border: 1px solid;
  border-image: linear-gradient(180deg, #1a7fc6, #0d3e60) 1;

  &.pending {
    opacity: 0.5;

    img {
      opacity: 1;
    }
  }

  &-title {
    position: absolute;
    top: 5px;
    left: 4px;
    width: 252px;
    height: 29px;
    display: flex;
    justify-content: center;
    background-image: url(@/assets/images/动画标题背景.png);
    background-size: cover;
    background-position: center;
    font-family: SHS;
    font-weight: 500;
    font-size: 16px;
    color: #fff;
    line-height: 29px;
  }
}
</style>
