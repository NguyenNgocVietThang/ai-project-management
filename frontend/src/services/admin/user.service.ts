import { api } from '@/services/api'
import type {
  AdminUser,
  AdminUserCreate,
  AdminUserListParams,
  AdminUserUpdate,
} from '@/types/admin.types'
import type { PaginatedResponse } from '@/types/common.types'

export const adminUserService = {
  async list(params: AdminUserListParams = {}): Promise<PaginatedResponse<AdminUser>> {
    const { data } = await api.get<PaginatedResponse<AdminUser>>('/users/', { params })
    return data
  },

  async get(id: number): Promise<AdminUser> {
    const { data } = await api.get<AdminUser>(`/users/${id}`)
    return data
  },

  async create(body: AdminUserCreate): Promise<AdminUser> {
    const { data } = await api.post<AdminUser>('/users/', body)
    return data
  },

  async update(id: number, body: AdminUserUpdate): Promise<AdminUser> {
    const { data } = await api.patch<AdminUser>(`/users/${id}`, body)
    return data
  },

  async deactivate(id: number): Promise<AdminUser> {
    const { data } = await api.delete<AdminUser>(`/users/${id}`)
    return data
  },

  async reactivate(id: number): Promise<AdminUser> {
    const { data } = await api.post<AdminUser>(`/users/${id}/reactivate`)
    return data
  },
}
