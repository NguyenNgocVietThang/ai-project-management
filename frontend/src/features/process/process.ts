import { api } from '@/services/api'
import type { GenerateProcessResponse, ProcessLanguage, ProcessModelRecord } from '@/features/process/types'

export const processService = {
  /** Quy trình mới nhất; 404 `process_model_not_found` khi chưa có. */
  async latest(projectId: number): Promise<ProcessModelRecord> {
    const { data } = await api.get<ProcessModelRecord>(`/projects/${projectId}/process-model`)
    return data
  },
  async generate(projectId: number, body: { language: ProcessLanguage }): Promise<GenerateProcessResponse> {
    const { data } = await api.post<GenerateProcessResponse>(`/projects/${projectId}/process-model`, body)
    return data
  },
}
