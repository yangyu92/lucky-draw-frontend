<template>
  <div class="home">
    <!-- 背景装饰 -->
    <div class="bg-effects">
      <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
    </div>

    <!-- 主标题 -->
    <div class="hero">
      <h1 class="title">{{ title }}</h1>
      <p class="subtitle">{{ subtitle }}</p>
    </div>

    <!-- 抽奖转盘 -->
    <div class="lottery-container">
      <LotteryWheel 
        ref="lotteryRef"
        :isDrawing="isDrawing"
        :candidates="candidates"
        @start="startLottery"
        @end="handleLotteryEnd"
      />
    </div>

    <!-- 奖品信息 -->
    <div class="prize-section">
      <h2 class="section-title">当前奖项</h2>
      <div class="prize-cards">
        <PrizeCard 
          v-for="prize in availablePrizes" 
          :key="prize.id"
          :prize="prize"
          :isActive="currentPrize?.id === prize.id"
          @click="selectPrize(prize)"
        />
      </div>
    </div>

    <!-- 中奖名单展示 -->
    <div class="winners-section" v-if="recentWinners.length > 0">
      <h2 class="section-title">恭喜中奖</h2>
      <div class="winners-list">
        <div 
          class="winner-item" 
          v-for="winner in recentWinners" 
          :key="winner.id"
        >
          <div class="winner-avatar">{{ winner.participantName[0] }}</div>
          <div class="winner-info">
            <div class="winner-name">{{ winner.participantName }}</div>
            <div class="winner-prize">{{ winner.prizeName }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 扫码签到 -->
    <div class="qrcode-section" v-if="showQRCode">
      <QRCode :url="qrCodeUrl" />
      <p class="qr-hint">扫码签到参与抽奖</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLotteryStore } from '@/stores/lottery'
import type { Prize, Participant, Winner } from '@/types'

const lotteryStore = useLotteryStore()

const title = ref('🎉 年会抽奖 🎉')
const subtitle = ref('好运降临 · 惊喜不断')
const isDrawing = ref(false)
const showQRCode = ref(true)
const qrCodeUrl = ref('')
const lotteryRef = ref<InstanceType<typeof LotteryWheel> | null>(null)

// 动态导入组件以支持TypeScript
import LotteryWheel from '@/components/LotteryWheel.vue'
import PrizeCard from '@/components/PrizeCard.vue'
import QRCode from '@/components/QRCode.vue'

const candidates = computed<Participant[]>(() => lotteryStore.pendingParticipants)
const availablePrizes = computed<Prize[]>(() => lotteryStore.availablePrizes)
const currentPrize = computed<Prize | null>(() => lotteryStore.currentPrize)
const recentWinners = computed<Winner[]>(() => lotteryStore.recentWinners)

const getParticleStyle = (_i: number): Record<string, string> => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${5 + Math.random() * 5}s`
  }
}

const selectPrize = (prize: Prize) => {
  lotteryStore.setCurrentPrize(prize)
}

const startLottery = async () => {
  if (!currentPrize.value) {
    alert('请先选择要抽取的奖项')
    return
  }
  if (candidates.value.length === 0) {
    alert('没有可抽取的参与者')
    return
  }
  
  isDrawing.value = true
  await lotteryStore.startDraw(currentPrize.value.quantity)
}

const handleLotteryEnd = async (winner: Winner) => {
  isDrawing.value = false
  if (currentPrize.value) {
    await lotteryStore.confirmWinner(winner.participantId, currentPrize.value.id)
  }
}

onMounted(async () => {
  await lotteryStore.init()
  qrCodeUrl.value = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/wechat/qrcode`
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 40px 20px;
  position: relative;
  overflow-x: hidden;
}

.bg-effects {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: float 10s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-100px) rotate(180deg); opacity: 0.8; }
}

.hero {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 4rem;
  color: #fff;
  text-shadow: 0 0 30px rgba(255, 107, 107, 0.5);
  margin-bottom: 16px;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { text-shadow: 0 0 20px rgba(255, 107, 107, 0.5); }
  to { text-shadow: 0 0 40px rgba(255, 107, 107, 0.8), 0 0 60px rgba(255, 107, 107, 0.4); }
}

.subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.lottery-container {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.prize-section {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 24px;
}

.prize-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.winners-section {
  text-align: center;
}

.winners-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.winner-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.winner-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.winner-info {
  text-align: left;
}

.winner-name {
  color: #fff;
  font-weight: 600;
}

.winner-prize {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.qrcode-section {
  text-align: center;
  margin-top: 40px;
}

.qr-hint {
  color: rgba(255, 255, 255, 0.8);
  margin-top: 16px;
}
</style>
