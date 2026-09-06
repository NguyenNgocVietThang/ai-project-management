'use client'

import { UserPlus } from 'lucide-react'
import { useNumericParam } from '@/hooks/useNumericParam'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { InviteMemberDialog } from '@/features/projects/components/InviteMemberDialog'
import { ProjectMembersTable } from '@/features/projects/components/ProjectMembersTable'
import { useAddProjectMember, useProjectMembers, useRemoveProjectMember } from '@/features/projects/hooks/useProjectMembers'
import { useProjectDetail } from '@/features/projects/hooks/useProjects'
import { getApiErrorMessage } from '@/types/api.types'
import type { ProjectMemberCreate } from '@/types/project.types'

export default function ProjectMembersPage() {
  const id = useNumericParam()
  const [inviting, setInviting] = useState(false)
  const project = useProjectDetail(id)
  const members = useProjectMembers(id)
  const addMutation = useAddProjectMember(id)
  const removeMutation = useRemoveProjectMember(id)
  if (project.isLoading || members.isLoading) return <LoadingState label="Loading members…" />
  if (project.isError || !project.data) return <ErrorState message={getApiErrorMessage(project.error)} />
  if (members.isError) return <ErrorState message={getApiErrorMessage(members.error)} />
  return <div className="space-y-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-semibold">Project members</h2><p className="mt-1 text-sm text-muted-foreground">People with access and their project-specific roles.</p></div>{project.data.capabilities.can_manage_members && <Button className="sm:w-auto" onClick={() => setInviting(true)}><UserPlus className="h-4 w-4" />Invite member</Button>}</div><ProjectMembersTable members={members.data ?? []} canManage={project.data.capabilities.can_manage_members} isRemoving={removeMutation.isPending} error={removeMutation.isError ? getApiErrorMessage(removeMutation.error) : null} onRemove={async (userId) => { await removeMutation.mutateAsync(userId) }} /><InviteMemberDialog open={inviting} onClose={() => setInviting(false)} isLoading={addMutation.isPending} error={addMutation.isError ? getApiErrorMessage(addMutation.error) : null} onInvite={async (body: ProjectMemberCreate) => { await addMutation.mutateAsync(body) }} /></div>
}
