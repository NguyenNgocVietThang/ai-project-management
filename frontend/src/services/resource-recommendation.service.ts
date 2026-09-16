/** SOP-AI-004 / SOP-RM-001: goi API goi y nhan su cho mot Task.
 *
 * Khong dung `ai.service.ts` (dang duoc agent khac chinh sua song song) - goi
 * `api` truc tiep va tu khai bao lai hinh dang response job giong `AIJobResponse`. */
import { api } from '@/services/api'
import type {
  ResourceRecommendationJobStatus,
  ResourceRecommendationResult,
} from '@/types/resource-recommendation.types'

export interface ResourceRecommendationJobResponse {
  job_id: string
  status: ResourceRecommendationJobStatus
  message: string
}

export interface ResourceRecommendationResultResponse {
  job_id: string
  status: ResourceRecommendationJobStatus
  result: ResourceRecommendationResult | null
  error: string | null
}

export const resourceRecommendationService = {
  async requestResourceRecommendation(taskId: number): Promise<ResourceRecommendationJobResponse> {
    const { data } = await api.post<ResourceRecommendationJobResponse>('/ai/resource-recommendation', {
      task_id: taskId,
    })
    return data
  },

  async getJob(jobId: string): Promise<ResourceRecommendationResultResponse> {
    const { data } = await api.get<ResourceRecommendationResultResponse>(`/ai/jobs/${jobId}`)
    return data
  },
}
