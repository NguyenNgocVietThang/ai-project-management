'use client'

import { FileEdit, Plus } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { EmptyState, ErrorState } from '@/components/common/PageState'
import { Card } from '@/components/ui/Card'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/types/api.types'
import { useChangeRequests } from '@/features/change-requests/hooks/useChangeRequests'
import { ChangeRequestStatusBadge } from './ChangeRequestStatusBadge'

/**
 * Danh sách CR của dự án. Nút tạo mới và form nằm ở trang cha (CTA chính trên
 * SectionHeader); ở đây chỉ gọi `onCreate` từ CTA của trạng thái rỗng.
 */
export function ChangeRequestList({
  projectId,
  selectedId,
  onSelect,
  onCreate,
}: {
  projectId: number
  selectedId: number | null
  onSelect: (id: number) => void
  onCreate: () => void
}) {
  const query = useChangeRequests(projectId)

  if (query.isLoading) {
    return (
      <SkeletonRegion label="Loading change requests…" className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 rounded-xl border border-border/80 bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </SkeletonRegion>
    )
  }

  if (query.isError) {
    return <ErrorState message={getApiErrorMessage(query.error)} onRetry={() => void query.refetch()} />
  }

  if (query.data?.length === 0) {
    return (
      <EmptyState
        icon={FileEdit}
        title="No change requests yet"
        description="Create one to start an AI impact analysis."
        action={
          <Button type="button" variant="outline" fullWidth={false} onClick={onCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New change request
          </Button>
        }
      />
    )
  }

  return (
    <Card as="section" aria-label="Change requests" className="p-2 sm:p-2">
      <ul className="space-y-1">
        {query.data?.map((item) => {
          const selected = selectedId === item.id
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={selected ? 'true' : undefined}
                className={cn(
                  'w-full rounded-lg border border-transparent p-3 text-left transition-colors duration-150 ease-out-soft',
                  'hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  selected && 'border-primary/30 bg-accent hover:bg-accent'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="min-w-0 break-words text-body-sm font-medium text-foreground">{item.title}</h3>
                  <ChangeRequestStatusBadge status={item.status} />
                </div>
                <p className="mt-1 text-caption text-muted-foreground">{formatDate(item.created_at)}</p>
              </button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
