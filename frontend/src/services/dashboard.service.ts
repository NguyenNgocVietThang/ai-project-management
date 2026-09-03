// Service API Dashboard – Phase 3.1 & 3.2
import { api } from './api'
import type {
  PortfolioHealthResponse,
  ProjectDashboardStats,
  UserDashboardSummary,
} from '@/types/dashboard.types'

export const dashboardService = {
  /** GET /dashboard/summary – Dashboard trang chủ cho người dùng hiện tại */
  getSummary(): Promise<UserDashboardSummary> {
    return api.get<UserDashboardSummary>('/dashboard/summary').then((r) => r.data)
  },

  /** Lấy thông tin sức khỏe của portfolio: GET /dashboard/portfolios/{id}/health */
  getPortfolioHealth(portfolioId: number): Promise<PortfolioHealthResponse> {
    return api
      .get<PortfolioHealthResponse>(`/dashboard/portfolios/${portfolioId}/health`)
      .then((r) => r.data)
  },

  /** Lấy thống kê số liệu của dự án: GET /dashboard/projects/{id}/stats */
  getProjectStats(projectId: number): Promise<ProjectDashboardStats> {
    return api
      .get<ProjectDashboardStats>(`/dashboard/projects/${projectId}/stats`)
      .then((r) => r.data)
  },
}
