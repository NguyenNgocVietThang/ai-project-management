import { api } from '@/services/api'
import type { ImpactLevel } from '@/types/change-request.types'

/** Vai trò phụ trách từng bước duyệt CR, theo thứ tự BA -> PO -> PM. */
export type ApprovalRole = 'BA' | 'PO' | 'PM'
export type ApprovalStepStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'

export interface ApprovalStep {
  id: number
  step_order: number
  required_role: ApprovalRole
  status: ApprovalStepStatus
  approver_id: number | null
  approver_name: string | null
  comment: string | null
  decided_at: string | null
  can_decide: boolean
  /** Mức tác động của CR tại thời điểm quyết định bước. */
  impact_level_at_decision: ImpactLevel | null
  /** Revision báo cáo tác động người duyệt đã xác nhận đọc. */
  acknowledged_report_revision: number | null
}

export interface ApprovalChain {
  change_request_id: number
  change_request_status: string
  current_step_order: number | null
  impact_level: ImpactLevel
  impact_level_confirmed: boolean
  /** Revision báo cáo tác động hiện tại; null khi chưa có báo cáo. */
  report_revision: number | null
  /** Điều kiện khi DUYỆT (CR MAJOR): cần báo cáo, xác nhận đã đọc và nhận xét. */
  requires_report: boolean
  requires_acknowledgement: boolean
  requires_comment: boolean
  steps: ApprovalStep[]
}

export const approvalService = {
  async get(crId: number): Promise<ApprovalChain> {
    const { data } = await api.get<ApprovalChain>(`/change-requests/${crId}/approvals`)
    return data
  },
  async approve(
    crId: number,
    stepOrder: number,
    comment: string | null,
    acknowledgedReportRevision: number | null = null,
  ): Promise<ApprovalChain> {
    const { data } = await api.post<ApprovalChain>(
      `/change-requests/${crId}/approvals/${stepOrder}/approve`,
      { comment, acknowledged_report_revision: acknowledgedReportRevision },
    )
    return data
  },
  async reject(crId: number, stepOrder: number, reason: string): Promise<ApprovalChain> {
    const { data } = await api.post<ApprovalChain>(
      `/change-requests/${crId}/approvals/${stepOrder}/reject`,
      { reason },
    )
    return data
  },
}

/** Lấy mã HTTP và chuỗi detail từ lỗi Axios (nếu có). */
export function readApiError(error: unknown): { status: number | null; detail: string | null } {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { status?: number; data?: { detail?: unknown } } }).response
    const detail = response?.data?.detail
    return { status: response?.status ?? null, detail: typeof detail === 'string' ? detail : null }
  }
  return { status: null, detail: null }
}

/** Phân tích lỗi 422 `missing_roles: BA, PO` khi submit CR; trả về danh sách vai trò hoặc null. */
export function parseMissingRoles(error: unknown): string[] | null {
  const { status, detail } = readApiError(error)
  if (status !== 422 || !detail) return null
  const match = /missing_roles:\s*(.+)$/.exec(detail)
  if (!match) return null
  return match[1].split(',').map((r) => r.trim()).filter(Boolean)
}

/** Mã lỗi 422 nghiệp vụ của kiểm soát mức tác động (backend trả trong `detail`). */
export const IMPACT_ERROR_CODES = [
  'impact_level_unconfirmed',
  'impact_report_required',
  'acknowledgement_required',
  'impact_report_changed',
  'comment_required',
  'reason_required',
  'ai_report_exists',
] as const
export type ImpactErrorCode = (typeof IMPACT_ERROR_CODES)[number]

/** Trả về mã lỗi kiểm soát mức tác động nếu lỗi API là một trong các mã đã biết. */
export function parseImpactError(error: unknown): ImpactErrorCode | null {
  const { detail } = readApiError(error)
  return (IMPACT_ERROR_CODES as readonly string[]).includes(detail ?? '') ? (detail as ImpactErrorCode) : null
}
