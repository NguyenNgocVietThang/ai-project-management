// Dashboard API service – Phase 3.1 & 3.2
import { api } from './api'
import type {
  PortfolioHealthResponse,
  ProjectDashboardStats,
  UserDashboardSummary,
} from '@/types/dashboard.types'

export const dashboardService = {
  /** GET /dashboard/summary – Home dashboard for the current user */
  getSummary(): Promise<UserDashboardSummary> {
    return api.get<UserDashboardSummary>('/dashboard/summary').then((r) => r.data)
  },

  /** GET /dashboard/portfolios/{id}/health */
  getPortfolioHealth(portfolioId: number): Promise<PortfolioHealthResponse> {
    return api
      .get<PortfolioHealthResponse>(`/dashboard/portfolios/${portfolioId}/health`)
      .then((r) => r.data)
  },

  /** GET /dashboard/projects/{id}/stats */
  getProjectStats(projectId: number): Promise<ProjectDashboardStats> {
    return api
      .get<ProjectDashboardStats>(`/dashboard/projects/${projectId}/stats`)
      .then((r) => r.data)
  },
}
