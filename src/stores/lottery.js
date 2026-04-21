import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const useLotteryStore = defineStore('lottery', {
  state: () => ({
    participants: [],
    prizes: [],
    winners: [],
    currentPrize: null,
    loading: false,
    error: null
  }),

  getters: {
    allParticipants: (state) => state.participants,
    pendingParticipants: (state) => state.participants.filter(p => p.status === 'joined'),
    allPrizes: (state) => state.prizes,
    availablePrizes: (state) => state.prizes.filter(p => p.remaining > 0),
    allWinners: (state) => state.winners,
    recentWinners: (state) => state.winners.slice().sort((a, b) => new Date(b.drawTime) - new Date(a.drawTime)).slice(0, 20)
  },

  actions: {
    async init() {
      this.loading = true
      try {
        await Promise.all([this.fetchParticipants(), this.fetchPrizes(), this.fetchWinners()])
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchParticipants() {
      try {
        const res = await axios.get(`${API_BASE}/participants`)
        this.participants = res.data?.data || []
      } catch (err) {
        this.participants = []
      }
    },

    async addParticipant(data) {
      const res = await axios.post(`${API_BASE}/participants`, data)
      if (res.data?.success) this.participants.push(res.data.data)
      return res.data
    },

    async deleteParticipant(id) {
      await axios.delete(`${API_BASE}/participants/${id}`)
      this.participants = this.participants.filter(p => p.id !== id)
    },

    async fetchPrizes() {
      try {
        const res = await axios.get(`${API_BASE}/prizes`)
        this.prizes = res.data?.data || []
      } catch (err) {
        this.prizes = []
      }
    },

    async addPrize(data) {
      const res = await axios.post(`${API_BASE}/prizes`, data)
      if (res.data?.success) this.prizes.push(res.data.data)
      return res.data
    },

    async updatePrize(id, data) {
      const res = await axios.put(`${API_BASE}/prizes/${id}`, data)
      if (res.data?.success) {
        const idx = this.prizes.findIndex(p => p.id === id)
        if (idx !== -1) this.prizes[idx] = res.data.data
      }
      return res.data
    },

    async deletePrize(id) {
      await axios.delete(`${API_BASE}/prizes/${id}`)
      this.prizes = this.prizes.filter(p => p.id !== id)
    },

    async fetchWinners() {
      try {
        const res = await axios.get(`${API_BASE}/lottery/winners`)
        this.winners = res.data?.data || []
      } catch (err) {
        this.winners = []
      }
    },

    setCurrentPrize(prize) { this.currentPrize = prize },

    async startDraw(count = 1) {
      if (!this.currentPrize) throw new Error('请先选择奖品')
      const res = await axios.post(`${API_BASE}/lottery/draw`, { prizeId: this.currentPrize.id, count })
      if (res.data?.success) {
        const winners = res.data.data?.winners || []
        this.winners.push(...winners)
        const idx = this.prizes.findIndex(p => p.id === this.currentPrize.id)
        if (idx !== -1) this.prizes[idx].remaining -= winners.length
        winners.forEach(w => {
          const pIdx = this.participants.findIndex(p => p.id === w.participantId)
          if (pIdx !== -1) this.participants[pIdx].status = 'won'
        })
      }
      return res.data
    },

    async confirmWinner(participantId, prizeId) {
      console.log('Winner confirmed:', { participantId, prizeId })
    }
  }
})
