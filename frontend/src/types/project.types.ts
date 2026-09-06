export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
export type ProjectMethodology = 'agile' | 'waterfall' | 'hybrid'

/** Kết quả từ /users/search. Email được che ở server — địa chỉ đầy đủ biến bộ
 *  chọn thành viên thành công cụ thu thập danh bạ nhân sự. */
export interface UserSearchResult {
  id: number
  full_name: string
  username: string
  email_hint: string
  avatar_url: string | null
}

export interface UserSummary {
  id: number
  full_name: string
  username: string
  email: string
  avatar_url: string | null
}

export interface RoleSummary {
  id: number
  name: 'PM' | 'BA' | 'PO' | 'Member' | 'Customer' | string
  description: string | null
}

export interface ProjectCapabilities {
  can_update: boolean
  can_delete: boolean
  can_manage_members: boolean
}

export interface Project {
  id: number
  name: string
  description: string | null
  status: ProjectStatus
  methodology: ProjectMethodology
  start_date: string | null
  end_date: string | null
  progress_percent: number
  budget: number | null
  budget_spent: number
  currency: string
  portfolio_id: number | null
  portfolio_name: string | null
  pm_id: number
  member_count: number
  created_at: string
  updated_at: string
  current_user_role: string | null
  capabilities: ProjectCapabilities
}

export interface PhaseSummary {
  id: number
  name: string
  status: string
  order_index: number
  start_date: string | null
  end_date: string | null
}

export interface MilestoneSummary {
  id: number
  name: string
  description: string | null
  status: string
  due_date: string | null
  completed_at: string | null
}

export interface ProjectDetail extends Project {
  owner: UserSummary
  task_count: number
  completed_task_count: number
  phases: PhaseSummary[]
  milestones: MilestoneSummary[]
}

export interface ProjectMember {
  user: UserSummary
  role: RoleSummary
  joined_at: string
  is_owner: boolean
}

export interface AuditEvent {
  id: number
  action: string
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  description: string | null
  created_at: string
  actor: UserSummary | null
}

export interface ProjectCreate {
  name: string
  description?: string | null
  portfolio_id?: number | null
  start_date: string
  end_date: string
  budget?: number | null
  currency?: string
  methodology: ProjectMethodology
}

export interface ProjectUpdate extends Partial<ProjectCreate> {
  status?: ProjectStatus
}

export interface ProjectMemberCreate {
  user_id: number
  role_id: number
}

export interface ProjectListParams {
  page?: number
  page_size?: number
  portfolio_id?: number
  status?: ProjectStatus
  methodology?: ProjectMethodology
  search?: string
  start_date_from?: string
  end_date_to?: string
}
