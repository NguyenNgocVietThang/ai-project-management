'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { formatDate, formatStatus } from '@/lib/format'
import { getApiErrorMessage } from '@/types/api.types'
import { useChangeRequests } from '@/features/change-requests/hooks/useChangeRequests'
import { ChangeRequestForm } from './ChangeRequestForm'
import type { ChangeRequestStatus } from '@/types/change-request.types'

const STATUS_CLASSES: Record<ChangeRequestStatus, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  SUBMITTED: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  UNDER_REVIEW: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  APPROVED: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  REJECTED: 'bg-destructive/10 text-destructive',
  IMPLEMENTED: 'bg-emerald-600/10 text-emerald-800 dark:text-emerald-200',
  CANCELLED: 'bg-muted text-muted-foreground line-through',
}

function StatusBadge({ status }: { status: ChangeRequestStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[status]}`}
    >
      {formatStatus(status)}
    </span>
  )
}

export function ChangeRequestList({
  projectId,
  selectedId,
  onSelect,
}: {
  projectId: number
  selectedId: number | null
  onSelect: (id: number) => void
}) {
  const [formOpen, setFormOpen] = useState(false)
  const query = useChangeRequests(projectId)

  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Change requests</h2>
        <Button type="button" className="sm:w-auto" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          New change request
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        {query.isLoading && <LoadingState label="Loading change requests…" />}
        {query.isError && <ErrorState message={getApiErrorMessage(query.error)} />}
        {query.data?.length === 0 && (
          <EmptyState
            title="No change requests yet"
            description="Create one to start an AI impact analysis."
          />
        )}
        {query.data?.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selectedId === item.id ? 'border-primary bg-accent/60' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="truncate text-sm font-medium">{item.title}</h3>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
          </button>
        ))}
      </div>

      <ChangeRequestForm
        projectId={projectId}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreated={(created) => {
          setFormOpen(false)
          onSelect(created.id)
        }}
      />
    </section>
  )
}
