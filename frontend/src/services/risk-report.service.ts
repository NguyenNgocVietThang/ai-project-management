import { api } from '@/services/api'

/** Shape job-response cho SOP-AI-005 — khai báo lại cục bộ giống
 * `AIJobResponse`/`AIResultResponse` (types/ai.types.ts) thay vì import, vì
 * risk-analysis là một endpoint AI tách riêng nằm ngoài phạm vi file đó. */
export type RiskAnalysisJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export interface RiskAnalysisJobResponse {
  job_id: string
  status: RiskAnalysisJobStatus
  message: string
}

export interface RiskAnalysisResultResponse {
  job_id: string
  status: RiskAnalysisJobStatus
  result: Record<string, unknown> | null
  error: string | null
  project_id: number | null
}

export const riskReportService = {
  /** Xếp hàng một lượt quét rủi ro cho project — trả về job để poll qua getJob. */
  async requestRiskAnalysis(projectId: number): Promise<RiskAnalysisJobResponse> {
    const { data } = await api.post<RiskAnalysisJobResponse>('/ai/risk-analysis', {
      project_id: projectId,
    })
    return data
  },

  async getJob(jobId: string): Promise<RiskAnalysisResultResponse> {
    const { data } = await api.get<RiskAnalysisResultResponse>(`/ai/jobs/${jobId}`)
    return data
  },
}
