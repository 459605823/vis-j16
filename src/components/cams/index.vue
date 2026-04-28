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
</template>

<script setup lang="ts">
import camPlayer from './cam-player.vue';

const camUrls = [
  'rtsp://admin:admin123@',
  'rtsp://admin:admin123@',
  'rtsp://admin:admin123@',
  'rtsp://admin:admin123@',
  'rtsp://admin:admin123@',
  'rtsp://admin:admin123@',
  'rtsp://admin:admin123@',
  'rtsp://admin:admin123@',
  'rtsp://admin:admin123@',
  'rtsp://admin:admin123@',
];
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
