/** Phản chiếu backend app/schemas/investor.py */

export type HealthKey = 'on_track' | 'at_risk' | 'off_track' | 'unknown'
export type RoiBasis = 'eac' | 'bac' | 'mixed'
export type ExclusionReason = 'currency_mismatch' | 'no_budget'

export interface Metrics {
  bac: number | null
  ac: number
  ev: number | null
  pv: number | null
  cpi: number | null
  spi: number | null
  eac: number | null
  vac: number | null
  expected_benefit: number | null
  roi: number | null
  roi_basis: RoiBasis | null
  health: HealthKey
}

export interface InvestorProjectRow {
  id: number
  name: string
  status: string
  start_date: string | null
  end_date: string | null
  progress: number
  currency: string
  metrics: Metrics
  risk_level: string | null
  risk_score: number | null
  overdue_tasks: number
  excluded_from_totals: boolean
  exclusion_reason: ExclusionReason | null
}

export interface InvestorProjectDetail extends InvestorProjectRow {
  portfolio_id: number
  task_counts: Record<string, number>
  risk_summary: string | null
}

export interface InvestorPortfolioItem {
  id: number
  name: string
  status: string
  currency: string
  budget: number | null
  project_count: number
  total_bac: number | null
  total_ac: number
  cpi: number | null
  spi: number | null
  health: HealthKey
  granted_at: string | null
}

export interface InvestorPortfolioOverview {
  portfolio: {
    id: number
    name: string
    description: string | null
    status: string
    start_date: string | null
    end_date: string | null
    budget: number | null
    currency: string
  }
  totals: Metrics
  health_distribution: Record<HealthKey, number>
  risk_distribution: Record<string, number>
  overdue_projects: number
  projects: InvestorProjectRow[]
}

export interface InvestorGrant {
  user_id: number
  full_name: string
  email: string
  granted_at: string
  granted_by_id: number | null
}
