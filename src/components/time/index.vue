<template>
  <div class="time-container section-container">
    <div class="section-title">
      时间记录
    </div>
    <div class="section-content p-16px flex flex-col justify-between">
      <div class="flex gap-24px">
        <div class="w-172px">
          <div class="main-title">
            舱门开启时间
          </div>
          <div class="flex flex-col gap-8px">
            <div
              v-for="item in data_open"
              :key="item.label"
              class="flex w-full items-center justify-between"
            >
              <div class="main-text w-56px">
                {{ item.label }}
              </div>
              <Progress :value="getDisplayValue(item.value)" :max="TIME_MAX" class="w-70px" />
              <div class="value">
                {{ formatValue(item.value) }}
              </div>
            </div>
          </div>
        </div>
        <div class="w-172px">
          <div class="main-title">
            舱门关闭时间
          </div>
          <div class="flex flex-col gap-8px">
            <div
              v-for="item in data_close"
              :key="item.label"
              class="flex w-full items-center justify-between"
            >
              <div class="main-text w-56px">
                {{ item.label }}
              </div>
              <Progress :value="getDisplayValue(item.value)" :max="TIME_MAX" class="w-70px" />
              <div class="value">
                {{ formatValue(item.value) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-24px">
        <div class="w-172px">
          <div class="main-title">
            起落架升起时间
          </div>
          <div class="flex flex-col gap-8px">
            <div
              v-for="item in data_gear_up"
              :key="item.label"
              class="flex w-full items-center justify-between"
            >
              <div class="main-text w-56px">
                {{ item.label }}
              </div>
              <Progress :value="getDisplayValue(item.value)" :max="TIME_MAX" class="w-70px" />
              <div class="value">
                {{ formatValue(item.value) }}
              </div>
            </div>
          </div>
        </div>
        <div class="w-172px">
          <div class="main-title">
            起落架落下时间
          </div>
          <div class="flex flex-col gap-8px">
            <div
              v-for="item in data_gear_down"
              :key="item.label"
              class="flex w-full items-center justify-between"
            >
              <div class="main-text w-56px">
                {{ item.label }}
              </div>
              <Progress :value="getDisplayValue(item.value)" :max="TIME_MAX" class="w-70px" />
              <div class="value">
                {{ formatValue(item.value) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {DATA_REFRESH_INTERVAL, readVariable} from '@/api/plc-auth';

const TIME_MAX = 60;

// 舱门开启时间
const data_open = reactive([
  {label: '前舱门', variable: 'DataR[40]', value: null as number | null},
  {label: '左前舱门', variable: 'DataR[41]', value: null as number | null},
  {label: '左后舱门', variable: 'DataR[42]', value: null as number | null},
  {label: '右前舱门', variable: 'DataR[43]', value: null as number | null},
  {label: '右后舱门', variable: 'DataR[44]', value: null as number | null},
]);
// 舱门关闭时间
const data_close = reactive([
  {label: '前舱门', variable: 'DataR[48]', value: null as number | null},
  {label: '左前舱门', variable: 'DataR[49]', value: null as number | null},
  {label: '左后舱门', variable: 'DataR[50]', value: null as number | null},
  {label: '右前舱门', variable: 'DataR[51]', value: null as number | null},
  {label: '右后舱门', variable: 'DataR[52]', value: null as number | null},
]);
// 起落架升起时间
const data_gear_up = reactive([
  {label: '前起落架', variable: 'DataR[56]', value: null as number | null},
  {label: '左起落架', variable: 'DataR[57]', value: null as number | null},
  {label: '右起落架', variable: 'DataR[58]', value: null as number | null},
]);
// 起落架落下时间
const data_gear_down = reactive([
  {label: '前起落架', variable: 'DataR[60]', value: null as number | null},
  {label: '左起落架', variable: 'DataR[61]', value: null as number | null},
  {label: '右起落架', variable: 'DataR[62]', value: null as number | null},
]);

function getDisplayValue(value: number | null) {
  return value === null ? 0 : value;
}

function formatValue(value: number | null) {
  if (value === null) {
    return '--秒';
  }

  return `${value.toFixed(1)}秒`;
}

async function fetchTimeData() {
  try {
    const allVariables = [
      ...data_open.map(item => item.variable),
      ...data_close.map(item => item.variable),
      ...data_gear_up.map(item => item.variable),
      ...data_gear_down.map(item => item.variable),
    ];

    const values = await readVariable<number>(allVariables);

    let index = 0;
    // 更新舱门开启时间
    data_open.forEach((item) => {
      const time = Number(values[index++]);
      item.value = Number.isFinite(time) ? time : null;
    });
    // 更新舱门关闭时间
    data_close.forEach((item) => {
      const time = Number(values[index++]);
      item.value = Number.isFinite(time) ? time : null;
    });
    // 更新起落架升起时间
    data_gear_up.forEach((item) => {
      const time = Number(values[index++]);
      item.value = Number.isFinite(time) ? time : null;
    });
    // 更新起落架落下时间
    data_gear_down.forEach((item) => {
      const time = Number(values[index++]);
      item.value = Number.isFinite(time) ? time : null;
    });
  } catch (error) {
    console.error('[Time] 读取时间记录数据失败:', error);
  }
}

fetchTimeData();
const timer = setInterval(fetchTimeData, DATA_REFRESH_INTERVAL);

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped lang="scss">
.time-container {
  height: 387px;
  width: 100%;
  background-image: url(@/assets/images/时间记录.png);
  background-size: cover;
  background-position: center;
}

.main-title {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  font-family: SHS;
  color: #fff;
  margin-bottom: 12px;
}

.value {
  font-family: SHS;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #fff;
}
</style>
