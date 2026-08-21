import { api } from '@/services/api'
import type { AuditLog, AuditLogListParams } from '@/types/admin.types'
import type { PaginatedResponse } from '@/types/common.types'

export const auditService = {
  async list(params: AuditLogListParams = {}): Promise<PaginatedResponse<AuditLog>> {
    const { data } = await api.get<PaginatedResponse<AuditLog>>('/audit/', { params })
    return data
  },
}
