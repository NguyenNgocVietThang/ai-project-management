'use client'

import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { AuditLogFilters } from '@/features/audit/components/AuditLogFilters'
import { AuditLogTable } from '@/features/audit/components/AuditLogTable'
import { useAuditLogs } from '@/features/audit/hooks/useAuditLogs'
import { getApiErrorMessage } from '@/types/api.types'
import type { AuditLogListParams } from '@/types/admin.types'

const PAGE_SIZE = 25

export default function AdminAuditPage() {
  const [filters, setFilters] = useState<AuditLogListParams>({})
  const [page, setPage] = useState(1)

  const query = useAuditLogs({ ...filters, page, page_size: PAGE_SIZE })

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Admin</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Audit log</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A read-only, append-only trail of every change made across the system.
        </p>
      </div>

      <AuditLogFilters
        value={filters}
        onChange={(next) => {
          setFilters(next)
          setPage(1)
        }}
      />

      {query.isLoading && <LoadingState label="Loading audit log…" />}
      {query.isError && <ErrorState message={getApiErrorMessage(query.error)} />}
      {query.data && (
        <>
          <AuditLogTable logs={query.data.items} />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {query.data.page} of {Math.max(query.data.total_pages, 1)} · {query.data.total} entries
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-auto"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-auto"
                disabled={page >= query.data.total_pages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
