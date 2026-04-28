<template>
  <div class="flow-container section-container">
    <div class="section-title">
      流量传感器
    </div>
    <div class="section-content px-16px py-12px flex gap-12px">
      <div v-for="item in data" :key="item.name" class="sensor-item">
        <div class="sensor-name">
          {{ item.name }}
        </div>
        <div class="sensor-value">
          {{ item.value }}L/min
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const data = shallowRef([
  {name: '传感器1', value: 88},
  {name: '传感器2', value: 88},
  {name: '传感器3', value: 88},
  {name: '传感器4', value: 88},
  {name: '传感器5', value: 88},
  {name: '传感器6', value: 88},
  {name: '传感器7', value: 88},
  {name: '传感器8', value: 88},
]);
</script>

<style scoped lang="scss">
.flow-container {
  height: 132px;
  width: 100%;
  background-image: url(@/assets/images/流量传感器.png);
  background-size: cover;
  background-position: center;
  margin-top: auto;
}

.sensor-item {
  width: 120px;
  height: 66px;
  border-radius: 2px;
  border: 1px solid #2b4d91;
  background-color: #162c59;
  padding: 8px 16px;

  .sensor-name {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 22px;
    font-family: SHS;
  }

  .sensor-value {
    font-size: 18px;
    font-family: SHS;
    font-weight: 500;
    line-height: 26px;
    color: #fff;
  }
}
</style>
