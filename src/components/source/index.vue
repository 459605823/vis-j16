<template>
  <div class="source-container section-container">
    <div class="section-title">
      液压源
    </div>
    <div class="section-content px-12px py-16px flex">
      <div class="flex flex-col h-full justify-between">
        <div class="stat-item">
          <div class="stat-name">
            液压源回游压力
          </div>
          <div class="stat-value">
            1Mpa
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-name">
            液压源流量
          </div>
          <div class="stat-value">
            88L/min
          </div>
        </div>
      </div>
      <div ref="chartBox" class="flex-1 h-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import EchartsControl from '@/composables/EchartsControl';

const chartData = shallowRef([
  {name: '设定压力', value: 27},
  {name: '实际压力', value: 19},
]);

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
