import { api } from '@/services/api'
import type {
  ChangeRequest,
  ImpactLevel,
  ImpactReport,
  ManualImpactReportInput,
} from '@/types/change-request.types'

export interface ChangeRequestCreateInput {
  title: string
  description: string
  reason?: string
  impact_description?: string
  impact_level?: ImpactLevel
}

export const changeRequestService = {
  async list(projectId: number): Promise<ChangeRequest[]> {
    const { data } = await api.get<ChangeRequest[]>(`/projects/${projectId}/change-requests`)
    return data
  },

  async create(projectId: number, body: ChangeRequestCreateInput): Promise<ChangeRequest> {
    const { data } = await api.post<ChangeRequest>(`/projects/${projectId}/change-requests`, body)
    return data
  },

  async get(id: number): Promise<ChangeRequest> {
    const { data } = await api.get<ChangeRequest>(`/change-requests/${id}`)
    return data
  },

  async submit(id: number): Promise<ChangeRequest> {
    const { data } = await api.post<ChangeRequest>(`/change-requests/${id}/submit`)
    return data
  },

  /** PM chốt hoặc đổi mức tác động; hạ từ MAJOR phải kèm lý do. */
  async setImpactLevel(id: number, level: ImpactLevel, reason: string | null): Promise<ChangeRequest> {
    const { data } = await api.post<ChangeRequest>(`/change-requests/${id}/impact-level`, { level, reason })
    return data
  },

  /** Báo cáo tác động đã lưu; trả null khi chưa có (404). */
  async getImpactReport(id: number): Promise<ImpactReport | null> {
    try {
      const { data } = await api.get<ImpactReport>(`/change-requests/${id}/impact-report`)
      return data
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status
      if (status === 404) return null
      throw error
    }
  },

  /** PM nhập đánh giá tác động thủ công (chỉ khi chưa có báo cáo AI). */
  async setManualImpactReport(id: number, body: ManualImpactReportInput): Promise<ImpactReport> {
    const { data } = await api.put<ImpactReport>(`/change-requests/${id}/impact-report/manual`, body)
    return data
  },
}
