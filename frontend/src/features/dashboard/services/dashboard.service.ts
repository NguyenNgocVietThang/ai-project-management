import { api } from '@/services/api'
import type {
  PortfolioHealthResponse,
  ProjectDashboardStats,
  UserDashboardSummary,
} from '../types/dashboard.types'

export const dashboardService = {
  getSummary: () =>
    api.get<UserDashboardSummary>('/dashboard/summary').then((r) => r.data),

  getPortfolioHealth: (portfolioId: number) =>
    api
      .get<PortfolioHealthResponse>(`/dashboard/portfolios/${portfolioId}/health`)
      .then((r) => r.data),

  getProjectStats: (projectId: number) =>
    api
      .get<ProjectDashboardStats>(`/dashboard/projects/${projectId}/stats`)
      .then((r) => r.data),
}
