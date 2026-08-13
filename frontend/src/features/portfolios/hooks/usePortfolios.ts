'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { portfolioService } from '@/services/portfolio.service'
import type { PaginatedResponse } from '@/types/common.types'
import type {
  Portfolio,
  PortfolioCreate,
  PortfolioListParams,
  PortfolioUpdate,
} from '@/types/portfolio.types'

export const portfolioKeys = {
  all: ['portfolios'] as const,
  lists: () => [...portfolioKeys.all, 'list'] as const,
  list: (params: PortfolioListParams) => [...portfolioKeys.lists(), params] as const,
  detail: (id: number) => [...portfolioKeys.all, 'detail', id] as const,
}

export function usePortfolios(params: PortfolioListParams) {
  return useQuery({
    queryKey: portfolioKeys.list(params),
    queryFn: () => portfolioService.list(params),
  })
}

export function usePortfolio(id: number) {
  return useQuery({
    queryKey: portfolioKeys.detail(id),
    queryFn: () => portfolioService.get(id),
    enabled: Number.isFinite(id),
  })
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: PortfolioCreate) => portfolioService.create(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: portfolioKeys.all }),
  })
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: PortfolioUpdate }) =>
      portfolioService.update(id, body),
    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: portfolioKeys.all })
      const snapshots = queryClient.getQueriesData({ queryKey: portfolioKeys.all })
      queryClient.setQueryData<Portfolio>(portfolioKeys.detail(id), (current) =>
        current ? { ...current, ...body } : current
      )
      queryClient.setQueriesData<PaginatedResponse<Portfolio>>(
        { queryKey: portfolioKeys.lists() },
        (current) =>
          current
            ? { ...current, items: current.items.map((item) => (item.id === id ? { ...item, ...body } : item)) }
            : current
      )
      return { snapshots }
    },
    onError: (_error, _variables, context) => {
      context?.snapshots.forEach(([key, value]) => queryClient.setQueryData(key, value))
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() })
    },
  })
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => portfolioService.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: portfolioKeys.all })
      const snapshots = queryClient.getQueriesData({ queryKey: portfolioKeys.all })
      queryClient.setQueriesData<PaginatedResponse<Portfolio>>(
        { queryKey: portfolioKeys.lists() },
        (current) =>
          current
            ? { ...current, total: Math.max(0, current.total - 1), items: current.items.filter((item) => item.id !== id) }
            : current
      )
      return { snapshots }
    },
    onError: (_error, _id, context) => {
      context?.snapshots.forEach(([key, value]) => queryClient.setQueryData(key, value))
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: portfolioKeys.all }),
  })
}
