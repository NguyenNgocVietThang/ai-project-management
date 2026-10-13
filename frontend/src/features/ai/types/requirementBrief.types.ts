// Kiểu dữ liệu của hồ sơ yêu cầu (hợp đồng API /requirement-briefs).

export const BRIEF_ITEM_KEYS = [
  'goals',
  'stakeholders',
  'in_scope',
  'out_of_scope',
  'key_features',
  'constraints',
  'success_criteria',
] as const

export type BriefItemKey = (typeof BRIEF_ITEM_KEYS)[number]
export type BriefItemStatus = 'clear' | 'missing' | 'assumed' | 'skipped'
export type BriefItemSource = 'user' | 'ai' | 'ai_assumption_confirmed' | null
export type BriefStatus = 'clarifying' | 'ready' | 'consumed'

export interface BriefItem {
  status: BriefItemStatus
  value: string | null
  source: BriefItemSource
  proposed_assumption: string | null
}

export interface ItemCounts {
  clear: number
  missing: number
  assumed: number
  skipped: number
  total: number
  resolved: number
}

export interface QaTurn {
  question: string
  answer: string | null
  asked_at: string | null
  answered_at: string | null
  ai_request_id: number | null
}

export interface PendingTurn {
  job_id: number
  status: string
}

export interface RequirementBriefDetail {
  id: number
  idea: string
  status: BriefStatus
  turn_count: number
  project_id: number | null
  pending_job_id: number | null
  created_at: string
  updated_at: string
  items: Record<BriefItemKey, BriefItem>
  qa_history: QaTurn[]
  pending_turn: PendingTurn | null
  max_turns: number
  turns_remaining: number
  item_counts: ItemCounts
  open_question: string | null
  can_finalize: boolean
}

export interface RequirementBriefSummary {
  id: number
  idea: string
  status: BriefStatus
  turn_count: number
  project_id: number | null
  item_counts: ItemCounts
  created_at: string
  updated_at: string
}

export interface TurnResponse {
  brief: RequirementBriefDetail
  job_id: number
  ai_request_id: number
}

export interface ItemUpdate {
  status: 'clear' | 'missing' | 'skipped'
  value?: string | null
}
