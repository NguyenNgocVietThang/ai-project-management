'use client'

import { useTranslations } from 'next-intl'

import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { PageHeader } from '@/components/ui/PageHeader'
import { AuditLogFilters } from '@/features/audit/components/AuditLogFilters'
import { AuditLogTable } from '@/features/audit/components/AuditLogTable'
import { useAuditLogs } from '@/features/audit/hooks/useAuditLogs'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'
import type { AuditLogListParams } from '@/types/admin.types'

const PAGE_SIZE = 25

export default function AdminAuditPage() {
  const getApiErrorMessage = useApiErrorMessage()
  const tAccount = useTranslations('accountUi')
  const [filters, setFilters] = useState<AuditLogListParams>({})
  const [page, setPage] = useState(1)

  const query = useAuditLogs({ ...filters, page, page_size: PAGE_SIZE })

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={tAccount('admin')}
        title={tAccount('auditLog')}
        description={tAccount('aReadOnlyAppendOnlyTrailOfEveryChangeMadeAcrossTheSystem')}
        actions={
          <Button
            type="button"
            variant="outline"
            fullWidth={false}
            disabled={query.isFetching}
            onClick={() => void query.refetch()}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
             {tAccount('refresh')} </Button>
        }
      />

      <AuditLogFilters
        value={filters}
        onChange={(next) => {
          setFilters(next)
          setPage(1)
        }}
      />

      {query.isLoading && <LoadingState variant="table" label={tAccount('loadingAuditLog')} />}
      {query.isError && (
        <ErrorState message={getApiErrorMessage(query.error)} onRetry={() => void query.refetch()} />
      )}
      {query.data && (
        <div className="space-y-4">
          <AuditLogTable logs={query.data.items} />
          {/* Phân trang: xếp dọc trên mobile để không tràn ngang */}
          <nav
            aria-label={tAccount('auditLogPages')}
            className="flex flex-col gap-3 text-body-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
          >
            <span>
               {tAccount('page')} {query.data.page}  {tAccount('of')} {Math.max(query.data.total_pages, 1)} · {query.data.total}  {tAccount('entries')} </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                fullWidth={false}
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                 {tAccount('previous')} </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth={false}
                disabled={page >= query.data.total_pages}
                onClick={() => setPage((current) => current + 1)}
              >
                 {tAccount('next')} </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
