<template>
  <div class="pressure-container section-container">
    <div class="section-title">
      压力传感器
    </div>
    <div class="section-content px-18px py-12px flex flex-col gap-12px">
      <div class="flex items-center">
        <img src="@/assets/images/压力传感器 - 前.png" class="mr-24px h-60px w-60px">
        <div class="flex flex-1 flex-col gap-4px">
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              前舱门_1
            </div>
            <Progress :value="42" :max="100" class="w-102px" />
            <div class="value">
              42Mpa
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              前舱门_2
            </div>
            <Progress :value="32" :max="100" class="w-102px" />
            <div class="value">
              32Mpa
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              前起落架_1
            </div>
            <Progress :value="32" :max="100" class="w-102px" />
            <div class="value">
              32Mpa
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              前起落架_2
            </div>
            <Progress :value="32" :max="100" class="w-102px" />
            <div class="value">
              32Mpa
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <img src="@/assets/images/压力传感器 - 左.png" class="mr-24px h-60px w-60px">
        <div class="flex flex-1 flex-col gap-4px">
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              左舱门1_1
            </div>
            <Progress :value="42" :max="100" class="w-102px" />
            <div class="value">
              42Mpa
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              左舱门1_2
            </div>
            <Progress :value="32" :max="100" class="w-102px" />
            <div class="value">
              32Mpa
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              左舱门2_1
            </div>
            <Progress :value="32" :max="100" class="w-102px" />
            <div class="value">
              32Mpa
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              左舱门2_2
            </div>
            <Progress :value="32" :max="100" class="w-102px" />
            <div class="value">
              32Mpa
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              左起落架1
            </div>
            <Progress :value="32" :max="100" class="w-102px" />
            <div class="value">
              32Mpa
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              左起落架2
            </div>
            <Progress :value="32" :max="100" class="w-102px" />
            <div class="value">
              32Mpa
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <img src="@/assets/images/压力传感器 - 右.png" class="mr-24px h-60px w-60px">
        <div class="flex flex-1 flex-col gap-4px">
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              右舱门1_1
            </div>
            <Progress :value="42" :max="100" class="w-102px" />
            <div class="value">
              42Mpa
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              右舱门1_2
            </div>
            <Progress :value="32" :max="100" class="w-102px" />
            <div class="value">
              32Mpa
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              右舱门2_1
            </div>
            <Progress :value="32" :max="100" class="w-102px" />
            <div class="value">
              32Mpa
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              右舱门2_2
            </div>
            <Progress :value="32" :max="100" class="w-102px" />
            <div class="value">
              32Mpa
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              右起落架1
            </div>
            <Progress :value="32" :max="100" class="w-102px" />
            <div class="value">
              32Mpa
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <div class="main-text w-72px">
              右起落架2
            </div>
            <Progress :value="32" :max="100" class="w-102px" />
            <div class="value">
              32Mpa
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.pressure-container {
  height: 495px;
  width: 100%;
  background-image: url(@/assets/images/pressure-bg.png);
  background-size: cover;
  background-position: center;
}

.value {
  font-size: 14px;
  font-weight: 500;
  font-family: SHS;
  color: #fff;
}
</style>
