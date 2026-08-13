'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { usePortfolios } from '@/features/portfolios/hooks/usePortfolios'
import { ProjectForm } from '@/features/projects/components/ProjectForm'
import { useDeleteProject, useProjectDetail, useUpdateProject } from '@/features/projects/hooks/useProjects'
import { getApiErrorMessage } from '@/types/api.types'
import type { ProjectUpdate } from '@/types/project.types'

export default function ProjectSettingsPage() {
  const id = Number(useParams<{ id: string }>().id)
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const project = useProjectDetail(id)
  const portfolios = usePortfolios({ page_size: 100 })
  const updateMutation = useUpdateProject()
  const deleteMutation = useDeleteProject()
  if (project.isLoading) return <LoadingState label="Loading settings…" />
  if (project.isError || !project.data) return <ErrorState message={getApiErrorMessage(project.error)} />
  if (!project.data.capabilities.can_update) return <Alert>You have read-only access to this project. Project PM privileges are required to change settings.</Alert>
  return <div className="space-y-8"><section className="rounded-xl border bg-card p-5 sm:p-6"><h2 className="text-xl font-semibold">Project settings</h2><p className="mt-1 mb-6 text-sm text-muted-foreground">Update scope, timeline, budget, methodology, and status.</p><ProjectForm project={project.data} portfolios={portfolios.data?.items ?? []} isLoading={updateMutation.isPending} error={updateMutation.isError ? getApiErrorMessage(updateMutation.error) : null} onSubmit={async (body: ProjectUpdate) => { await updateMutation.mutateAsync({ id, body }) }} /></section>{project.data.capabilities.can_delete && <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 sm:p-6"><h2 className="text-lg font-semibold text-destructive">Danger zone</h2><p className="mt-2 text-sm text-muted-foreground">Soft-delete this project. Restore is not available in Phase 1.</p><Button variant="destructive" className="mt-5 sm:w-auto" onClick={() => setConfirmDelete(true)}>Delete project</Button></section>}<Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete project" description="The project will disappear for every member." className="max-w-lg">{deleteMutation.isError && <Alert className="mb-4">{getApiErrorMessage(deleteMutation.error)}</Alert>}<p className="text-sm text-muted-foreground">Delete <strong className="text-foreground">{project.data.name}</strong>?</p><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button variant="outline" className="sm:w-auto" onClick={() => setConfirmDelete(false)}>Cancel</Button><Button variant="destructive" className="sm:w-auto" isLoading={deleteMutation.isPending} onClick={async () => { await deleteMutation.mutateAsync(id); router.push('/projects') }}>Delete project</Button></div></Modal></div>
}
