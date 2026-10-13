'use client'

import { useState } from 'react'
import { MousePointerClick, Plus } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/PageState'
import { SectionHeader } from '@/components/ui/PageHeader'
import { useNumericParam } from '@/hooks/useNumericParam'
import { ChangeRequestDetail } from '@/features/change-requests/components/ChangeRequestDetail'
import { ChangeRequestForm } from '@/features/change-requests/components/ChangeRequestForm'
import { ChangeRequestList } from '@/features/change-requests/components/ChangeRequestList'

export default function ChangeRequestsPage() {
  const projectId = useNumericParam()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Trang con nằm trong layout dự án (đã có H1) nên chỉ dùng H2 + CTA chính. */}
      <SectionHeader
        title="Change requests"
        description="Propose scope changes, run an AI impact analysis and track the approval chain."
        action={
          <Button type="button" fullWidth={false} onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New change request
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
        <ChangeRequestList
          projectId={projectId}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onCreate={() => setFormOpen(true)}
        />
        {selectedId === null ? (
          <EmptyState
            icon={MousePointerClick}
            title="Select a change request"
            description="Choose a change request from the list to view details and run an AI impact analysis."
          />
        ) : (
          <ChangeRequestDetail changeRequestId={selectedId} variant="embedded" />
        )}
      </div>

      <ChangeRequestForm
        projectId={projectId}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreated={(created) => {
          setFormOpen(false)
          setSelectedId(created.id)
        }}
      />
    </div>
  )
}
