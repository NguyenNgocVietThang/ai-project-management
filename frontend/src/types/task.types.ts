/** Mirrors backend app/schemas/task.py */

export interface Task {
  id: number
  name: string
  description: string | null
  status: string
  priority: string
  estimated_hours: number | null
  actual_hours: number | null
  start_date: string | null
  due_date: string | null
  is_critical: boolean
  float_days: number | null
  project_id: number
}

export interface TaskCreate {
  name: string
  description?: string | null
  project_id: number
  phase_id?: number | null
  sprint_id?: number | null
  epic_id?: number | null
  assignee_id?: number | null
  priority?: string
  estimated_hours?: number | null
  start_date?: string | null
  due_date?: string | null
}

export interface TaskUpdate {
  name?: string
  description?: string | null
  status?: string
  priority?: string
  assignee_id?: number | null
  estimated_hours?: number | null
  actual_hours?: number | null
  start_date?: string | null
  due_date?: string | null
}

/** Query params for `GET /tasks`. */
export interface TaskListParams {
  page?: number
  page_size?: number
  project_id?: number
  sprint_id?: number
  assignee_id?: number
  status?: string
}
