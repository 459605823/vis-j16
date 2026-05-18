<template>
  <div class="source-container section-container">
    <div class="section-title">
      液压源
    </div>
    <div class="section-content px-12px py-16px">
      <div class="stat-grid">
        <div class="stat-item">
          <div class="stat-name">
            {{ data[0].label }}
          </div>
          <div class="stat-value">
            {{ formatPressure(data[0].value) }}
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-name">
            {{ data[1].label }}
          </div>
          <div class="stat-value">
            {{ formatPressure(data[1].value) }}
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-name">
            {{ data[2].label }}
          </div>
          <div class="stat-value">
            {{ formatPressure(data[2].value) }}
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-name">
            {{ data[3].label }}
          </div>
          <div class="stat-value">
            {{ formatFlow(data[3].value) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {DATA_REFRESH_INTERVAL, pageReadyPromise, readVariable} from '@/api/plc-auth';

const data = reactive([
  {label: '液压源设定压力', variable: 'DataR[64]', value: null as number | null},
  {label: '液压源实际压力', variable: 'DataR[65]', value: null as number | null},
  {label: '液压源回油压力', variable: 'DataR[66]', value: null as number | null},
  {label: '液压源流量', variable: 'DataR[67]', value: null as number | null},
]);

function formatPressure(value: number | null) {
  if (value === null) {
    return '--Mpa';
  }
  return `${value.toFixed(1)}Mpa`;
}

function formatFlow(value: number | null) {
  if (value === null) {
    return '--L/min';
  }
  return `${value.toFixed(1)}L/min`;
}

async function fetchSourceData() {
  try {
    const allVariables = data.map(item => item.variable);
    const values = await readVariable<number>(allVariables);

    data.forEach((item, index) => {
      const value = Number(values[index]);
      item.value = Number.isFinite(value) ? value : null;
    });
  } catch (error) {
    console.error('[Source] 读取液压源数据失败:', error);
  }
}

let _pollTimer: ReturnType<typeof setTimeout> | null = null;
let _pollAlive = true;

async function poll() {
  await fetchSourceData();
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
.source-container {
  height: 210px;
  width: 100%;
  background-image: url(@/assets/images/液压源.png);
  background-size: cover;
  background-position: center;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.stat-item {
  width: 100%;
  height: 66px;
  border-radius: 2px;
  border: 1px solid #2b4d91;
  background-color: #162c59;
  padding: 8px 16px;

  .stat-name {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 22px;
    font-family: SHS;
  }

  .stat-value {
    font-family: SHS;
    font-weight: 500;
    font-size: 16px;
    color: #fff;
    line-height: 24px;
  }
}
</style>
