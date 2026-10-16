import { api } from '@/services/api'
import type { PaginatedResponse } from '@/types/common.types'
import type {
  InvestorGrant,
  InvestorPortfolioItem,
  InvestorPortfolioOverview,
  InvestorProjectDetail,
} from '../types/investor.types'

export const investorService = {
  listPortfolios: () =>
    api
      .get<PaginatedResponse<InvestorPortfolioItem>>('/investor/portfolios', { params: { page: 1, page_size: 100 } })
      .then((r) => r.data),

  getPortfolio: (id: number) =>
    api.get<InvestorPortfolioOverview>(`/investor/portfolios/${id}`).then((r) => r.data),

  getProject: (id: number) =>
    api.get<InvestorProjectDetail>(`/investor/projects/${id}`).then((r) => r.data),

  listGrants: (portfolioId: number) =>
    api.get<InvestorGrant[]>(`/portfolios/${portfolioId}/investors`).then((r) => r.data),

  grant: (portfolioId: number, email: string) =>
    api.post<InvestorGrant>(`/portfolios/${portfolioId}/investors`, { email }).then((r) => r.data),

  revoke: (portfolioId: number, userId: number) =>
    api.delete(`/portfolios/${portfolioId}/investors/${userId}`).then(() => undefined),
}
