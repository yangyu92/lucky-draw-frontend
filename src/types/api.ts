/**
 * API响应类型定义
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
}

export interface ParticipantListResponse extends ApiResponse<import('./participant').Participant[]> {}
export interface ParticipantResponse extends ApiResponse<import('./participant').Participant> {}
export interface PrizeListResponse extends ApiResponse<import('./prize').Prize[]> {}
export interface PrizeResponse extends ApiResponse<import('./prize').Prize> {}
export interface WinnerListResponse extends ApiResponse<import('./lottery').Winner[]> {}
export interface DrawResponse extends ApiResponse<import('./lottery').DrawResult> {}

export interface QRCodeData {
  sceneStr: string
  qrCode: string
  authUrl: string
}

export interface QRCodeResponse extends ApiResponse<QRCodeData> {}

export interface WechatStatus {
  status: 'pending' | 'scanned'
  openid?: string
  unionid?: string
  created?: number
  scanned?: number
}

export interface WechatStatusResponse extends ApiResponse<WechatStatus> {}
