/**
 * 类型定义索引文件
 */
export * from './participant'
export * from './prize'
export * from './lottery'
export * from './api'

// 重新导出以便于导入
import type { Participant, CreateParticipantDto, UpdateParticipantDto, ParticipantStatus } from './participant'
import type { Prize, CreatePrizeDto, UpdatePrizeDto, PrizeLevel } from './prize'
import type { Winner, DrawRequest, DrawResult, DrawResponse } from './lottery'
import type { ApiResponse } from './api'

// Vue组件实例类型
export interface ComponentCustomProperties {
  // 可以添加全局组件属性
}
