<template>
  <div class="ani-item" :class="status">
    <div class="ani-item-title">
      {{ title }}
      <img :src="statusIcon" alt="status" class="h-24px w-24px right-4px top-2px absolute">
    </div>
    <video
      ref="videoRef"
      :src="videoSrc"
      muted
      class="h-full w-full object-cover"
      @loadedmetadata="onVideoLoaded"
    />
  </div>
</template>

<script setup lang="ts">
import pendingIcon from '@/assets/images/灰色.png';
import errorIcon from '@/assets/images/红色.png';
import successIcon from '@/assets/images/绿色.png';

const props = withDefaults(defineProps<{
  title: string;
  status?: 'pending' | 'success' | 'error';
  playing?: boolean;
}>(), {
  status: 'pending',
  playing: false,
});

const videoSrc = computed(() => `/videos/${props.title}.mp4`);
const videoRef = ref<HTMLVideoElement>();
const isVideoLoaded = ref(false);

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

// 视频加载完成
function onVideoLoaded() {
  isVideoLoaded.value = true;
}

// 监听 playing 状态变化，控制视频播放
watch(() => props.playing, (isPlaying) => {
  if (!videoRef.value || !isVideoLoaded.value) return;

  if (isPlaying) {
    // 开始播放
    videoRef.value.currentTime = 0; // 从头开始
    videoRef.value.play().catch(err => {
      console.warn(`[AniItem] 视频播放失败: ${props.title}`, err);
    });
  } else {
    // 停止播放
    videoRef.value.pause();
  }
}, { immediate: true });

// 当 status 为 success 时，确保视频显示最后一帧
watch(() => props.status, (status) => {
  if (status === 'success' && videoRef.value && isVideoLoaded.value) {
    videoRef.value.currentTime = videoRef.value.duration || 0;
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
