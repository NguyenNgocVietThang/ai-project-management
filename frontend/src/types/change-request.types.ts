export type ChangeRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'IMPLEMENTED'
  | 'CANCELLED'

export interface ChangeRequest {
  id: number
  project_id: number
  requested_by_id: number
  title: string
  description: string
  reason: string | null
  impact_description: string | null
  status: ChangeRequestStatus
  applied_at: string | null
  created_at: string
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface ImpactReport {
  id: number
  change_request_id: number
  risk_level: RiskLevel
  risk_score: number
  schedule_impact_days: number
  cost_impact: number
  affected_tasks_json: number[] | null
  summary: string | null
  created_at: string
}

/**
 * Hình dạng job AI — trùng với AIJobResponse/AIResultResponse ở @/types/ai.types,
 * nhân bản cục bộ trong feature này để không phụ thuộc file đó (file chung do
 * phiên điều phối/orchestrator chỉnh sửa song song ở bước tích hợp sau).
 */
export type ImpactAnalysisJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export interface ImpactAnalysisJobResponse {
  job_id: string
  status: ImpactAnalysisJobStatus
  message: string
}

export interface ImpactAnalysisJobResult {
  job_id: string
  status: ImpactAnalysisJobStatus
  result: ImpactReport | Record<string, unknown> | null
  error: string | null
  project_id: number | null
}
