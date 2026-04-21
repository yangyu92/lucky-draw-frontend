<template>
  <div class="lottery-wheel" :class="{ drawing: isDrawing }">
    <div class="wheel-display">
      <div class="name-display">
        <transition name="fade" mode="out-in">
          <span :key="displayName" class="display-name">{{ displayName }}</span>
        </transition>
      </div>
    </div>
    <button
      class="draw-btn"
      :disabled="isDrawing || candidates.length === 0"
      @click="$emit('start')"
    >
      {{ isDrawing ? '抽奖中...' : '开始抽奖' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import type { Participant } from '@/types'

const props = defineProps<{
  isDrawing: boolean
  candidates: Participant[]
}>()

defineEmits<{
  start: []
  end: [winner: any]
}>()

const displayName = ref('等待抽奖')
let timer: ReturnType<typeof setInterval> | null = null

watch(() => props.isDrawing, (drawing) => {
  if (drawing && props.candidates.length > 0) {
    timer = setInterval(() => {
      const idx = Math.floor(Math.random() * props.candidates.length)
      displayName.value = props.candidates[idx].name
    }, 80)
  } else if (!drawing && timer) {
    clearInterval(timer)
    timer = null
  }
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.lottery-wheel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.wheel-display {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,107,107,0.2) 0%, rgba(255,107,107,0.05) 70%);
  border: 4px solid rgba(255, 107, 107, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.drawing .wheel-display {
  animation: pulse 0.5s ease-in-out infinite;
  border-color: #ff6b6b;
  box-shadow: 0 0 40px rgba(255, 107, 107, 0.4);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

.name-display {
  text-align: center;
}

.display-name {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.draw-btn {
  padding: 16px 48px;
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
}

.draw-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 30px rgba(255, 107, 107, 0.6);
}

.draw-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
