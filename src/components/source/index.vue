<template>
  <div class="source-container section-container">
    <div class="section-title">
      液压源
    </div>
    <div class="section-content px-12px py-16px flex">
      <div class="flex flex-col h-full justify-between">
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
            {{ formatFlow(data[1].value) }}
          </div>
        </div>
      </div>
      <div ref="chartBox" class="flex-1 h-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import {DATA_REFRESH_INTERVAL, readVariable} from '@/api/plc-auth';
import EchartsControl from '@/composables/EchartsControl';

const data = reactive([
  {label: '液压源回游压力', variable: 'DataR[66]', value: null as number | null},
  {label: '液压源流量', variable: 'DataR[67]', value: null as number | null},
]);

const chartData = reactive([
  {name: '设定压力', value: null as number | null, variable: 'DataR[64]'},
  {name: '实际压力', value: null as number | null, variable: 'DataR[65]'},
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

const {chartBox} = EchartsControl(() => ({
  legend: {show: false},
  grid: {top: 16, bottom: 24, left: 32, right: 8},
  xAxis: {
    type: 'category',
    data: chartData.value.map(item => item.name),
    axisLabel: {color: 'rgba(255,255,255,0.65)', fontSize: 12, fontFamily: 'SHS'},
    axisLine: {lineStyle: {color: 'rgba(255,255,255,0.15)'}},
    axisTick: {show: false},
  },
  yAxis: {
    type: 'value',
    axisLabel: {color: 'rgba(255,255,255,0.65)', fontSize: 12},
    splitLine: {lineStyle: {color: 'rgba(255,255,255,0.1)'}},
  },
  series: [
    {
      type: 'bar',
      data: chartData.value.map(item => item.value),
      barWidth: 8,
      label: {
        show: true,
        position: 'top',
        color: '#fff',
        fontSize: 14,
        fontFamily: 'SHS',
        formatter: '{c}Mpa',
      },
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {offset: 0, color: '#4ED0FF'},
          {offset: 1, color: '#29FFD8'},
        ]),
        borderRadius: [4, 4, 0, 0],
      },
    },
  ],
}));

async function fetchSourceData() {
  try {
    const allVariables = [
      ...chartData.map(item => item.variable),
      ...data.map(item => item.variable),
    ];

    const values = await readVariable<number>(allVariables);

    // 更新图表数据
    chartData.forEach((item, index) => {
      const pressure = Number(values[index]);
      item.value = Number.isFinite(pressure) ? pressure : null;
    });

    // 更新统计数据
    data.forEach((item, index) => {
      const value = Number(values[chartData.length + index]);
      item.value = Number.isFinite(value) ? value : null;
    });
  } catch (error) {
    console.error('[Source] 读取液压源数据失败:', error);
  }
}

fetchSourceData();
const timer = setInterval(fetchSourceData, DATA_REFRESH_INTERVAL);

onUnmounted(() => {
  clearInterval(timer);
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

.stat-item {
  width: 142px;
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
