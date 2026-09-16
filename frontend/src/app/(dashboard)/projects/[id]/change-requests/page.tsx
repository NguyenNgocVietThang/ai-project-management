'use client'

import { useState } from 'react'
import { EmptyState } from '@/components/common/PageState'
import { useNumericParam } from '@/hooks/useNumericParam'
import { ChangeRequestDetail } from '@/features/change-requests/components/ChangeRequestDetail'
import { ChangeRequestList } from '@/features/change-requests/components/ChangeRequestList'

export default function ChangeRequestsPage() {
  const projectId = useNumericParam()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
      <ChangeRequestList projectId={projectId} selectedId={selectedId} onSelect={setSelectedId} />
      {selectedId === null ? (
        <EmptyState
          title="Select a change request"
          description="Choose a change request from the list to view details and run an AI impact analysis."
        />
      ) : (
        <ChangeRequestDetail changeRequestId={selectedId} />
      )}
    </div>
  )
}
