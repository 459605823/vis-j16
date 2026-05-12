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
          {{ formatValue(item.value) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {DATA_REFRESH_INTERVAL, readVariable} from '@/api/plc-auth';

const data = reactive([
  {name: '前/左/右后舱门放下', variable: 'DataR[24]', value: null as number | null},
  {name: '前/左舱门收上', variable: 'DataR[25]', value: null as number | null},
  {name: '右前舱门放下', variable: 'DataR[26]', value: null as number | null},
  {name: '右舱门收上', variable: 'DataR[27]', value: null as number | null},
  {name: '前起落架放下', variable: 'DataR[28]', value: null as number | null},
  {name: '前起落架收上', variable: 'DataR[29]', value: null as number | null},
  {name: '主起落架放下', variable: 'DataR[30]', value: null as number | null},
  {name: '主起落架收上', variable: 'DataR[31]', value: null as number | null},
]);

function formatValue(value: number | null) {
  if (value === null) {
    return '--L/min';
  }

  return `${value.toFixed(1)}L/min`;
}

async function fetchFlowData() {
  try {
    const values = await readVariable<number>(data.map(item => item.variable));
    values.forEach((value, index) => {
      const flow = Number(value);
      data[index].value = Number.isFinite(flow) ? flow : null;
    });
  } catch (error) {
    console.error('[Flow] 读取流量传感器数据失败:', error);
  }
}

fetchFlowData();
const timer = setInterval(fetchFlowData, DATA_REFRESH_INTERVAL);

onUnmounted(() => {
  clearInterval(timer);
});
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
  padding: 8px;

  .sensor-name {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 22px;
    font-family: SHS;
    white-space: nowrap;
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
