<template>
  <div class="prize-card" :class="{ active: isActive }" @click="$emit('click')">
    <div class="prize-level">{{ prize.level }}</div>
    <div class="prize-name">{{ prize.name }}</div>
    <div class="prize-remaining">
      剩余 <strong>{{ prize.remaining }}</strong> / {{ prize.quantity }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Prize } from '@/types'

defineProps<{
  prize: Prize
  isActive: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.prize-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px 28px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 160px;
  text-align: center;
}

.prize-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.prize-card.active {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.15);
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
}

.prize-level {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.prize-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
}

.prize-remaining {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.prize-remaining strong {
  color: #ff6b6b;
}
</style>
