<template>
  <div class="cam-player">
    <div class="cam-order">
      {{ order }}
    </div>
    <video ref="videoEl" class="cam-video" autoplay muted playsinline @playing="handlePlaying" />
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
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let startupTimer: ReturnType<typeof setTimeout> | null = null;
let stallTimer: ReturnType<typeof setInterval> | null = null;
let playerGeneration = 0;
let unmounted = false;
let lastPlaybackTime = 0;
let stalledDuration = 0;
const RETRY_INTERVAL = 5000;
const STARTUP_TIMEOUT = 15000;
const STALL_CHECK_INTERVAL = 5000;
const STALL_TIMEOUT = 15000;

function clearRetryTimer() {
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
}

function clearHealthTimers() {
  if (startupTimer) {
    clearTimeout(startupTimer);
    startupTimer = null;
  }
  if (stallTimer) {
    clearInterval(stallTimer);
    stallTimer = null;
  }
}

function destroyPlayer() {
  clearHealthTimers();
  if (player) {
    player.pause();
    player.unload();
    player.detachMediaElement();
    player.destroy();
    player = null;
  }
}

function scheduleRetry(rtspUrl: string, generation: number) {
  if (unmounted || generation !== playerGeneration || rtspUrl !== props.rtsp)
    return;

  playerGeneration++;
  status.value = 'error';
  destroyPlayer();
  clearRetryTimer();

  retryTimer = setTimeout(() => {
    retryTimer = null;
    if (!unmounted && rtspUrl === props.rtsp)
      createPlayer(rtspUrl);
  }, RETRY_INTERVAL);
}

function startStallDetection(rtspUrl: string, generation: number) {
  if (!videoEl.value)
    return;

  if (stallTimer)
    clearInterval(stallTimer);

  lastPlaybackTime = videoEl.value.currentTime;
  stalledDuration = 0;
  stallTimer = setInterval(() => {
    if (!videoEl.value || generation !== playerGeneration)
      return;

    const currentTime = videoEl.value.currentTime;
    if (currentTime > lastPlaybackTime) {
      lastPlaybackTime = currentTime;
      stalledDuration = 0;
      return;
    }

    stalledDuration += STALL_CHECK_INTERVAL;
    if (stalledDuration >= STALL_TIMEOUT)
      scheduleRetry(rtspUrl, generation);
  }, STALL_CHECK_INTERVAL);
}

function handlePlaying() {
  if (!player || !videoEl.value)
    return;

  status.value = 'playing';
  if (startupTimer) {
    clearTimeout(startupTimer);
    startupTimer = null;
  }
  startStallDetection(props.rtsp, playerGeneration);
}

function createPlayer(rtspUrl: string) {
  if (!videoEl.value || !rtspUrl)
    return;
  if (!mpegts.isSupported()) {
    status.value = 'error';
    return;
  }

  clearRetryTimer();
  const generation = ++playerGeneration;
  destroyPlayer();
  status.value = 'loading';

  const streamUrl = `ws://localhost:3000/live?rtsp=${encodeURIComponent(rtspUrl)}`;

  try {
    const nextPlayer = mpegts.createPlayer(
      {
        type: 'flv',
        url: streamUrl,
        isLive: true,
        hasAudio: false,
        hasVideo: true,
      },
      {
        enableWorker: false,
        enableStashBuffer: false,
        lazyLoad: false,
        autoCleanupSourceBuffer: true,
        liveBufferLatencyChasing: true,
        liveBufferLatencyMaxLatency: 2.0,
        liveBufferLatencyMinRemain: 0.5,
      },
    );

    player = nextPlayer;
    nextPlayer.attachMediaElement(videoEl.value);
    nextPlayer.on(mpegts.Events.ERROR, () => scheduleRetry(rtspUrl, generation));

    startupTimer = setTimeout(() => {
      scheduleRetry(rtspUrl, generation);
    }, STARTUP_TIMEOUT);

    nextPlayer.load();
    Promise.resolve(nextPlayer.play()).catch(() => scheduleRetry(rtspUrl, generation));
  } catch {
    scheduleRetry(rtspUrl, generation);
  }
}

watch(() => props.rtsp, (val) => {
  clearRetryTimer();
  createPlayer(val);
});

onMounted(() => {
  if (props.rtsp)
    createPlayer(props.rtsp);
});

onBeforeUnmount(() => {
  unmounted = true;
  playerGeneration++;
  clearRetryTimer();
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
