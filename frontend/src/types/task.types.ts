import type { UserSummary } from '@/types/project.types'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface TaskCapabilities {
  can_update: boolean
  can_delete: boolean
  can_change_status: boolean
  can_manage_dependencies: boolean
  can_manage_assignments: boolean
  can_log_work: boolean
  can_read_worklogs: boolean
}

export interface Subtask {
  id: number
  name: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  is_completed: boolean
  estimated_hours: number | null
  actual_hours: number
  task_id: number
  assignee_id: number | null
}

export interface Assignment {
  id: number
  task_id: number
  user_id: number
  role: string | null
  allocated_hours: number
  allocation_percentage: number
  start_date: string | null
  end_date: string | null
  user: Pick<UserSummary, 'id' | 'full_name' | 'avatar_url'> | null
  is_primary: boolean
}

export interface ResourceWarning {
  user_id: number
  date: string
  reason: 'overloaded' | 'on_leave'
  total_hours: number
  max_hours: number
  task_ids: number[]
}

export interface Dependency {
  id: number
  predecessor_id: number
  successor_id: number
  dependency_type: 'FS' | 'SS' | 'FF' | 'SF'
  lag_days: number
  predecessor_name: string | null
  successor_name: string | null
}

export interface Worklog {
  id: number
  task_id: number
  user_id: number
  hours: number
  log_date: string
  description: string | null
  start_time: string | null
  end_time: string | null
  created_at: string
  user: Pick<UserSummary, 'id' | 'full_name' | 'avatar_url'> | null
  is_running: boolean
}

export interface Task {
  id: number
  name: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  story_points: number | null
  labels: string[]
  progress: number
  estimated_hours: number | null
  actual_hours: number
  start_date: string | null
  due_date: string | null
  early_start: string | null
  early_finish: string | null
  late_start: string | null
  late_finish: string | null
  is_critical: boolean
  float_days: number | null
  project_id: number
  phase_id: number | null
  sprint_id: number | null
  epic_id: number | null
  assignee_id: number | null
  primary_assignee: Pick<UserSummary, 'id' | 'full_name' | 'avatar_url'> | null
  capabilities: TaskCapabilities
}

export interface TaskDetail extends Task {
  subtasks: Subtask[]
  assignments: Assignment[]
  predecessor_dependencies: Dependency[]
  successor_dependencies: Dependency[]
  total_logged_hours: number
  comments_count: number
}

export interface TaskCreate {
  name: string
  description?: string | null
  phase_id?: number | null
  sprint_id?: number | null
  epic_id?: number | null
  primary_assignee_id?: number | null
  priority?: TaskPriority
  estimated_hours?: number | null
  start_date?: string | null
  due_date?: string | null
  story_points?: number | null
  labels?: string[]
}

export type TaskUpdate = Partial<TaskCreate>

export interface TaskListParams {
  page?: number
  page_size?: number
  search?: string
  phase_id?: number
  sprint_id?: number
  epic_id?: number
  assignee_id?: number
  status?: TaskStatus
  priority?: TaskPriority
  labels?: string[]
  due_date_from?: string
  due_date_to?: string
}

export interface SubtaskCreate {
  name: string
  description?: string
  status?: Subtask['status']
  estimated_hours?: number
  assignee_id?: number | null
}

export interface AssignmentCreate {
  user_id: number
  role?: string
  allocated_hours?: number
  allocation_percentage?: number
  start_date?: string | null
  end_date?: string | null
  is_primary?: boolean
}

export interface WorklogCreate {
  hours?: number
  log_date: string
  description?: string
  start_time?: string
  end_time?: string
}

export interface WorklogProjectSummary {
  items: Worklog[]
  total_hours: number
  by_user: Record<number, number>
}
