<template>
  <!-- eslint-disable vue/singleline-html-element-content-newline -->
  <!-- 调试面板 -->
  <div v-if="isDev" class="debug-panel">
    <div class="debug-title">
      📊 PLC 调试面板
      <span v-if="getMockDataFromUrl()" class="mock-badge">MOCK 模式</span>
    </div>

    <div class="debug-section">
      <div class="section-title">原始数据</div>
      <div v-for="(value, index) in rawPlcData" :key="index" class="data-row">
        <span class="label">DataW[{{ index }}]:</span>
        <span class="value">{{ value }}</span>
        <span class="binary">{{ formatBinary(value) }}</span>
      </div>
    </div>

    <div class="debug-section">
      <div class="section-title">解析后数据</div>

      <div class="bit-group">
        <div class="group-title">【DataW[0] - 动作进程】</div>
        <div class="bit-row">舱门开启动作中 (bit0): {{ getBit(rawPlcData[0], 0) ? 1 : 0 }}</div>
        <div class="bit-row">舱门关闭动作中 (bit1): {{ getBit(rawPlcData[0], 1) ? 1 : 0 }}</div>
        <div class="bit-row">起落架升起动作中 (bit2): {{ getBit(rawPlcData[0], 2) ? 1 : 0 }}</div>
        <div class="bit-row">起落架落下动作中 (bit3): {{ getBit(rawPlcData[0], 3) ? 1 : 0 }}</div>
      </div>

      <div class="bit-group">
        <div class="group-title">【DataW[1] - 前起落架到位】</div>
        <div class="bit-row">前舱门开启到位 (bit0): {{ getBit(rawPlcData[1], 0) ? 1 : 0 }}</div>
        <div class="bit-row">前舱门关闭到位 (bit1): {{ getBit(rawPlcData[1], 1) ? 1 : 0 }}</div>
        <div class="bit-row">前舱门锁定到位 (bit2): {{ getBit(rawPlcData[1], 2) ? 1 : 0 }}</div>
        <div class="bit-row">前起落架升起到位 (bit8): {{ getBit(rawPlcData[1], 8) ? 1 : 0 }}</div>
        <div class="bit-row">前起落架落下到位 (bit9): {{ getBit(rawPlcData[1], 9) ? 1 : 0 }}</div>
      </div>

      <div class="bit-group">
        <div class="group-title">【DataW[2] - 左起落架到位】</div>
        <div class="bit-row">左舱门1开启到位 (bit0): {{ getBit(rawPlcData[2], 0) ? 1 : 0 }}</div>
        <div class="bit-row">左舱门1关闭到位 (bit1): {{ getBit(rawPlcData[2], 1) ? 1 : 0 }}</div>
        <div class="bit-row">左舱门1锁定到位 (bit2): {{ getBit(rawPlcData[2], 2) ? 1 : 0 }}</div>
        <div class="bit-row">左舱门2开启到位 (bit3): {{ getBit(rawPlcData[2], 3) ? 1 : 0 }}</div>
        <div class="bit-row">左舱门2关闭到位 (bit4): {{ getBit(rawPlcData[2], 4) ? 1 : 0 }}</div>
        <div class="bit-row">左舱门2锁定到位 (bit5): {{ getBit(rawPlcData[2], 5) ? 1 : 0 }}</div>
        <div class="bit-row">左起落架升起到位 (bit8): {{ getBit(rawPlcData[2], 8) ? 1 : 0 }}</div>
        <div class="bit-row">左起落架落下到位 (bit9): {{ getBit(rawPlcData[2], 9) ? 1 : 0 }}</div>
      </div>

      <div class="bit-group">
        <div class="group-title">【DataW[3] - 右起落架到位】</div>
        <div class="bit-row">右舱门1开启到位 (bit0): {{ getBit(rawPlcData[3], 0) ? 1 : 0 }}</div>
        <div class="bit-row">右舱门1关闭到位 (bit1): {{ getBit(rawPlcData[3], 1) ? 1 : 0 }}</div>
        <div class="bit-row">右舱门1锁定到位 (bit2): {{ getBit(rawPlcData[3], 2) ? 1 : 0 }}</div>
        <div class="bit-row">右舱门2开启到位 (bit3): {{ getBit(rawPlcData[3], 3) ? 1 : 0 }}</div>
        <div class="bit-row">右舱门2关闭到位 (bit4): {{ getBit(rawPlcData[3], 4) ? 1 : 0 }}</div>
        <div class="bit-row">右舱门2锁定到位 (bit5): {{ getBit(rawPlcData[3], 5) ? 1 : 0 }}</div>
        <div class="bit-row">右起落架升起到位 (bit8): {{ getBit(rawPlcData[3], 8) ? 1 : 0 }}</div>
        <div class="bit-row">右起落架落下到位 (bit9): {{ getBit(rawPlcData[3], 9) ? 1 : 0 }}</div>
      </div>
    </div>

    <div v-if="!getMockDataFromUrl()" class="debug-section mock-tip">
      <div class="section-title">💡 Mock 数据测试</div>
      <div class="tip-content">
        在 URL 中添加参数可使用 Mock 数据：<br>
        <code>?dev=true&DataW0=5&DataW1=1&DataW2=9&DataW3=0</code>
      </div>
    </div>
  </div>

  <div class="flex flex-1 flex-col justify-between">
    <div class="flex gap-12px">
      <AniItem
        v-for="item in front"
        :key="item.name"
        :title="item.name"
        :status="item.status"
        :playing="item.playing"
      />
    </div>
    <div class="flex gap-12px">
      <AniItem
        v-for="item in left"
        :key="item.name"
        :title="item.name"
        :status="item.status"
        :playing="item.playing"
      />
    </div>
    <div class="flex gap-12px">
      <AniItem
        v-for="item in right"
        :key="item.name"
        :title="item.name"
        :status="item.status"
        :playing="item.playing"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {AnimationItem} from './plcParser';
import {DATA_REFRESH_INTERVAL, readVariable} from '@/api/plc-auth';
import AniItem from './AniItem.vue';
import {parsePlcData, getBit as plcGetBit} from './plcParser';

const isDev = window.location.search.includes('dev=true');

// 原始 PLC 数据（用于调试面板）
const rawPlcData = shallowRef<number[]>([0, 0, 0, 0]);

/**
 * 从 URL 查询参数获取 Mock 数据
 * @returns 如果存在 Mock 数据返回数组，否则返回 null
 */
function getMockDataFromUrl(): number[] | null {
  if (!isDev)
    return null;

  const params = new URLSearchParams(window.location.search);
  const dataW0 = params.get('DataW0');
  const dataW1 = params.get('DataW1');
  const dataW2 = params.get('DataW2');
  const dataW3 = params.get('DataW3');

  // 只要有一个参数存在就使用 Mock 模式
  if (dataW0 || dataW1 || dataW2 || dataW3) {
    return [
      dataW0 ? Number.parseInt(dataW0, 10) : 0,
      dataW1 ? Number.parseInt(dataW1, 10) : 0,
      dataW2 ? Number.parseInt(dataW2, 10) : 0,
      dataW3 ? Number.parseInt(dataW3, 10) : 0,
    ];
  }

  return null;
}

/**
 * 格式化二进制数据为 16 位，每 4 位空格分隔
 */
function formatBinary(num: number): string {
  const binary = (num >>> 0).toString(2).padStart(16, '0');
  return binary.match(/.{1,4}/g)?.join(' ') || binary;
}

/**
 * 提取指定位的值（用于模板）
 */
function getBit(word: number, bitIndex: number): boolean {
  return plcGetBit(word, bitIndex);
}

const front = shallowRef<AnimationItem[]>([
  {name: '前舱门开', status: 'pending', playing: false},
  {name: '前舱门关', status: 'pending', playing: false},
  {name: '前起落架升起', status: 'pending', playing: false},
  {name: '前起落架落下', status: 'pending', playing: false},
]);

const left = shallowRef<AnimationItem[]>([
  {name: '左舱门开', status: 'pending', playing: false},
  {name: '左舱门关', status: 'pending', playing: false},
  {name: '左起落架升起', status: 'pending', playing: false},
  {name: '左起落架落下', status: 'pending', playing: false},
]);

const right = shallowRef<AnimationItem[]>([
  {name: '右舱门开', status: 'pending', playing: false},
  {name: '右舱门关', status: 'pending', playing: false},
  {name: '右起落架升起', status: 'pending', playing: false},
  {name: '右起落架落下', status: 'pending', playing: false},
]);

/**
 * 从 PLC 读取数据并更新状态
 */
async function fetchPlcData() {
  try {
    let dataW0: number;
    let dataW1: number;
    let dataW2: number;
    let dataW3: number;

    // 检查是否使用 Mock 数据
    const mockData = getMockDataFromUrl();
    if (mockData) {
      // 使用 URL 参数中的 Mock 数据
      [dataW0, dataW1, dataW2, dataW3] = mockData;
      console.info('[AniGrid] 使用 Mock 数据:', {dataW0, dataW1, dataW2, dataW3});
    } else {
      // 从 PLC 读取真实数据
      [dataW0, dataW1, dataW2, dataW3] = await readVariable<number>([
        'DataW[0]',
        'DataW[1]',
        'DataW[2]',
        'DataW[3]',
      ]);
    }

    // 保存原始数据（用于调试面板）
    if (isDev) {
      rawPlcData.value = [dataW0, dataW1, dataW2, dataW3];
    }

    // 解析数据
    const parsed = parsePlcData({
      dataW0,
      dataW1,
      dataW2,
      dataW3,
    });

    // 更新状态
    front.value = parsed.front;
    left.value = parsed.left;
    right.value = parsed.right;
  } catch (error) {
    console.error('[AniGrid] 读取 PLC 数据失败:', error);
    // 发生错误时保持上一次状态，避免界面闪烁
  }
}

// 初始读取
fetchPlcData();

// 定时刷新
const timer = setInterval(fetchPlcData, DATA_REFRESH_INTERVAL);

// 组件卸载时清理定时器
onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.debug-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 420px;
  max-height: 80vh;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid #1a7fc6;
  border-radius: 4px;
  padding: 16px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  color: #fff;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.debug-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #1a7fc6;
  color: #4dabf7;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mock-badge {
  font-size: 10px;
  padding: 2px 8px;
  background: #fa5252;
  color: #fff;
  border-radius: 3px;
  font-weight: normal;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }
}

.debug-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 13px;
  font-weight: bold;
  color: #ffd43b;
  margin-bottom: 8px;
}

.data-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  line-height: 1.5;
}

.data-row .label {
  color: #74c0fc;
  min-width: 80px;
}

.data-row .value {
  color: #51cf66;
  min-width: 50px;
  text-align: right;
}

.data-row .binary {
  color: #ffa94d;
  font-family: 'Consolas', 'Monaco', monospace;
  letter-spacing: 1px;
}

.bit-group {
  margin-bottom: 12px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 3px;
}

.group-title {
  font-weight: bold;
  color: #91a7ff;
  margin-bottom: 6px;
  font-size: 12px;
}

.bit-row {
  padding: 2px 0;
  color: #c1c2c5;
  font-size: 11px;
  line-height: 1.6;
}

.mock-tip {
  border-top: 1px dashed #1a7fc6;
  padding-top: 12px;
}

.tip-content {
  font-size: 11px;
  line-height: 1.6;
  color: #a5d8ff;
  background: rgba(26, 127, 198, 0.1);
  padding: 8px;
  border-radius: 3px;
  border-left: 3px solid #4dabf7;
}

.tip-content code {
  display: block;
  margin-top: 6px;
  padding: 4px 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  color: #ffa94d;
  font-size: 10px;
  word-break: break-all;
}

.debug-panel::-webkit-scrollbar {
  width: 6px;
}

.debug-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.debug-panel::-webkit-scrollbar-thumb {
  background: rgba(26, 127, 198, 0.5);
  border-radius: 3px;
}

.debug-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(26, 127, 198, 0.8);
}
</style>
