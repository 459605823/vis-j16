<template>
  <div class="screen-container">
    <div class="flex flex-col h-full w-full justify-between">
      <div class="mb-16px flex flex-1 justify-between">
        <div class="flex flex-col h-full w-367px justify-between">
          <Pressure />
          <Strength />
        </div>
        <div class="flex flex-col gap-16px h-full w-1076px">
          <AniGrid />
          <Flow />
        </div>
        <div class="flex flex-col h-full w-400px justify-between">
          <Stat />
          <Time />
          <Source />
        </div>
      </div>
      <Cams />
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.screen-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url(@/assets/images/bg.png);
  background-size: cover;
  background-position: center;
  padding: 100px 24px 36px 24px;
}
</style>
