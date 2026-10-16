import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { investorService } from '../services/investor.service'

export const INVESTOR_KEYS = {
  portfolios: ['investor', 'portfolios'] as const,
  portfolio: (id: number) => ['investor', 'portfolio', id] as const,
  grants: (portfolioId: number) => ['investor', 'grants', portfolioId] as const,
}

/** Danh sách portfolio người dùng được xem qua cổng nhà đầu tư */
export function useInvestorPortfolios() {
  return useQuery({ queryKey: INVESTOR_KEYS.portfolios, queryFn: investorService.listPortfolios, staleTime: 30_000 })
}

/** Tổng quan một portfolio: KPI, phân bố sức khỏe/rủi ro, bảng dự án */
export function useInvestorPortfolio(id: number) {
  return useQuery({
    queryKey: INVESTOR_KEYS.portfolio(id),
    queryFn: () => investorService.getPortfolio(id),
    enabled: id > 0,
    staleTime: 30_000,
    // 403 sau khi bị thu hồi là kết quả cuối, thử lại không có ích.
    retry: false,
  })
}

/** Danh sách investor của một portfolio (chỉ chủ hoặc admin gọi được) */
export function usePortfolioInvestors(portfolioId: number, enabled: boolean) {
  return useQuery({
    queryKey: INVESTOR_KEYS.grants(portfolioId),
    queryFn: () => investorService.listGrants(portfolioId),
    enabled: enabled && portfolioId > 0,
  })
}

export function useGrantInvestor(portfolioId: number) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (email: string) => investorService.grant(portfolioId, email),
    onSuccess: () => client.invalidateQueries({ queryKey: INVESTOR_KEYS.grants(portfolioId) }),
  })
}

export function useRevokeInvestor(portfolioId: number) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => investorService.revoke(portfolioId, userId),
    onSuccess: () => client.invalidateQueries({ queryKey: INVESTOR_KEYS.grants(portfolioId) }),
  })
}
