<template>
  <div class="pressure-container section-container">
    <div class="section-title">
      压力传感器
    </div>
    <div class="section-content px-18px py-12px flex flex-col gap-12px">
      <div v-for="group in groups" :key="group.name" class="flex items-center">
        <img :src="group.image" class="mr-24px h-60px w-60px">
        <div class="flex flex-1 flex-col gap-4px">
          <div
            v-for="sensor in group.sensors"
            :key="sensor.variable"
            class="flex w-full items-center justify-between"
          >
            <div class="main-text w-90px">
              {{ sensor.label }}
            </div>
            <Progress :value="getDisplayValue(sensor.value)" :max="PRESSURE_MAX" class="w-102px" />
            <div class="value">
              {{ formatValue(sensor.value) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {DATA_REFRESH_INTERVAL, pageReadyPromise, readVariable} from '@/api/plc-auth';
import frontImage from '@/assets/images/压力传感器 - 前.png';
import rightImage from '@/assets/images/压力传感器 - 右.png';
import leftImage from '@/assets/images/压力传感器 - 左.png';

const PRESSURE_MAX = 42;

const data = reactive([
  {label: '前舱门放下', variable: 'DataR[0]', value: null as number | null},
  {label: '前舱门收上', variable: 'DataR[1]', value: null as number | null},
  {label: '前起落架放下', variable: 'DataR[2]', value: null as number | null},
  {label: '前起落架收上', variable: 'DataR[3]', value: null as number | null},
  {label: '左前舱门放下', variable: 'DataR[4]', value: null as number | null},
  {label: '左前舱门收上', variable: 'DataR[5]', value: null as number | null},
  {label: '左后舱门放下', variable: 'DataR[6]', value: null as number | null},
  {label: '左后舱门收上', variable: 'DataR[7]', value: null as number | null},
  {label: '左起落架放下', variable: 'DataR[8]', value: null as number | null},
  {label: '左起落架收上', variable: 'DataR[9]', value: null as number | null},
  {label: '右前舱门放下', variable: 'DataR[10]', value: null as number | null},
  {label: '右前舱门收上', variable: 'DataR[11]', value: null as number | null},
  {label: '右后舱门放下', variable: 'DataR[12]', value: null as number | null},
  {label: '右后舱门收上', variable: 'DataR[13]', value: null as number | null},
  {label: '右起落架放下', variable: 'DataR[14]', value: null as number | null},
  {label: '右起落架收上', variable: 'DataR[15]', value: null as number | null},
]);

const groups = computed(() => [
  {name: 'front', image: frontImage, sensors: data.slice(0, 4)},
  {name: 'left', image: leftImage, sensors: data.slice(4, 10)},
  {name: 'right', image: rightImage, sensors: data.slice(10, 16)},
]);

function getDisplayValue(value: number | null) {
  return value === null ? 0 : value;
}

function formatValue(value: number | null) {
  if (value === null) {
    return '--Mpa';
  }

  return `${value.toFixed(1)}Mpa`;
}

async function fetchPressureData() {
  try {
    const values = await readVariable<number>(data.map(item => item.variable));
    values.forEach((value, index) => {
      const pressure = Number(value);
      data[index].value = Number.isFinite(pressure) ? pressure : null;
    });
  } catch (error) {
    console.error('[Pressure] 读取压力传感器数据失败:', error);
  }
}

let _pollTimer: ReturnType<typeof setTimeout> | null = null;
let _pollAlive = true;

async function poll() {
  await fetchPressureData();
  if (_pollAlive) {
    _pollTimer = setTimeout(poll, DATA_REFRESH_INTERVAL);
  }
}

pageReadyPromise.then(poll);

onUnmounted(() => {
  _pollAlive = false;
  if (_pollTimer !== null) {
    clearTimeout(_pollTimer);
    _pollTimer = null;
  }
});
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
