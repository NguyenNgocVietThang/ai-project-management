import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboard.service'

export const DASHBOARD_KEYS = {
  summary: ['dashboard', 'summary'] as const,
  portfolioHealth: (id: number) => ['dashboard', 'portfolio-health', id] as const,
  projectStats: (id: number) => ['dashboard', 'project-stats', id] as const,
}

/** Home Dashboard – tổng quan cho người dùng hiện tại */
export function useDashboardSummary() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.summary,
    queryFn: dashboardService.getSummary,
    staleTime: 30_000,
  })
}

/** Các chỉ số sức khỏe của Portfolio */
export function usePortfolioHealth(portfolioId: number) {
  return useQuery({
    queryKey: DASHBOARD_KEYS.portfolioHealth(portfolioId),
    queryFn: () => dashboardService.getPortfolioHealth(portfolioId),
    enabled: portfolioId > 0,
    staleTime: 30_000,
  })
}

/** Thống kê dashboard của dự án (biểu đồ) */
export function useProjectStats(projectId: number) {
  return useQuery({
    queryKey: DASHBOARD_KEYS.projectStats(projectId),
    queryFn: () => dashboardService.getProjectStats(projectId),
    enabled: projectId > 0,
    staleTime: 30_000,
  })
}
