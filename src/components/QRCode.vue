<template>
  <div class="qrcode-wrapper">
    <div class="qrcode-box">
      <img v-if="url" :src="url" alt="签到二维码" class="qrcode-img" />
      <div v-else class="qrcode-placeholder">加载中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  url: string
}>()
</script>

<style scoped>
.qrcode-wrapper {
  display: inline-block;
}

.qrcode-box {
  width: 180px;
  height: 180px;
  background: white;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qrcode-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qrcode-placeholder {
  color: #999;
  font-size: 0.9rem;
}
</style>
