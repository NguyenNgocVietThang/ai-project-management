export type PortfolioStatus = 'PLANNING' | 'ACTIVE' | 'ARCHIVED'

export interface PortfolioCapabilities {
  can_update: boolean
  can_delete: boolean
  can_create_project: boolean
}

export interface PortfolioProjectSummary {
  id: number
  name: string
  status: string
  methodology: ProjectMethodology
  start_date: string | null
  end_date: string | null
  progress_percent: number
  budget: number | null
}

export type ProjectMethodology = 'agile' | 'waterfall' | 'hybrid'

export interface Portfolio {
  id: number
  name: string
  description: string | null
  status: PortfolioStatus
  start_date: string | null
  end_date: string | null
  budget: number | null
  currency: string
  owner_id: number
  project_count: number
  progress_percent: number
  created_at: string
  updated_at: string
  capabilities: PortfolioCapabilities
}

export interface PortfolioDetail extends Portfolio {
  projects: PortfolioProjectSummary[]
}

export interface PortfolioCreate {
  name: string
  description?: string | null
  start_date?: string | null
  end_date?: string | null
  budget?: number | null
  currency?: string
}

export interface PortfolioUpdate extends Partial<PortfolioCreate> {
  status?: PortfolioStatus
}

export interface PortfolioListParams {
  page?: number
  page_size?: number
  status?: PortfolioStatus
  search?: string
}
