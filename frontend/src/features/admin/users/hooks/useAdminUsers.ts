'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminUserService } from '@/services/admin/user.service'
import type { AdminUser, AdminUserCreate, AdminUserListParams, AdminUserUpdate } from '@/types/admin.types'
import type { PaginatedResponse } from '@/types/common.types'

export const adminUserKeys = {
  all: ['admin', 'users'] as const,
  lists: () => [...adminUserKeys.all, 'list'] as const,
  list: (params: AdminUserListParams) => [...adminUserKeys.lists(), params] as const,
  detail: (id: number) => [...adminUserKeys.all, 'detail', id] as const,
}

export function useAdminUsers(params: AdminUserListParams) {
  return useQuery({
    queryKey: adminUserKeys.list(params),
    queryFn: () => adminUserService.list(params),
  })
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: AdminUserCreate) => adminUserService.create(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminUserKeys.all }),
  })
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: AdminUserUpdate }) =>
      adminUserService.update(id, body),
    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: adminUserKeys.all })
      const snapshots = queryClient.getQueriesData({ queryKey: adminUserKeys.all })
      queryClient.setQueriesData<PaginatedResponse<AdminUser>>(
        { queryKey: adminUserKeys.lists() },
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: adminUserKeys.all }),
  })
}

export function useDeactivateAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminUserService.deactivate(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: adminUserKeys.all }),
  })
}

export function useReactivateAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminUserService.reactivate(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: adminUserKeys.all }),
  })
}
