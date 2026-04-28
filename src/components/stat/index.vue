<template>
  <div class="stat-container section-container">
    <div class="section-title">
      测试总数
    </div>
    <div class="section-content px-16px py-12px flex gap-16px">
      <div class="stat-item">
        <div class="stat-name">
          测试计划总数
        </div>
        <div class="stat-value">
          24
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-name">
          测试计划当前数量
        </div>
        <div class="stat-value">
          24
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

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
