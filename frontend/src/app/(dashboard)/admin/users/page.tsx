'use client'

import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
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

  const hasFilters = Boolean(search || roleId || isActive)

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Users"
        description="Create accounts, assign roles, and activate or deactivate access."
        actions={
          <Button fullWidth={false} onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New user
          </Button>
        }
      />

      {/* Thanh bộ lọc: tìm kiếm chiếm phần lớn, hai select cố định độ rộng trên desktop */}
      <Card className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_10rem]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            aria-label="Search users"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
            placeholder="Search by name, username, or email"
          />
        </div>
        <Select
          aria-label="Filter by role"
          value={roleId}
          onChange={(event) => setRoleId(event.target.value ? Number(event.target.value) : '')}
        >
          <option value="">All roles</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter by status"
          value={isActive}
          onChange={(event) => setIsActive(event.target.value as '' | 'true' | 'false')}
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>
      </Card>

      {query.isLoading && <LoadingState variant="table" label="Loading users…" />}
      {query.isError && (
        <ErrorState message={getApiErrorMessage(query.error)} onRetry={() => void query.refetch()} />
      )}
      {query.data && (
        <UserTable
          users={query.data.items}
          currentUserId={currentUser?.id}
          onEdit={setEditing}
          onDeactivate={setDeactivating}
          onReactivate={async (user) => {
            await reactivateMutation.mutateAsync(user.id)
          }}
          emptyAction={
            hasFilters ? (
              <Button
                variant="outline"
                fullWidth={false}
                onClick={() => {
                  setSearch('')
                  setRoleId('')
                  setIsActive('')
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button fullWidth={false} onClick={() => setCreating(true)}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                New user
              </Button>
            )
          }
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
