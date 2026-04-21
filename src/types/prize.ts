/**
 * 奖品类型定义
 */
export type PrizeLevel = '特等奖' | '一等奖' | '二等奖' | '三等奖' | '参与奖'

export interface Prize {
  id: number
  name: string
  level: PrizeLevel
  quantity: number
  remaining: number
  image_url?: string | null
  created_at?: string
}

export interface CreatePrizeDto {
  name: string
  level?: PrizeLevel
  quantity?: number
  image_url?: string
}

export interface UpdatePrizeDto {
  name?: string
  level?: PrizeLevel
  quantity?: number
  image_url?: string
}
