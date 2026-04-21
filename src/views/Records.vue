<template>
  <div class="records-page">
    <header class="page-header">
      <h1>🏆 中奖记录</h1>
      <button class="btn btn-success" @click="exportRecords">📤 导出记录</button>
    </header>

    <!-- 筛选 -->
    <div class="filters card">
      <select v-model="filterLevel" class="form-control">
        <option value="">全部奖项</option>
        <option value="特等奖">特等奖</option>
        <option value="一等奖">一等奖</option>
        <option value="二等奖">二等奖</option>
        <option value="三等奖">三等奖</option>
        <option value="参与奖">参与奖</option>
      </select>
    </div>

    <!-- 记录列表 -->
    <div class="records-list">
      <div class="record-item card" v-for="record in filteredRecords" :key="record.id">
        <div class="record-rank" :class="getRankClass(record.prizeLevel)">
          {{ record.prizeLevel }}
        </div>
        <div class="record-content">
          <div class="record-winner">
            <div class="winner-avatar">{{ record.participantName[0] }}</div>
            <div class="winner-details">
              <div class="winner-name">{{ record.participantName }}</div>
              <div class="winner-phone">{{ record.phone || '无手机号' }}</div>
            </div>
          </div>
          <div class="record-prize">
            <div class="prize-name">{{ record.prizeName }}</div>
            <div class="prize-time">{{ formatTime(record.drawTime) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredRecords.length === 0" class="empty-state card">
      暂无中奖记录
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLotteryStore } from '@/stores/lottery'

const lotteryStore = useLotteryStore()

const filterLevel = ref('')

const filteredRecords = computed(() => {
  let records = lotteryStore.winners
  if (filterLevel.value) {
    records = records.filter(r => r.prizeLevel === filterLevel.value)
  }
  return records.sort((a, b) => new Date(b.drawTime) - new Date(a.drawTime))
})

const getRankClass = (level) => {
  const map = {
    '特等奖': 'rank-special',
    '一等奖': 'rank-first',
    '二等奖': 'rank-second',
    '三等奖': 'rank-third',
    '参与奖': 'rank-participant'
  }
  return map[level] || 'rank-participant'
}

const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN')
}

const exportRecords = () => {
  const data = filteredRecords.value.map(r => ({
    姓名: r.participantName,
    手机号: r.phone || '',
    奖项: r.prizeLevel,
    奖品: r.prizeName,
    中奖时间: formatTime(r.drawTime)
  }))
  
  const csv = [
    Object.keys(data[0] || {}).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n')
  
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `中奖记录_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  lotteryStore.init()
})
</script>

<style scoped>
.records-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  color: #333;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.filters .form-control {
  max-width: 200px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
}

.record-rank {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  color: white;
  min-width: 80px;
  text-align: center;
}

.rank-special { background: linear-gradient(135deg, #ffd700, #ff8c00); }
.rank-first { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.rank-second { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.rank-third { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.rank-participant { background: #e0e0e0; color: #666; }

.record-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-winner {
  display: flex;
  align-items: center;
  gap: 12px;
}

.winner-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.winner-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.winner-phone {
  color: #999;
  font-size: 0.9rem;
}

.record-prize {
  text-align: right;
}

.prize-name {
  color: #333;
  font-weight: 500;
}

.prize-time {
  color: #999;
  font-size: 0.85rem;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #999;
}
</style>
