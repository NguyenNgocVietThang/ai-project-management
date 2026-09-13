import { api } from '@/services/api'
import type { AIJobResponse, AIResultResponse } from '@/types/ai.types'

export const aiService = {
  async generateProject(prompt: string): Promise<AIJobResponse> {
    const { data } = await api.post<AIJobResponse>('/ai/generate-project', { prompt })
    return data
  },

  async getJob(jobId: string): Promise<AIResultResponse> {
    const { data } = await api.get<AIResultResponse>(`/ai/jobs/${jobId}`)
    return data
  },
}
