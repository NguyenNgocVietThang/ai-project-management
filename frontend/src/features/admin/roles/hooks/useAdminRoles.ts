'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { permissionService } from '@/services/admin/permission.service'
import { roleService } from '@/services/admin/role.service'
import type { RoleCreate, RoleUpdate } from '@/types/admin.types'

export const adminRoleKeys = {
  all: ['admin', 'roles'] as const,
  list: () => [...adminRoleKeys.all, 'list'] as const,
  detail: (id: number) => [...adminRoleKeys.all, 'detail', id] as const,
}

export const permissionKeys = {
  all: ['admin', 'permissions'] as const,
}

export function useAdminRoles() {
  return useQuery({
    queryKey: adminRoleKeys.list(),
    queryFn: () => roleService.list(),
  })
}

export function usePermissionCatalog() {
  return useQuery({
    queryKey: permissionKeys.all,
    queryFn: () => permissionService.list(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: RoleCreate) => roleService.create(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminRoleKeys.all }),
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: RoleUpdate }) => roleService.update(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminRoleKeys.all }),
  })
}

export function useDeleteRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => roleService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminRoleKeys.all }),
  })
}
