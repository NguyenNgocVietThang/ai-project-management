'use client'

import { useRouter } from 'next/navigation'
import { useNumericParam } from '@/hooks/useNumericParam'
import { useState } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { ErrorState } from '@/components/common/PageState'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/PageHeader'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { usePortfolios } from '@/features/portfolios/hooks/usePortfolios'
import { ProjectForm } from '@/features/projects/components/ProjectForm'
import { useDeleteProject, useProjectDetail, useUpdateProject } from '@/features/projects/hooks/useProjects'
import { getApiErrorMessage } from '@/types/api.types'
import type { ProjectUpdate } from '@/types/project.types'

const HEADER = <SectionHeader title="Project settings" description="Update scope, timeline, budget, methodology, and status." />

export default function ProjectSettingsPage() {
  const id = useNumericParam()
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const project = useProjectDetail(id)
  const portfolios = usePortfolios({ page_size: 100 })
  const updateMutation = useUpdateProject()
  const deleteMutation = useDeleteProject()

  if (project.isLoading) {
    // Khung xương mô phỏng form: các cặp nhãn + ô nhập xếp 2 cột.
    return (
      <div className="space-y-8">
        {HEADER}
        <SkeletonRegion label="Loading settings…" className="space-y-6 rounded-xl border border-border/80 bg-card p-4 shadow-soft sm:p-6">
          <Skeleton className="h-5 w-40" />
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-24 w-full" />
        </SkeletonRegion>
      </div>
    )
  }
  if (project.isError || !project.data) {
    return (
      <div className="space-y-8">
        {HEADER}
        <ErrorState message={getApiErrorMessage(project.error)} onRetry={() => void project.refetch()} />
      </div>
    )
  }
  if (!project.data.capabilities.can_update) {
    return (
      <div className="space-y-8">
        {HEADER}
        <Alert>You have read-only access to this project. Project PM privileges are required to change settings.</Alert>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {HEADER}

      {/* ===== Thông tin chung: CTA chính là nút lưu trong ProjectForm ===== */}
      <Card as="section" aria-labelledby="settings-general">
        <CardHeader className="mb-6">
          <div className="min-w-0">
            <CardTitle as="h3" id="settings-general">General</CardTitle>
            <CardDescription>Name, description, portfolio, timeline, budget, methodology and status of the project.</CardDescription>
          </div>
        </CardHeader>
        <ProjectForm
          project={project.data}
          portfolios={portfolios.data?.items ?? []}
          isLoading={updateMutation.isPending}
          error={updateMutation.isError ? getApiErrorMessage(updateMutation.error) : null}
          onSubmit={async (body: ProjectUpdate) => {
            await updateMutation.mutateAsync({ id, body })
          }}
        />
      </Card>

      {/* ===== Vùng nguy hiểm: tách riêng cuối trang, viền đỏ ===== */}
      {project.data.capabilities.can_delete && (
        <Card as="section" aria-labelledby="settings-danger" className="border-destructive/40 bg-destructive/5 shadow-none">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10" aria-hidden="true">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </span>
              <div className="min-w-0">
                <CardTitle as="h3" id="settings-danger">Danger zone</CardTitle>
                <CardDescription>Soft-delete this project. Restore is not available in Phase 1.</CardDescription>
              </div>
            </div>
            <Button variant="destructive" fullWidth={false} className="w-full shrink-0 sm:w-auto" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete project
            </Button>
          </div>
        </Card>
      )}

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete project" description="The project will disappear for every member." className="max-w-lg">
        {deleteMutation.isError && <Alert className="mb-4">{getApiErrorMessage(deleteMutation.error)}</Alert>}
        <p className="text-body-sm text-muted-foreground">
          Delete <strong className="text-foreground">{project.data.name}</strong>?
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" fullWidth={false} className="w-full sm:w-auto" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            fullWidth={false}
            className="w-full sm:w-auto"
            isLoading={deleteMutation.isPending}
            onClick={async () => {
              await deleteMutation.mutateAsync(id)
              router.push('/projects')
            }}
          >
            Delete project
          </Button>
        </div>
      </Modal>
    </div>
  )
}
