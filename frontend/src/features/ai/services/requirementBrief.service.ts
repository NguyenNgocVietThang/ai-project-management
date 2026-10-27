import { api } from '@/services/api'
import type { AIJobResponse } from '@/types/ai.types'
import type { ProjectMethodology } from '@/types/project.types'
import type {
  BriefItemKey,
  ItemUpdate,
  RequirementBriefDetail,
  RequirementBriefSummary,
  TurnResponse,
} from '@/features/ai/types/requirementBrief.types'

// Lớp gọi API hồ sơ yêu cầu; mọi lỗi để nguyên lỗi Axios cho tầng hiển thị xử lý mã.
export const requirementBriefService = {
  async create(idea: string): Promise<TurnResponse> {
    const { data } = await api.post<TurnResponse>('/requirement-briefs', { idea })
    return data
  },
  async list(limit = 5, signal?: AbortSignal): Promise<RequirementBriefSummary[]> {
    const { data } = await api.get<RequirementBriefSummary[]>('/requirement-briefs', { params: { limit }, signal })
    return data
  },
  async get(id: number, signal?: AbortSignal): Promise<RequirementBriefDetail> {
    const { data } = await api.get<RequirementBriefDetail>(`/requirement-briefs/${id}`, { signal })
    return data
  },
  async answer(id: number, answer: string | null): Promise<TurnResponse> {
    const { data } = await api.post<TurnResponse>(`/requirement-briefs/${id}/answer`, { answer })
    return data
  },
  async acceptAssumption(id: number, key: BriefItemKey, value?: string): Promise<RequirementBriefDetail> {
    const body = value === undefined ? {} : { value }
    const { data } = await api.post<RequirementBriefDetail>(`/requirement-briefs/${id}/assumptions/${key}/accept`, body)
    return data
  },
  async rejectAssumption(id: number, key: BriefItemKey): Promise<RequirementBriefDetail> {
    const { data } = await api.post<RequirementBriefDetail>(`/requirement-briefs/${id}/assumptions/${key}/reject`)
    return data
  },
  async patchItem(id: number, key: BriefItemKey, update: ItemUpdate): Promise<RequirementBriefDetail> {
    const { data } = await api.patch<RequirementBriefDetail>(`/requirement-briefs/${id}/items/${key}`, update)
    return data
  },
  async skip(id: number): Promise<RequirementBriefDetail> {
    const { data } = await api.post<RequirementBriefDetail>(`/requirement-briefs/${id}/skip`)
    return data
  },
  async finalize(id: number): Promise<RequirementBriefDetail> {
    const { data } = await api.post<RequirementBriefDetail>(`/requirement-briefs/${id}/finalize`)
    return data
  },
  async generateProject(briefId: number, methodology: ProjectMethodology): Promise<AIJobResponse> {
    const { data } = await api.post<AIJobResponse>('/ai/generate-project-from-brief', { brief_id: briefId, methodology })
    return data
  },
}
