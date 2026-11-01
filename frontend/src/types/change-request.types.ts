export type ChangeRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'IMPLEMENTED'
  | 'CANCELLED'

/** Mức tác động của CR: người tạo đề xuất, AI chỉ gợi ý, PM là người chốt. */
export type ImpactLevel = 'MINOR' | 'MODERATE' | 'MAJOR'
export const IMPACT_LEVELS: readonly ImpactLevel[] = ['MINOR', 'MODERATE', 'MAJOR']

export interface ChangeRequest {
  id: number
  project_id: number
  requested_by_id: number
  title: string
  description: string
  reason: string | null
  impact_description: string | null
  status: ChangeRequestStatus
  impact_level: ImpactLevel
  /** PM (hoặc hệ thống với dữ liệu cũ) đã chốt mức; chưa chốt thì chưa ai quyết định được bước duyệt. */
  impact_level_confirmed: boolean
  impact_level_confirmed_by_id: number | null
  impact_level_confirmed_at: string | null
  impact_level_change_reason: string | null
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
  /** Tăng mỗi lần báo cáo bị ghi đè; người duyệt CR MAJOR xác nhận theo revision này. */
  revision: number
  /** AI: AI sinh; MANUAL: PM nhập thủ công khi AI lỗi/hết quota. */
  source: 'AI' | 'MANUAL'
  /** Mức AI gợi ý — chỉ tham khảo, hệ thống không tự áp dụng. */
  suggested_impact_level: ImpactLevel | null
  impact_level_rationale: string | null
  created_by_id: number | null
  /** Luôn true: báo cáo chỉ mang tính khuyến nghị. */
  advisory: true
  created_at: string
}

export interface ManualImpactReportInput {
  risk_level: RiskLevel
  schedule_impact_days: number
  cost_impact: number
  summary: string
  suggested_impact_level?: ImpactLevel | null
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
