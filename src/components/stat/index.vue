<template>
  <div class="stat-container section-container">
    <div class="section-title">
      测试总数
    </div>
    <div class="section-content px-16px py-12px flex gap-16px">
      <div v-for="item in data" :key="item.label" class="stat-item">
        <div class="stat-name">
          {{ item.label }}
        </div>
        <div class="stat-value">
          {{ formatValue(item.value) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {DATA_REFRESH_INTERVAL, pageReadyPromise, readVariable} from '@/api/plc-auth';

const data = reactive([
  {label: '测试计划总数', variable: 'DataI[0]', value: null as number | null},
  {label: '测试计划当前数量', variable: 'DataI[1]', value: null as number | null},
]);

function formatValue(value: number | null) {
  if (value === null) {
    return '--';
  }

  return Math.floor(value).toString();
}

async function fetchStatData() {
  try {
    const values = await readVariable<number>(data.map(item => item.variable));
    values.forEach((value, index) => {
      const count = Number(value);
      data[index].value = Number.isFinite(count) ? count : null;
    });
  } catch (error) {
    console.error('[Stat] 读取测试总数数据失败:', error);
  }
}

let _pollTimer: ReturnType<typeof setTimeout> | null = null;
let _pollAlive = true;

async function poll() {
  await fetchStatData();
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
.stat-container {
  height: 134px;
  width: 100%;
  background-image: url(@/assets/images/测试总数.png);
  background-size: cover;
  background-position: center;
}

.stat-item {
  width: 175px;
  height: 72px;
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
    font-size: 24px;
    color: #fff;
    line-height: 32px;
  }
}
</style>
