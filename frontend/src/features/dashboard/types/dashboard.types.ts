// Dashboard types – mirrors backend schemas/dashboard.py

export interface MyTaskItem {
  id: number
  name: string
  project_id: number
  project_name: string
  status: string
  priority: string
  due_date: string | null
  is_critical: boolean
  is_overdue: boolean
}

export interface ActiveProjectSummary {
  id: number
  name: string
  status: string
  methodology: string
  progress_percent: number
  task_count: number
  completed_task_count: number
  budget: number | null
  budget_spent: number
  currency: string
  end_date: string | null
  days_remaining: number | null
}

export interface RecentActivityItem {
  id: number
  action: string
  description: string | null
  entity_type: string
  entity_id: number | null
  actor_name: string | null
  created_at: string
}

export interface UserDashboardStats {
  active_projects: number
  total_tasks: number
  overdue_tasks: number
  hours_this_week: number
}

export interface UserDashboardSummary {
  stats: UserDashboardStats
  active_projects: ActiveProjectSummary[]
  my_tasks: MyTaskItem[]
  recent_activity: RecentActivityItem[]
}

export interface PortfolioProjectHealth {
  project_id: number
  project_name: string
  progress_percent: number
  status: string
  overdue_tasks: number
  budget_utilization_pct: number | null
}

export interface PortfolioHealthResponse {
  portfolio_id: number
  portfolio_name: string
  total_projects: number
  active_projects: number
  completed_projects: number
  overall_progress: number
  projects: PortfolioProjectHealth[]
}

export interface TaskStatusCount {
  status: string
  count: number
  color: string
}

export interface TeamMemberUtilization {
  user_id: number
  full_name: string
  avatar_url: string | null
  estimated_hours: number
  logged_hours: number
  task_count: number
}

export interface BudgetSummary {
  budget: number | null
  spent: number
  remaining: number | null
  utilization_pct: number | null
  currency: string
}

export interface BurndownPoint {
  date: string
  remaining: number
  ideal: number
}

export interface ProjectDashboardStats {
  project_id: number
  project_name: string
  task_distribution: TaskStatusCount[]
  budget: BudgetSummary
  team_utilization: TeamMemberUtilization[]
  burndown: BurndownPoint[]
  total_tasks: number
  completed_tasks: number
  overdue_tasks: number
  critical_tasks: number
}
