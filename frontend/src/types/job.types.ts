export type DurableJobStatus = 'queued' | 'running' | 'succeeded' | 'failed'

export interface DurableJob {
  id: number
  kind: string
  status: DurableJobStatus
  owner_id: number | null
  project_id: number | null
  attempts: number
  max_attempts: number
  error_code: string | null
  result: { ai_request_id?: number; sent?: boolean } | null
  created_at: string
  updated_at: string
}
