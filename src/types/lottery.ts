/**
 * 抽奖相关类型定义
 */
import type { Participant } from './participant'
import type { Prize } from './prize'

export interface Winner {
  id: number
  participantId: number
  participantName: string
  phone?: string | null
  prizeId: number
  prizeName: string
  prizeLevel: string
  drawTime: string
}

export interface DrawRequest {
  prizeId: number
  count: number
}

export interface DrawResult {
  winners: Winner[]
}

export interface CurrentPrizeState {
  currentPrize: Prize | null
  isDrawing: boolean
  candidates: Participant[]
}
