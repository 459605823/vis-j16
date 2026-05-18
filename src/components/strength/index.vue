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
              {{ data[0].label }}
            </div>
            <div class="value">
              {{ formatValue(data[0].value) }}
            </div>
          </div>
          <Progress :value="getDisplayValue(data[0].value)" :max="data[0].max" />
        </div>
        <div class="mr-16px w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              {{ data[1].label }}
            </div>
            <div class="value">
              {{ formatValue(data[1].value) }}
            </div>
          </div>
          <Progress :value="getDisplayValue(data[1].value)" :max="data[1].max" />
        </div>
      </div>
      <div class="mb-36px flex">
        <div class="mr-16px w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              {{ data[2].label }}
            </div>
            <div class="value">
              {{ formatValue(data[2].value) }}
            </div>
          </div>
          <Progress :value="getDisplayValue(data[2].value)" :max="data[2].max" />
        </div>
        <div class="mr-16px w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              {{ data[3].label }}
            </div>
            <div class="value">
              {{ formatValue(data[3].value) }}
            </div>
          </div>
          <Progress :value="getDisplayValue(data[3].value)" :max="data[3].max" />
        </div>
        <div class="w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              {{ data[4].label }}
            </div>
            <div class="value">
              {{ formatValue(data[4].value) }}
            </div>
          </div>
          <Progress :value="getDisplayValue(data[4].value)" :max="data[4].max" />
        </div>
      </div>
      <div class="flex">
        <div class="mr-16px w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              {{ data[5].label }}
            </div>
            <div class="value">
              {{ formatValue(data[5].value) }}
            </div>
          </div>
          <Progress :value="getDisplayValue(data[5].value)" :max="data[5].max" />
        </div>
        <div class="mr-16px w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              {{ data[6].label }}
            </div>
            <div class="value">
              {{ formatValue(data[6].value) }}
            </div>
          </div>
          <Progress :value="getDisplayValue(data[6].value)" :max="data[6].max" />
        </div>
        <div class="w-102px">
          <div class="flex justify-between">
            <div class="main-text">
              {{ data[7].label }}
            </div>
            <div class="value">
              {{ formatValue(data[7].value) }}
            </div>
          </div>
          <Progress :value="getDisplayValue(data[7].value)" :max="data[7].max" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {DATA_REFRESH_INTERVAL, pageReadyPromise, readVariable} from '@/api/plc-auth';

const data = reactive([
  {label: '前舱门', variable: 'DataR[16]', value: null as number | null, max: 10},
  {label: '前起落架', variable: 'DataR[17]', value: null as number | null, max: 100},
  {label: '左前舱门', variable: 'DataR[18]', value: null as number | null, max: 10},
  {label: '左后舱门', variable: 'DataR[19]', value: null as number | null, max: 10},
  {label: '左起落架', variable: 'DataR[20]', value: null as number | null, max: 100},
  {label: '右前舱门', variable: 'DataR[21]', value: null as number | null, max: 10},
  {label: '右后舱门', variable: 'DataR[22]', value: null as number | null, max: 10},
  {label: '右起落架', variable: 'DataR[23]', value: null as number | null, max: 100},
]);

function getDisplayValue(value: number | null) {
  return value === null ? 0 : value;
}

function formatValue(value: number | null) {
  if (value === null) {
    return '--KN';
  }

  return `${value.toFixed(1)}KN`;
}

async function fetchStrengthData() {
  try {
    const values = await readVariable<number>(data.map(item => item.variable));
    values.forEach((value, index) => {
      const strength = Number(value);
      data[index].value = Number.isFinite(strength) ? strength : null;
    });
  } catch (error) {
    console.error('[Strength] 读取力传感器数据失败:', error);
  }
}

let _pollTimer: ReturnType<typeof setTimeout> | null = null;
let _pollAlive = true;

async function poll() {
  await fetchStrengthData();
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
