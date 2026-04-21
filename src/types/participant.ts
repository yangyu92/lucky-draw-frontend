/**
 * 参与者类型定义
 */
export type ParticipantStatus = 'pending' | 'joined' | 'won'

export interface Participant {
  id: number
  name: string
  phone?: string | null
  openid?: string | null
  avatar?: string | null
  status: ParticipantStatus
  created_at?: string
}

export interface CreateParticipantDto {
  name: string
  phone?: string
  openid?: string
  avatar?: string
}

export interface UpdateParticipantDto {
  name?: string
  phone?: string
  avatar?: string
}
