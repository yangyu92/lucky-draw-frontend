<template>
  <div class="admin">
    <header class="admin-header">
      <h1>🎯 抽奖管理系统</h1>
      <nav class="admin-nav">
        <router-link to="/admin">控制台</router-link>
        <router-link to="/participants">人员管理</router-link>
        <router-link to="/prizes">奖品管理</router-link>
        <router-link to="/records">中奖记录</router-link>
      </nav>
    </header>

    <main class="admin-main">
      <!-- 统计卡片 -->
      <div class="stats">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalParticipants }}</div>
            <div class="stat-label">总参与人数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎁</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalPrizes }}</div>
            <div class="stat-label">奖品总数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalWinners }}</div>
            <div class="stat-label">已中奖人数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.remainingPrizes }}</div>
            <div class="stat-label">剩余奖品</div>
          </div>
        </div>
      </div>

      <!-- 快速抽奖区 -->
      <div class="quick-draw card">
        <h2>⚡ 快速抽奖</h2>
        <div class="draw-controls">
          <select v-model="selectedPrizeId" class="form-control">
            <option value="">选择奖项</option>
            <option v-for="prize in availablePrizes" :key="prize.id" :value="prize.id">
              {{ prize.level }} - {{ prize.name }} ({{ prize.remaining }}个)
            </option>
          </select>
          <input type="number" v-model="drawCount" min="1" :max="maxDrawCount" class="form-control" placeholder="抽取人数" />
          <button class="btn btn-primary" @click="startQuickDraw" :disabled="isDrawing">
            {{ isDrawing ? '抽奖中...' : '开始抽奖' }}
          </button>
        </div>
      </div>

      <!-- 最近中奖 -->
      <div class="recent-winners card">
        <h2>🏆 最近中奖</h2>
        <table class="table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>手机号</th>
              <th>奖品</th>
              <th>中奖时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="winner in recentWinners" :key="winner.id">
              <td>{{ winner.participantName }}</td>
              <td>{{ winner.phone || '-' }}</td>
              <td>{{ winner.prizeName }}</td>
              <td>{{ formatTime(winner.drawTime) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLotteryStore } from '@/stores/lottery'

const lotteryStore = useLotteryStore()

const selectedPrizeId = ref('')
const drawCount = ref(1)
const isDrawing = ref(false)

const stats = computed(() => ({
  totalParticipants: lotteryStore.allParticipants.length,
  totalPrizes: lotteryStore.allPrizes.length,
  totalWinners: lotteryStore.winners.length,
  remainingPrizes: lotteryStore.availablePrizes.reduce((sum, p) => sum + p.remaining, 0)
}))

const availablePrizes = computed(() => lotteryStore.availablePrizes)
const maxDrawCount = computed(() => {
  const prize = availablePrizes.value.find(p => p.id == selectedPrizeId.value)
  return prize ? Math.min(prize.remaining, 10) : 1
})
const recentWinners = computed(() => lotteryStore.winners.slice(0, 10))

const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN')
}

const startQuickDraw = async () => {
  if (!selectedPrizeId.value) {
    alert('请选择奖项')
    return
  }
  isDrawing.value = true
  const prize = availablePrizes.value.find(p => p.id == selectedPrizeId.value)
  await lotteryStore.startDraw(drawCount.value)
  // 抽奖完成后刷新
  setTimeout(() => {
    isDrawing.value = false
  }, 3000)
}

onMounted(() => {
  lotteryStore.init()
})
</script>

<style scoped>
.admin {
  min-height: 100vh;
  background: #f5f7fa;
}

.admin-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.admin-header h1 {
  font-size: 1.8rem;
}

.admin-nav {
  display: flex;
  gap: 24px;
}

.admin-nav a {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background 0.3s;
}

.admin-nav a:hover,
.admin-nav a.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

.admin-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  font-size: 3rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.quick-draw {
  margin-bottom: 30px;
}

.quick-draw h2 {
  margin-bottom: 20px;
  color: #333;
}

.draw-controls {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.draw-controls .form-control {
  flex: 1;
  min-width: 150px;
}

.draw-controls .btn {
  padding: 12px 32px;
}

.recent-winners h2 {
  margin-bottom: 20px;
  color: #333;
}
</style>
