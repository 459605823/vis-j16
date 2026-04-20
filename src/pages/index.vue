<template>
  <div class="h-full w-full relative">
    <Vis />

    <!-- 压力传感器测试面板 -->
    <div class="sensor-panel">
      <div class="panel-title">
        压力传感器 · 实时数据
      </div>
      <div class="sensor-list">
        <div
          v-for="(sensor, i) in sensors"
          :key="i"
          class="sensor-item"
          :class="{'is-loading': loading}"
        >
          <div class="sensor-name">
            {{ sensor.label }}
          </div>
          <div class="sensor-value-row">
            <span class="sensor-value">
              {{ sensor.value !== null ? sensor.value.toFixed(3) : '—' }}
            </span>
            <span class="sensor-unit">kPa</span>
          </div>
          <div class="sensor-var">
            {{ sensor.variable }}
          </div>
        </div>
      </div>
      <div v-if="errorMsg" class="error-msg">
        {{ errorMsg }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {readVariable} from '@/api';
import Vis from './components/vis/index.vue';

const sensors = reactive([
  {label: '压力传感器_前舱门_1', variable: 'DataR[0]', value: null as number | null},
  {label: '压力传感器_前舱门_2', variable: 'DataR[1]', value: null as number | null},
  {label: '压力传感器_前起落架1', variable: 'DataR[2]', value: null as number | null},
]);

const loading = ref(false);
const errorMsg = ref('');

async function fetchAll() {
  loading.value = true;
  errorMsg.value = '';
  try {
    const values = await readVariable<number>(sensors.map(s => s.variable));
    values.forEach((v, i) => {sensors[i].value = v;});
  } catch (e: any) {
    errorMsg.value = e?.message ?? '读取失败';
  } finally {
    loading.value = false;
  }
}

fetchAll();
const timer = setInterval(fetchAll, 2000);
onUnmounted(() => clearInterval(timer));
</script>

<style scoped lang="scss">
.sensor-panel {
  position: absolute;
  top: 24px;
  left: 24px;
  width: 260px;
  background: rgba(8, 16, 28, 0.82);
  border: 1px solid rgba(0, 200, 255, 0.18);
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(12px);
  box-shadow:
    0 0 24px rgba(0, 200, 255, 0.06),
    0 4px 20px rgba(0, 0, 0, 0.6);
}

.panel-title {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: rgba(0, 200, 255, 0.7);
  text-transform: uppercase;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(0, 200, 255, 0.12);
  padding-bottom: 10px;
}

.sensor-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sensor-item {
  background: rgba(0, 200, 255, 0.04);
  border: 1px solid rgba(0, 200, 255, 0.1);
  border-radius: 6px;
  padding: 10px 12px;
  transition: opacity 0.2s;

  &.is-loading {
    opacity: 0.6;
  }
}

.sensor-name {
  font-size: 11px;
  color: rgba(200, 220, 240, 0.7);
  margin-bottom: 4px;
  letter-spacing: 0.02em;
}

.sensor-value-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.sensor-value {
  font-family: 'DINAlternate-Bold', monospace;
  font-size: 26px;
  font-weight: bold;
  color: #00e5ff;
  line-height: 1;
  letter-spacing: 0.02em;
}

.sensor-unit {
  font-size: 11px;
  color: rgba(0, 200, 255, 0.5);
  letter-spacing: 0.06em;
}

.sensor-var {
  font-size: 10px;
  color: rgba(120, 160, 180, 0.45);
  margin-top: 4px;
  font-family: monospace;
}

.error-msg {
  margin-top: 10px;
  font-size: 11px;
  color: #ff5555;
  text-align: center;
}
</style>
