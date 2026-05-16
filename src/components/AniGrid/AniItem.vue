<template>
  <div class="ani-item" :class="[status, {playing}]">
    <div class="ani-item-title">
      {{ title }}
      <img :src="statusIcon" alt="status" class="h-24px w-24px right-4px top-2px absolute">
    </div>
    <video
      ref="videoRef"
      :src="videoSrc"
      muted
      loop
      preload="metadata"
      class="h-full w-full object-cover"
      @loadedmetadata="onVideoMetadataLoaded"
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

// metadata 加载完成后 seek 到第一帧（只触发极少量数据下载，不预下载整个视频）
function onVideoMetadataLoaded() {
  if (videoRef.value) {
    videoRef.value.currentTime = 0.001;
    isVideoLoaded.value = true;

    // 视频加载完成后，根据初始状态处理
    if (props.status === 'success') {
      // 如果初始就是成功状态，跳到最后一帧
      videoRef.value.currentTime = videoRef.value.duration || 0;
    } else if (props.playing) {
      // 如果 playing 为 true，立即开始播放
      videoRef.value.currentTime = 0;
      videoRef.value.play().catch((err) => {
        console.warn(`[AniItem] 视频播放失败: ${props.title}`, err);
      });
    }
  }
}

// 控制播放 —— 在 setup 作用域中创建，生命周期由组件管理
watch(() => props.playing, (isPlaying) => {
  if (!videoRef.value || !isVideoLoaded.value)
    return;

  if (isPlaying) {
    videoRef.value.currentTime = 0;
    videoRef.value.play().catch((err) => {
      console.warn(`[AniItem] 视频播放失败: ${props.title}`, err);
    });
  } else {
    videoRef.value.pause();
  }
}, {immediate: true}); // 添加 immediate 以处理初始状态

// status 变为 success 时跳到最后一帧
watch(() => props.status, (status) => {
  if (status === 'success' && videoRef.value && isVideoLoaded.value) {
    videoRef.value.currentTime = videoRef.value.duration || 0;
  }
}, {immediate: true}); // 添加 immediate 以处理初始状态为 success 的情况
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

  // 播放中状态：覆盖 pending 的 opacity
  &.playing {
    opacity: 1 !important;
  }

  // 成功状态：保持完全不透明
  &.success {
    opacity: 1;
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
