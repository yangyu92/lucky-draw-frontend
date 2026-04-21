import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type {
  ApiResponse,
  Participant,
  Prize,
  Winner,
  QRCodeData,
  WechatStatus,
  CreateParticipantDto,
  UpdateParticipantDto,
  CreatePrizeDto,
  UpdatePrizeDto,
  DrawRequest,
  DrawResult
} from '@/types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data as any,
  (error: AxiosError) => Promise.reject(error)
)

/**
 * 参与者相关API
 */
export const participantApi = {
  getParticipants: (): Promise<ApiResponse<Participant[]>> =>
    api.get('/participants'),

  addParticipant: (data: CreateParticipantDto): Promise<ApiResponse<Participant>> =>
    api.post('/participants', data),

  updateParticipant: (id: number, data: UpdateParticipantDto): Promise<ApiResponse<Participant>> =>
    api.put(`/participants/${id}`, data),

  deleteParticipant: (id: number): Promise<ApiResponse<void>> =>
    api.delete(`/participants/${id}`),

  batchAddParticipants: (participants: CreateParticipantDto[]): Promise<ApiResponse<void>> =>
    api.post('/participants/batch', { participants })
}

/**
 * 奖品相关API
 */
export const prizeApi = {
  getPrizes: (): Promise<ApiResponse<Prize[]>> =>
    api.get('/prizes'),

  addPrize: (data: CreatePrizeDto): Promise<ApiResponse<Prize>> =>
    api.post('/prizes', data),

  updatePrize: (id: number, data: UpdatePrizeDto): Promise<ApiResponse<Prize>> =>
    api.put(`/prizes/${id}`, data),

  deletePrize: (id: number): Promise<ApiResponse<void>> =>
    api.delete(`/prizes/${id}`)
}

/**
 * 抽奖相关API
 */
export const lotteryApi = {
  getWinners: (): Promise<ApiResponse<Winner[]>> =>
    api.get('/lottery/winners'),

  draw: (prizeId: number, count: number): Promise<ApiResponse<DrawResult>> =>
    api.post('/lottery/draw', { prizeId, count } as DrawRequest),

  resetLottery: (): Promise<ApiResponse<void>> =>
    api.post('/lottery/reset')
}

/**
 * 微信相关API
 */
export const wechatApi = {
  getQRCode: (): Promise<ApiResponse<QRCodeData>> =>
    api.get('/wechat/qrcode'),

  checkScan: (sceneStr: string): Promise<ApiResponse<WechatStatus>> =>
    api.get(`/wechat/check/${sceneStr}`),

  checkin: (data: { name: string; phone?: string; openid?: string }): Promise<ApiResponse<Participant>> =>
    api.post('/wechat/checkin', data)
}

/**
 * 默认导出所有API方法（保持向后兼容）
 */
export default {
  getParticipants: () => participantApi.getParticipants(),
  addParticipant: (data: CreateParticipantDto) => participantApi.addParticipant(data),
  deleteParticipant: (id: number) => participantApi.deleteParticipant(id),
  updateParticipant: (id: number, data: UpdateParticipantDto) => participantApi.updateParticipant(id, data),
  getPrizes: () => prizeApi.getPrizes(),
  addPrize: (data: CreatePrizeDto) => prizeApi.addPrize(data),
  updatePrize: (id: number, data: UpdatePrizeDto) => prizeApi.updatePrize(id, data),
  deletePrize: (id: number) => prizeApi.deletePrize(id),
  getWinners: () => lotteryApi.getWinners(),
  draw: (prizeId: number, count: number) => lotteryApi.draw(prizeId, count),
  resetLottery: () => lotteryApi.resetLottery(),
  getQRCode: () => wechatApi.getQRCode(),
  checkScan: (sceneStr: string) => wechatApi.checkScan(sceneStr)
}
