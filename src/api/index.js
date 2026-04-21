import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(response => response.data, error => Promise.reject(error))

export default {
  getParticipants: () => api.get('/participants'),
  addParticipant: (data) => api.post('/participants', data),
  deleteParticipant: (id) => api.delete(`/participants/${id}`),
  updateParticipant: (id, data) => api.put(`/participants/${id}`, data),
  getPrizes: () => api.get('/prizes'),
  addPrize: (data) => api.post('/prizes', data),
  updatePrize: (id, data) => api.put(`/prizes/${id}`, data),
  deletePrize: (id) => api.delete(`/prizes/${id}`),
  getWinners: () => api.get('/lottery/winners'),
  draw: (prizeId, count) => api.post('/lottery/draw', { prizeId, count }),
  resetLottery: () => api.post('/lottery/reset'),
  getQRCode: () => api.get('/wechat/qrcode'),
  checkScan: (sceneStr) => api.get(`/wechat/check/${sceneStr}`)
}
