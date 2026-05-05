<template>
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
import {parsePlcData} from './plcParser';

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
    // 批量读取 DataW[0-3]
    const [dataW0, dataW1, dataW2, dataW3] = await readVariable<number>([
      'DataW[0]',
      'DataW[1]',
      'DataW[2]',
      'DataW[3]',
    ]);

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

</style>
