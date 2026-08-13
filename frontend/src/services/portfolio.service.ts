import { api } from '@/services/api'
import type { PaginatedResponse } from '@/types/common.types'
import type {
  Portfolio,
  PortfolioCreate,
  PortfolioDetail,
  PortfolioListParams,
  PortfolioUpdate,
} from '@/types/portfolio.types'

export const portfolioService = {
  async list(params: PortfolioListParams = {}): Promise<PaginatedResponse<Portfolio>> {
    const { data } = await api.get<PaginatedResponse<Portfolio>>('/portfolios/', { params })
    return data
  },

  async get(id: number): Promise<PortfolioDetail> {
    const { data } = await api.get<PortfolioDetail>(`/portfolios/${id}`)
    return data
  },

  async create(body: PortfolioCreate): Promise<Portfolio> {
    const { data } = await api.post<Portfolio>('/portfolios/', body)
    return data
  },

  async update(id: number, body: PortfolioUpdate): Promise<Portfolio> {
    const { data } = await api.patch<Portfolio>(`/portfolios/${id}`, body)
    return data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/portfolios/${id}`)
  },
}
