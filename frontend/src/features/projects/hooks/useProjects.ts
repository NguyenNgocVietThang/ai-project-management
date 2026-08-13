'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectService } from '@/services/project.service'
import type { PaginatedResponse } from '@/types/common.types'
import type { Project, ProjectCreate, ProjectListParams, ProjectUpdate } from '@/types/project.types'
import { portfolioKeys } from '@/features/portfolios/hooks/usePortfolios'

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (params: ProjectListParams) => [...projectKeys.lists(), params] as const,
  detail: (id: number) => [...projectKeys.all, 'detail', id] as const,
  members: (id: number) => [...projectKeys.detail(id), 'members'] as const,
  activity: (id: number) => [...projectKeys.detail(id), 'activity'] as const,
}

export function useProjects(params: ProjectListParams) {
  return useQuery({ queryKey: projectKeys.list(params), queryFn: () => projectService.list(params) })
}

export function useProjectDetail(id: number) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectService.get(id),
    enabled: Number.isFinite(id),
  })
}

export function useProjectActivity(id: number) {
  return useQuery({
    queryKey: projectKeys.activity(id),
    queryFn: () => projectService.activity(id),
    enabled: Number.isFinite(id),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ProjectCreate) => projectService.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ProjectUpdate }) => projectService.update(id, body),
    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.all })
      const snapshots = queryClient.getQueriesData({ queryKey: projectKeys.all })
      queryClient.setQueryData<Project>(projectKeys.detail(id), (current) =>
        current ? { ...current, ...body } : current
      )
      queryClient.setQueriesData<PaginatedResponse<Project>>(
        { queryKey: projectKeys.lists() },
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
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => projectService.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.all })
      const snapshots = queryClient.getQueriesData({ queryKey: projectKeys.all })
      queryClient.setQueriesData<PaginatedResponse<Project>>(
        { queryKey: projectKeys.lists() },
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all })
    },
  })
}
