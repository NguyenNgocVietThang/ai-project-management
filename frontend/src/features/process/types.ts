// Kiểu dữ liệu quy trình BPMN rút gọn trả về từ API process-model.

export type ProcessLanguage = 'vi' | 'en'

export type ProcessNodeType =
  | 'start_event'
  | 'end_event'
  | 'task'
  | 'exclusive_gateway'
  | 'parallel_gateway'
  | 'intermediate_event'

export interface ProcessLane { id: string; name: string }
export interface ProcessNode { id: string; type: ProcessNodeType; name: string; lane_id: string }
export interface ProcessFlow { id: string; source: string; target: string; label?: string | null }

export interface ProcessModelGraph {
  name: string
  lanes: ProcessLane[]
  nodes: ProcessNode[]
  flows: ProcessFlow[]
}

export interface ProcessStep {
  order: number
  node_id: string
  lane: string
  step: string
  type: string
  type_label: string
  next: string
}

export interface ProcessModelRecord {
  id: number
  project_id: number
  brief_id: number | null
  version: number
  language: ProcessLanguage
  model: ProcessModelGraph
  warnings: string[]
  steps: ProcessStep[]
  created_by_id: number | null
  created_at: string
}

export interface GenerateProcessResponse {
  status: 'queued' | 'needs_clarification'
  job_id: number | null
  ai_request_id?: number | null
  missing_items: string[]
  skipped_items: string[]
  brief_reopened: boolean
}
