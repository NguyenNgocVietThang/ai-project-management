'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { DeleteRoleDialog } from '@/features/admin/roles/components/DeleteRoleDialog'
import { RoleForm } from '@/features/admin/roles/components/RoleForm'
import { RoleTable } from '@/features/admin/roles/components/RoleTable'
import { useAdminRoles, useCreateRole, useDeleteRole, useUpdateRole } from '@/features/admin/roles/hooks/useAdminRoles'
import { getApiErrorMessage } from '@/types/api.types'
import type { Role, RoleCreate, RoleUpdate } from '@/types/admin.types'

export default function AdminRolesPage() {
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Role | null>(null)
  const [deleting, setDeleting] = useState<Role | null>(null)

  const query = useAdminRoles()
  const createMutation = useCreateRole()
  const updateMutation = useUpdateRole()
  const deleteMutation = useDeleteRole()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Roles &amp; permissions</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Compose roles from the fixed permission catalog and see who holds each one.
          </p>
        </div>
        <Button className="sm:w-auto" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          New role
        </Button>
      </div>

      {query.isLoading && <LoadingState label="Loading roles…" />}
      {query.isError && <ErrorState message={getApiErrorMessage(query.error)} />}
      {query.data && <RoleTable roles={query.data} onEdit={setEditing} onDelete={setDeleting} />}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New role"
        description="Name the role and choose which permissions it grants."
      >
        <RoleForm
          onCancel={() => setCreating(false)}
          isLoading={createMutation.isPending}
          error={createMutation.isError ? getApiErrorMessage(createMutation.error) : null}
          onSubmit={async (body) => {
            await createMutation.mutateAsync(body as RoleCreate)
            setCreating(false)
          }}
        />
      </Modal>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit role"
        description="Update the role name, description, or permission set."
      >
        {editing && (
          <RoleForm
            role={editing}
            onCancel={() => setEditing(null)}
            isLoading={updateMutation.isPending}
            error={updateMutation.isError ? getApiErrorMessage(updateMutation.error) : null}
            onSubmit={async (body) => {
              await updateMutation.mutateAsync({ id: editing.id, body: body as RoleUpdate })
              setEditing(null)
            }}
          />
        )}
      </Modal>

      <DeleteRoleDialog
        role={deleting}
        onClose={() => setDeleting(null)}
        isLoading={deleteMutation.isPending}
        error={deleteMutation.isError ? getApiErrorMessage(deleteMutation.error) : null}
        onConfirm={async () => {
          if (deleting) {
            await deleteMutation.mutateAsync(deleting.id)
            setDeleting(null)
          }
        }}
      />
    </div>
  )
}
