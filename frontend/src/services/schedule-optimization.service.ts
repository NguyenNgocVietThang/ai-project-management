// SOP-AI-003: service gọi API tối ưu lịch trình bằng AI.
import { api } from '@/services/api'
import type {
  ScheduleOptimizationJobResponse,
  ScheduleOptimizationJobResult,
} from '@/types/schedule-optimization.types'

export const scheduleOptimizationService = {
  async requestScheduleOptimization(
    projectId: number,
    constraints?: Record<string, unknown>
  ): Promise<ScheduleOptimizationJobResponse> {
    const { data } = await api.post<ScheduleOptimizationJobResponse>('/ai/optimize-schedule', {
      project_id: projectId,
      constraints: constraints ?? null,
    })
    return data
  },

  async getJob(jobId: string): Promise<ScheduleOptimizationJobResult> {
    const { data } = await api.get<ScheduleOptimizationJobResult>(`/ai/jobs/${jobId}`)
    return data
  },
}
