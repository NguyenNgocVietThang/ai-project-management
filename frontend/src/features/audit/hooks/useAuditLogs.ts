'use client'

import { useQuery } from '@tanstack/react-query'
import { auditService } from '@/services/admin/audit.service'
import type { AuditLogListParams } from '@/types/admin.types'

export const auditLogKeys = {
  all: ['admin', 'audit'] as const,
  list: (params: AuditLogListParams) => [...auditLogKeys.all, 'list', params] as const,
}

export function useAuditLogs(params: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: () => auditService.list(params),
  })
}
