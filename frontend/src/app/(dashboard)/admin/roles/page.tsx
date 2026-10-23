'use client'

import { useTranslations } from 'next-intl'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { PageHeader } from '@/components/ui/PageHeader'
import { DeleteRoleDialog } from '@/features/admin/roles/components/DeleteRoleDialog'
import { RoleForm } from '@/features/admin/roles/components/RoleForm'
import { RoleTable } from '@/features/admin/roles/components/RoleTable'
import { useAdminRoles, useCreateRole, useDeleteRole, useUpdateRole } from '@/features/admin/roles/hooks/useAdminRoles'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'
import type { Role, RoleCreate, RoleUpdate } from '@/types/admin.types'

export default function AdminRolesPage() {
  const getApiErrorMessage = useApiErrorMessage()
  const tAccount = useTranslations('accountUi')
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Role | null>(null)
  const [deleting, setDeleting] = useState<Role | null>(null)

  const query = useAdminRoles()
  const createMutation = useCreateRole()
  const updateMutation = useUpdateRole()
  const deleteMutation = useDeleteRole()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={tAccount('admin')}
        title={tAccount('rolesPermissionsLabel')}
        description={tAccount('composeRolesFromTheFixedPermissionCatalogAndSeeWhoHoldsEachOne')}
        actions={
          <Button fullWidth={false} onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
             {tAccount('newRole')} </Button>
        }
      />

      {query.isLoading && <LoadingState variant="table" label={tAccount('loadingRoles')} />}
      {query.isError && (
        <ErrorState message={getApiErrorMessage(query.error)} onRetry={() => void query.refetch()} />
      )}
      {query.data && (
        <RoleTable
          roles={query.data}
          onEdit={setEditing}
          onDelete={setDeleting}
          emptyAction={
            <Button fullWidth={false} onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" aria-hidden="true" />
               {tAccount('newRole')} </Button>
          }
        />
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title={tAccount('newRole')}
        description={tAccount('nameTheRoleAndChooseWhichPermissionsItGrants')}
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
        title={tAccount('editRole')}
        description={tAccount('updateTheRoleNameDescriptionOrPermissionSet')}
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
