import type { Task } from '@/types/task.types'

export interface Phase {
  id: number
  project_id: number
  name: string
  description: string | null
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
  order_index: number
  start_date: string | null
  end_date: string | null
  created_at: string
}

export interface Sprint {
  id: number
  project_id: number
  phase_id: number | null
  name: string
  goal: string | null
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  start_date: string | null
  end_date: string | null
  story_points_committed: number
  story_points_completed: number
  velocity: number
}

export interface Epic {
  id: number
  project_id: number
  name: string
  description: string | null
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CLOSED'
  story_points: number
  color: string | null
}

export interface Milestone {
  id: number
  project_id: number
  name: string
  description: string | null
  due_date: string | null
  status: 'PENDING' | 'AT_RISK' | 'COMPLETED' | 'MISSED'
  completed_at: string | null
}

export interface SprintNode extends Sprint { tasks: Task[]; task_count: number }
export interface PhaseNode extends Phase { sprints: SprintNode[]; tasks: Task[]; task_count: number }

export interface WBSTree {
  project_id: number
  phases: PhaseNode[]
  unphased_sprints: SprintNode[]
  unphased_tasks: Task[]
  unphased_task_count: number
  /** false khi cây được lấy về mà không kèm task (mặc định) — xem wbs.service.ts */
  includes_tasks: boolean
  epics: Epic[]
  milestones: Milestone[]
}

export interface PhaseDeleteImpact {
  phase_id: number
  phase_name: string
  sprint_count: number
  task_count: number
  subtask_count: number
  internal_dependency_count: number
  external_dependency_count: number
  assignment_count: number
  worklog_count: number
  comment_count: number
}

export interface PhaseInput {
  name: string
  description?: string | null
  start_date?: string | null
  end_date?: string | null
  order_index?: number
  status?: Phase['status']
}

export interface SprintInput {
  name: string
  goal?: string | null
  start_date?: string | null
  end_date?: string | null
  phase_id?: number | null
  status?: Sprint['status']
}

export interface EpicInput {
  name: string
  description?: string | null
  color?: string | null
  status?: Epic['status']
}

export interface MilestoneInput {
  name: string
  description?: string | null
  due_date?: string | null
  status?: Milestone['status']
}
