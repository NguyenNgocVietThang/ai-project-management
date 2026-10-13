import { api } from '@/services/api'

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
}

export interface ApprovalChain {
  change_request_id: number
  change_request_status: string
  current_step_order: number | null
  steps: ApprovalStep[]
}

export const approvalService = {
  async get(crId: number): Promise<ApprovalChain> {
    const { data } = await api.get<ApprovalChain>(`/change-requests/${crId}/approvals`)
    return data
  },
  async approve(crId: number, stepOrder: number, comment: string | null): Promise<ApprovalChain> {
    const { data } = await api.post<ApprovalChain>(
      `/change-requests/${crId}/approvals/${stepOrder}/approve`,
      { comment },
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
