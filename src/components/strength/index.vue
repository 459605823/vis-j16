<template>
  <div class="strength-container section-container">
    <div class="section-title">
      力传感器
    </div>
    <div class="section-content px-12px py-16px">
      <div class="mb-36px flex">
        <div class="mr-16px w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              前舱门
            </div>
            <div class="value">
              0.5T
            </div>
          </div>
          <Progress :value="80" :max="100" />
        </div>
        <div class="mr-16px w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              前起落架
            </div>
            <div class="value">
              0.5T
            </div>
          </div>
          <Progress :value="80" :max="100" />
        </div>
      </div>
      <div class="mb-36px flex">
        <div class="mr-16px w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              左舱门1
            </div>
            <div class="value">
              0.5T
            </div>
          </div>
          <Progress :value="80" :max="100" />
        </div>
        <div class="mr-16px w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              左舱门2
            </div>
            <div class="value">
              0.5T
            </div>
          </div>
          <Progress :value="80" :max="100" />
        </div>
        <div class="w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              左起落架
            </div>
            <div class="value">
              0.5T
            </div>
          </div>
          <Progress :value="80" :max="100" />
        </div>
      </div>
      <div class="flex">
        <div class="mr-16px w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              右舱门1
            </div>
            <div class="value">
              0.5T
            </div>
          </div>
          <Progress :value="80" :max="100" />
        </div>
        <div class="mr-16px w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              右舱门2
            </div>
            <div class="value">
              0.5T
            </div>
          </div>
          <Progress :value="80" :max="100" />
        </div>
        <div class="w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              右起落架
            </div>
            <div class="value">
              0.5T
            </div>
          </div>
          <Progress :value="80" :max="100" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.strength-container {
  height: 245px;
  width: 100%;
  background-image: url(@/assets/images/力传感器.png);
  background-size: cover;
  background-position: center;
}

.value {
  font-family: SHS;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #fff;
}
</style>
