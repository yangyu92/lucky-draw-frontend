import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Participant, Prize, Winner, CreateParticipantDto, CreatePrizeDto, UpdatePrizeDto } from '@/types'
import { participantApi, prizeApi, lotteryApi } from '@/api'

export const useLotteryStore = defineStore('lottery', () => {
  // 状态
  const participants = ref<Participant[]>([])
  const prizes = ref<Prize[]>([])
  const winners = ref<Winner[]>([])
  const currentPrize = ref<Prize | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getter
  const allParticipants = computed(() => participants.value)
  const pendingParticipants = computed(() => participants.value.filter(p => p.status === 'joined'))
  const allPrizes = computed(() => prizes.value)
  const availablePrizes = computed(() => prizes.value.filter(p => p.remaining > 0))
  const allWinners = computed(() => winners.value)
  const recentWinners = computed(() => 
    winners.value
      .slice()
      .sort((a, b) => new Date(b.drawTime).getTime() - new Date(a.drawTime).getTime())
      .slice(0, 20)
  )

  // Actions
  async function init() {
    loading.value = true
    try {
      await Promise.all([fetchParticipants(), fetchPrizes(), fetchWinners()])
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  async function fetchParticipants() {
    try {
      const res = await participantApi.getParticipants()
      if (res.success) {
        participants.value = res.data || []
      }
    } catch {
      participants.value = []
    }
  }

  async function addParticipant(data: CreateParticipantDto) {
    const res = await participantApi.addParticipant(data)
    if (res.success && res.data) {
      participants.value.push(res.data)
    }
    return res
  }

  async function deleteParticipant(id: number) {
    await participantApi.deleteParticipant(id)
    participants.value = participants.value.filter(p => p.id !== id)
  }

  async function fetchPrizes() {
    try {
      const res = await prizeApi.getPrizes()
      if (res.success) {
        prizes.value = res.data || []
      }
    } catch {
      prizes.value = []
    }
  }

  async function addPrize(data: CreatePrizeDto) {
    const res = await prizeApi.addPrize(data)
    if (res.success && res.data) {
      prizes.value.push(res.data)
    }
    return res
  }

  async function updatePrize(id: number, data: UpdatePrizeDto) {
    const res = await prizeApi.updatePrize(id, data)
    if (res.success && res.data) {
      const idx = prizes.value.findIndex(p => p.id === id)
      if (idx !== -1) {
        prizes.value[idx] = res.data
      }
    }
    return res
  }

  async function deletePrize(id: number) {
    await prizeApi.deletePrize(id)
    prizes.value = prizes.value.filter(p => p.id !== id)
  }

  async function fetchWinners() {
    try {
      const res = await lotteryApi.getWinners()
      if (res.success) {
        winners.value = res.data || []
      }
    } catch {
      winners.value = []
    }
  }

  function setCurrentPrize(prize: Prize | null) {
    currentPrize.value = prize
  }

  async function startDraw(count: number = 1) {
    if (!currentPrize.value) {
      throw new Error('请先选择奖品')
    }
    
    const res = await lotteryApi.draw(currentPrize.value.id, count)
    if (res.success && res.data) {
      const newWinners = res.data.winners || []
      winners.value.push(...newWinners)
      
      const idx = prizes.value.findIndex(p => p.id === currentPrize.value!.id)
      if (idx !== -1) {
        prizes.value[idx].remaining -= newWinners.length
      }
      
      newWinners.forEach(w => {
        const pIdx = participants.value.findIndex(p => p.id === w.participantId)
        if (pIdx !== -1) {
          participants.value[pIdx].status = 'won'
        }
      })
    }
    return res
  }

  async function confirmWinner(participantId: number, prizeId: number) {
    console.log('Winner confirmed:', { participantId, prizeId })
  }

  async function resetLottery() {
    const res = await lotteryApi.resetLottery()
    if (res.success) {
      // 重置本地状态
      winners.value = []
      prizes.value = prizes.value.map(p => ({ ...p, remaining: p.quantity }))
      participants.value = participants.value.map(p => ({ ...p, status: 'pending' }))
    }
    return res
  }

  return {
    // 状态
    participants,
    prizes,
    winners,
    currentPrize,
    loading,
    error,
    // Getters
    allParticipants,
    pendingParticipants,
    allPrizes,
    availablePrizes,
    allWinners,
    recentWinners,
    // Actions
    init,
    fetchParticipants,
    addParticipant,
    deleteParticipant,
    fetchPrizes,
    addPrize,
    updatePrize,
    deletePrize,
    fetchWinners,
    setCurrentPrize,
    startDraw,
    confirmWinner,
    resetLottery
  }
})
