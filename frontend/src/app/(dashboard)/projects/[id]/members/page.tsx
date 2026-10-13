'use client'

import { UserPlus } from 'lucide-react'
import { useNumericParam } from '@/hooks/useNumericParam'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { SectionHeader } from '@/components/ui/PageHeader'
import { InviteMemberDialog } from '@/features/projects/components/InviteMemberDialog'
import { ProjectMembersTable } from '@/features/projects/components/ProjectMembersTable'
import { useAddProjectMember, useProjectMembers, useRemoveProjectMember } from '@/features/projects/hooks/useProjectMembers'
import { useProjectDetail } from '@/features/projects/hooks/useProjects'
import { getApiErrorMessage } from '@/types/api.types'
import type { ProjectMemberCreate } from '@/types/project.types'

/** Tab thành viên dự án: danh sách quyền truy cập và nút mời thành viên (CTA chính). */
export default function ProjectMembersPage() {
  const id = useNumericParam()
  const [inviting, setInviting] = useState(false)
  const project = useProjectDetail(id)
  const members = useProjectMembers(id)
  const addMutation = useAddProjectMember(id)
  const removeMutation = useRemoveProjectMember(id)
  if (project.isLoading || members.isLoading) return <LoadingState variant="table" label="Loading members…" />
  if (project.isError || !project.data) return <ErrorState message={getApiErrorMessage(project.error)} onRetry={() => void project.refetch()} />
  if (members.isError) return <ErrorState message={getApiErrorMessage(members.error)} onRetry={() => void members.refetch()} />
  const canManage = project.data.capabilities.can_manage_members
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Project members"
        description="People with access and their project-specific roles."
        className="mb-0 flex-col sm:flex-row sm:items-end"
        action={canManage && (
          <Button fullWidth={false} onClick={() => setInviting(true)}>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Invite member
          </Button>
        )}
      />
      <ProjectMembersTable
        members={members.data ?? []}
        canManage={canManage}
        isRemoving={removeMutation.isPending}
        error={removeMutation.isError ? getApiErrorMessage(removeMutation.error) : null}
        onRemove={async (userId) => { await removeMutation.mutateAsync(userId) }}
      />
      <InviteMemberDialog
        open={inviting}
        onClose={() => setInviting(false)}
        isLoading={addMutation.isPending}
        error={addMutation.isError ? getApiErrorMessage(addMutation.error) : null}
        onInvite={async (body: ProjectMemberCreate) => { await addMutation.mutateAsync(body) }}
      />
    </div>
  )
}
