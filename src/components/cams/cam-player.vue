<template>
  <div class="cam-player">
    <div class="cam-order">
      {{ order }}
    </div>
    <video ref="videoEl" class="cam-video" autoplay muted playsinline />
    <div v-if="status !== 'playing'" class="cam-overlay">
      <span v-if="status === 'loading'" class="cam-loading" />
      <span v-else-if="status === 'error'" class="cam-error-icon">✕</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import mpegts from 'mpegts.js';

const props = defineProps<{
  order: number;
  rtsp: string;
}>();

const videoEl = ref<HTMLVideoElement>();
const status = ref<'idle' | 'loading' | 'playing' | 'error'>('idle');
let player: mpegts.Player | null = null;

function destroyPlayer() {
  if (player) {
    player.pause();
    player.unload();
    player.detachMediaElement();
    player.destroy();
    player = null;
  }
}

function createPlayer(rtspUrl: string) {
  if (!videoEl.value || !rtspUrl)
    return;
  if (!mpegts.isSupported())
    return;

  destroyPlayer();
  status.value = 'loading';

  const streamUrl = `http://localhost:3000/live?rtsp=${encodeURIComponent(rtspUrl)}`;

  player = mpegts.createPlayer(
    {
      type: 'flv',
      url: streamUrl,
      isLive: true,
      hasAudio: false,
      hasVideo: true,
    },
    {
      enableWorker: false,
      enableStashBuffer: true,
      stashInitialSize: 128,
      lazyLoad: false,
      autoCleanupSourceBuffer: true,
    },
  );

  player.attachMediaElement(videoEl.value);

  player.on(mpegts.Events.ERROR, () => {
    status.value = 'error';
    destroyPlayer();
  });

  player.on(mpegts.Events.MEDIA_INFO, () => {
    status.value = 'playing';
  });

  player.load();
  player.play();
}

watch(() => props.rtsp, (val) => {
  createPlayer(val);
});

onMounted(() => {
  if (props.rtsp)
    createPlayer(props.rtsp);
});

onBeforeUnmount(() => {
  destroyPlayer();
});
</script>

<style scoped lang="scss">
.cam-player {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
}

.cam-order {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #fff;
  background-color: #007bec;
}

.cam-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cam-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cam-loading {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.cam-error-icon {
  color: #f56c6c;
  font-size: 28px;
  font-weight: bold;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
