<template>
  <div class="flex flex-1 flex-col justify-between">
    <div class="flex gap-12px">
      <AniItem v-for="item in front" :key="item.name" :title="item.name" :status="item.status" />
    </div>
    <div class="flex gap-12px">
      <AniItem v-for="item in left" :key="item.name" :title="item.name" :status="item.status" />
    </div>
    <div class="flex gap-12px">
      <AniItem v-for="item in right" :key="item.name" :title="item.name" :status="item.status" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AniItem from './AniItem.vue';

const front = shallowRef<Array<{name: string; status: 'pending' | 'success' | 'error'}>>([
  {name: '前舱门开', status: 'success'},
  {name: '前舱门关', status: 'pending'},
  {name: '前起落架升起', status: 'pending'},
  {name: '前起落架落下', status: 'pending'},
]);

const left = shallowRef<Array<{name: string; status: 'pending' | 'success' | 'error'}>>([
  {name: '左舱门开', status: 'success'},
  {name: '左舱门关', status: 'pending'},
  {name: '左起落架升起', status: 'pending'},
  {name: '左起落架落下', status: 'pending'},
]);

const right = shallowRef<Array<{name: string; status: 'pending' | 'success' | 'error'}>>([
  {name: '右舱门开', status: 'error'},
  {name: '右舱门关', status: 'pending'},
  {name: '右起落架升起', status: 'pending'},
  {name: '右起落架落下', status: 'pending'},
]);
</script>

<style scoped>

</style>
