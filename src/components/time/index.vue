<template>
  <div class="time-container section-container">
    <div class="section-title">
      时间记录
    </div>
    <div class="section-content p-16px flex flex-col justify-between">
      <div class="flex gap-24px">
        <div class="w-172px">
          <div class="main-title">
            舱门开启时间
          </div>
          <div class="flex flex-col gap-8px">
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                前舱门
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                左舱门1
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                左舱门2
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                右舱门1
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                右舱门2
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
          </div>
        </div>
        <div class="w-172px">
          <div class="main-title">
            舱门关闭时间
          </div>
          <div class="flex flex-col gap-8px">
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                前舱门
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                左舱门1
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                左舱门2
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                右舱门1
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                右舱门2
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-24px">
        <div class="w-172px">
          <div class="main-title">
            起落架升起时间
          </div>
          <div class="flex flex-col gap-8px">
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                前起落架
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                左起落架
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                右起落架
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
          </div>
        </div>
        <div class="w-172px">
          <div class="main-title">
            起落架落下时间
          </div>
          <div class="flex flex-col gap-8px">
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                前起落架
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                左起落架
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
            <div class="flex w-full items-center justify-between">
              <div class="main-text w-56px">
                右起落架
              </div>
              <Progress :value="15" :max="60" class="w-70px" />
              <div class="value">
                15秒
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.time-container {
  height: 387px;
  width: 100%;
  background-image: url(@/assets/images/时间记录.png);
  background-size: cover;
  background-position: center;
}

.main-title {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  font-family: SHS;
  color: #fff;
  margin-bottom: 12px;
}

.value {
  font-family: SHS;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #fff;
}
</style>
