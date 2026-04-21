<template>
  <div class="participants-page">
    <header class="page-header">
      <h1>👥 人员管理</h1>
      <div class="header-actions">
        <button class="btn btn-primary" @click="showAddModal = true">+ 添加人员</button>
        <button class="btn btn-success" @click="importParticipants">📥 批量导入</button>
      </div>
    </header>

    <!-- 搜索和筛选 -->
    <div class="filters card">
      <input type="text" v-model="searchKeyword" class="form-control" placeholder="搜索姓名或手机号..." />
      <select v-model="filterStatus" class="form-control">
        <option value="">全部状态</option>
        <option value="pending">未签到</option>
        <option value="joined">已签到</option>
        <option value="won">已中奖</option>
      </select>
    </div>

    <!-- 人员列表 -->
    <div class="participants-table card">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>手机号</th>
            <th>状态</th>
            <th>签到时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filteredParticipants" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.phone || '-' }}</td>
            <td>
              <span :class="['status-badge', p.status]">
                {{ statusText[p.status] }}
              </span>
            </td>
            <td>{{ p.created_at ? formatTime(p.created_at) : '-' }}</td>
            <td>
              <button class="btn-sm btn-danger" @click="deleteParticipant(p.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredParticipants.length === 0" class="empty-state">
        暂无数据
      </div>
    </div>

    <!-- 添加人员弹窗 -->
    <div class="modal" v-if="showAddModal" @click.self="showAddModal = false">
      <div class="modal-content">
        <h3>添加人员</h3>
        <div class="form-group">
          <label>姓名 *</label>
          <input type="text" v-model="newParticipant.name" class="form-control" />
        </div>
        <div class="form-group">
          <label>手机号</label>
          <input type="text" v-model="newParticipant.phone" class="form-control" />
        </div>
        <div class="modal-actions">
          <button class="btn" @click="showAddModal = false">取消</button>
          <button class="btn btn-primary" @click="addParticipant">添加</button>
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

const searchKeyword = ref('')
const filterStatus = ref('')
const showAddModal = ref(false)
const newParticipant = ref({ name: '', phone: '' })

const statusText = {
  pending: '未签到',
  joined: '已签到',
  won: '已中奖'
}

const filteredParticipants = computed(() => {
  let list = lotteryStore.allParticipants
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(p => 
      p.name.toLowerCase().includes(kw) || 
      (p.phone && p.phone.includes(kw))
    )
  }
  if (filterStatus.value) {
    list = list.filter(p => p.status === filterStatus.value)
  }
  return list
})

const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN')
}

const addParticipant = async () => {
  if (!newParticipant.value.name) {
    ElMessage.warning('请输入姓名')
    return
  }
  await lotteryStore.addParticipant(newParticipant.value)
  newParticipant.value = { name: '', phone: '' }
  showAddModal.value = false
  ElMessage.success('添加成功')
}

const deleteParticipant = async (id) => {
  if (confirm('确定要删除该人员吗？')) {
    await lotteryStore.deleteParticipant(id)
    ElMessage.success('删除成功')
  }
}

const importParticipants = () => {
  ElMessage.info('批量导入功能开发中')
}

onMounted(() => {
  lotteryStore.init()
})
</script>

<style scoped>
.participants-page {
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

.header-actions {
  display: flex;
  gap: 12px;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.filters .form-control {
  flex: 1;
}

.participants-table {
  overflow-x: auto;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.status-badge.pending {
  background: #e0e0e0;
  color: #666;
}

.status-badge.joined {
  background: #e8f5e9;
  color: #4caf50;
}

.status-badge.won {
  background: #fff3e0;
  color: #ff9800;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger {
  background: #ff5252;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 40px;
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
  width: 400px;
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
