'use client'

import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { DeactivateUserDialog } from '@/features/admin/users/components/DeactivateUserDialog'
import { UserForm } from '@/features/admin/users/components/UserForm'
import { UserTable } from '@/features/admin/users/components/UserTable'
import {
  useAdminUsers,
  useCreateAdminUser,
  useDeactivateAdminUser,
  useReactivateAdminUser,
  useUpdateAdminUser,
} from '@/features/admin/users/hooks/useAdminUsers'
import { useAdminRoles } from '@/features/admin/roles/hooks/useAdminRoles'
import { useAuth } from '@/hooks/useAuth'
import { getApiErrorMessage } from '@/types/api.types'
import type { AdminUser, AdminUserCreate, AdminUserUpdate } from '@/types/admin.types'

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [search, setSearch] = useState('')
  const [roleId, setRoleId] = useState<number | ''>('')
  const [isActive, setIsActive] = useState<'' | 'true' | 'false'>('')
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [deactivating, setDeactivating] = useState<AdminUser | null>(null)

  const rolesQuery = useAdminRoles()
  const query = useAdminUsers({
    page_size: 100,
    q: search || undefined,
    role_id: roleId || undefined,
    is_active: isActive === '' ? undefined : isActive === 'true',
  })
  const createMutation = useCreateAdminUser()
  const updateMutation = useUpdateAdminUser()
  const deactivateMutation = useDeactivateAdminUser()
  const reactivateMutation = useReactivateAdminUser()

  const roles = rolesQuery.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Users</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create accounts, assign roles, and activate or deactivate access.
          </p>
        </div>
        <Button className="sm:w-auto" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          New user
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Search users"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
            placeholder="Search by name, username, or email"
          />
        </div>
        <select
          aria-label="Filter by role"
          value={roleId}
          onChange={(event) => setRoleId(event.target.value ? Number(event.target.value) : '')}
          className="h-11 rounded-md border bg-background px-3 text-sm sm:w-48"
        >
          <option value="">All roles</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by status"
          value={isActive}
          onChange={(event) => setIsActive(event.target.value as '' | 'true' | 'false')}
          className="h-11 rounded-md border bg-background px-3 text-sm sm:w-40"
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {query.isLoading && <LoadingState label="Loading users…" />}
      {query.isError && <ErrorState message={getApiErrorMessage(query.error)} />}
      {query.data && (
        <UserTable
          users={query.data.items}
          currentUserId={currentUser?.id}
          onEdit={setEditing}
          onDeactivate={setDeactivating}
          onReactivate={async (user) => {
            await reactivateMutation.mutateAsync(user.id)
          }}
        />
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New user"
        description="Create an account and assign it to one or more roles."
      >
        <UserForm
          roles={roles}
          onCancel={() => setCreating(false)}
          isLoading={createMutation.isPending}
          error={createMutation.isError ? getApiErrorMessage(createMutation.error) : null}
          onSubmit={async (body) => {
            await createMutation.mutateAsync(body as AdminUserCreate)
            setCreating(false)
          }}
        />
      </Modal>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit user"
        description="Update profile details, role assignment, and account status."
      >
        {editing && (
          <UserForm
            user={editing}
            roles={roles}
            onCancel={() => setEditing(null)}
            isLoading={updateMutation.isPending}
            error={updateMutation.isError ? getApiErrorMessage(updateMutation.error) : null}
            onSubmit={async (body) => {
              await updateMutation.mutateAsync({ id: editing.id, body: body as AdminUserUpdate })
              setEditing(null)
            }}
          />
        )}
      </Modal>

      <DeactivateUserDialog
        user={deactivating}
        onClose={() => setDeactivating(null)}
        isLoading={deactivateMutation.isPending}
        error={deactivateMutation.isError ? getApiErrorMessage(deactivateMutation.error) : null}
        onConfirm={async () => {
          if (deactivating) {
            await deactivateMutation.mutateAsync(deactivating.id)
            setDeactivating(null)
          }
        }}
      />
    </div>
  )
}
