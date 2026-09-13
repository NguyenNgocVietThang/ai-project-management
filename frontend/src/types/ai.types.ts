export type AIJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export interface AIJobResponse {
  job_id: string
  status: AIJobStatus
  message: string
}

export interface AIResultResponse {
  job_id: string
  status: AIJobStatus
  result: Record<string, unknown> | null
  error: string | null
  project_id: number | null
}
