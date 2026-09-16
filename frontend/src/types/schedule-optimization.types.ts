// SOP-AI-003: kiểu dữ liệu cho tính năng tối ưu lịch trình bằng AI.
// File tách biệt, không đụng vào types/ai.types.ts dùng chung cho pillar khác.

export type ScheduleOptimizationAction = 'CRASH' | 'FAST_TRACK' | 'REASSIGN' | 'OTHER'

export interface ScheduleSuggestion {
  task_id: number
  action: ScheduleOptimizationAction
  detail: string
  estimated_days_saved: number
}

export interface ScheduleOptimizationResult {
  summary: string
  estimated_days_saved: number
  suggestions: ScheduleSuggestion[]
}

// Trạng thái job AI chạy nền — mirror AIJobStatus của ai.types.ts, khai báo lại
// cục bộ để không phải import/sửa file dùng chung.
export type ScheduleOptimizationJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export interface ScheduleOptimizationJobResponse {
  job_id: string
  status: ScheduleOptimizationJobStatus
  message: string
}

export interface ScheduleOptimizationJobResult {
  job_id: string
  status: ScheduleOptimizationJobStatus
  result: ScheduleOptimizationResult | null
  error: string | null
  project_id: number | null
}
