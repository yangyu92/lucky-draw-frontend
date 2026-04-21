<template>
  <div class="prizes-page">
    <header class="page-header">
      <h1>🎁 奖品管理</h1>
      <button class="btn btn-primary" @click="showAddModal = true">+ 添加奖品</button>
    </header>

    <!-- 奖品列表 -->
    <div class="prizes-grid">
      <div class="prize-item card" v-for="prize in prizes" :key="prize.id">
        <div class="prize-image">
          <img :src="prize.image_url || '/default-prize.png'" :alt="prize.name" />
        </div>
        <div class="prize-info">
          <span class="prize-level">{{ prize.level }}</span>
          <h3 class="prize-name">{{ prize.name }}</h3>
          <div class="prize-stats">
            <span>总数: {{ prize.quantity }}</span>
            <span>剩余: {{ prize.remaining }}</span>
          </div>
        </div>
        <div class="prize-actions">
          <button class="btn-sm" @click="editPrize(prize)">编辑</button>
          <button class="btn-sm btn-danger" @click="deletePrize(prize.id)">删除</button>
        </div>
      </div>
    </div>

    <div v-if="prizes.length === 0" class="empty-state card">
      暂无奖品，请添加
    </div>

    <!-- 添加/编辑奖品弹窗 -->
    <div class="modal" v-if="showAddModal" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ editingPrize ? '编辑奖品' : '添加奖品' }}</h3>
        <div class="form-group">
          <label>奖品名称 *</label>
          <input type="text" v-model="prizeForm.name" class="form-control" />
        </div>
        <div class="form-group">
          <label>奖品等级</label>
          <select v-model="prizeForm.level" class="form-control">
            <option value="特等奖">特等奖</option>
            <option value="一等奖">一等奖</option>
            <option value="二等奖">二等奖</option>
            <option value="三等奖">三等奖</option>
            <option value="参与奖">参与奖</option>
          </select>
        </div>
        <div class="form-group">
          <label>数量</label>
          <input type="number" v-model="prizeForm.quantity" min="1" class="form-control" />
        </div>
        <div class="form-group">
          <label>图片URL</label>
          <input type="text" v-model="prizeForm.image_url" class="form-control" placeholder="http://..." />
        </div>
        <div class="modal-actions">
          <button class="btn" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="savePrize">{{ editingPrize ? '保存' : '添加' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLotteryStore } from '@/stores/lottery'
import { ElMessage } from 'element-plus'

const lotteryStore = useLotteryStore()

const showAddModal = ref(false)
const editingPrize = ref(null)
const prizeForm = ref({
  name: '',
  level: '参与奖',
  quantity: 1,
  image_url: ''
})

const prizes = computed(() => lotteryStore.allPrizes)

const editPrize = (prize) => {
  editingPrize.value = prize
  prizeForm.value = { ...prize }
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  editingPrize.value = null
  prizeForm.value = { name: '', level: '参与奖', quantity: 1, image_url: '' }
}

const savePrize = async () => {
  if (!prizeForm.value.name) {
    ElMessage.warning('请输入奖品名称')
    return
  }
  
  if (editingPrize.value) {
    await lotteryStore.updatePrize(editingPrize.value.id, prizeForm.value)
    ElMessage.success('更新成功')
  } else {
    await lotteryStore.addPrize(prizeForm.value)
    ElMessage.success('添加成功')
  }
  closeModal()
}

const deletePrize = async (id) => {
  if (confirm('确定要删除该奖品吗？')) {
    await lotteryStore.deletePrize(id)
    ElMessage.success('删除成功')
  }
}

onMounted(() => {
  lotteryStore.init()
})
</script>

<style scoped>
.prizes-page {
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

.prizes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.prize-item {
  overflow: hidden;
}

.prize-image {
  height: 160px;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.prize-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prize-level {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
}

.prize-name {
  margin: 12px 0;
  color: #333;
  font-size: 1.2rem;
}

.prize-stats {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 0.9rem;
}

.prize-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #e0e0e0;
  color: #333;
}

.btn-danger {
  background: #ff5252 !important;
  color: white !important;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #999;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 450px;
  max-width: 90%;
}

.modal-content h3 {
  margin-bottom: 20px;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
</style>
