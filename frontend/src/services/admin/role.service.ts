import { api } from '@/services/api'
import type { Role, RoleCreate, RoleUpdate } from '@/types/admin.types'

export const roleService = {
  async list(): Promise<Role[]> {
    const { data } = await api.get<Role[]>('/roles/')
    return data
  },

  async get(id: number): Promise<Role> {
    const { data } = await api.get<Role>(`/roles/${id}`)
    return data
  },

  async create(body: RoleCreate): Promise<Role> {
    const { data } = await api.post<Role>('/roles/', body)
    return data
  },

  async update(id: number, body: RoleUpdate): Promise<Role> {
    const { data } = await api.patch<Role>(`/roles/${id}`, body)
    return data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/roles/${id}`)
  },
}
