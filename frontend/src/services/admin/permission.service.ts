import { api } from '@/services/api'
import type { Permission } from '@/types/admin.types'

export const permissionService = {
  async list(): Promise<Permission[]> {
    const { data } = await api.get<Permission[]>('/permissions/')
    return data
  },
}
