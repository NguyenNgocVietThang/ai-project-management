'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { EmptyState } from '@/components/common/PageState'
import type { Role } from '@/types/admin.types'

const PROTECTED_ROLE_NAME = 'Admin'

export function RoleTable({
  roles,
  onEdit,
  onDelete,
}: {
  roles: Role[]
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}) {
  if (roles.length === 0) {
    return <EmptyState title="No roles found" description="Create a role to get started." />
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Permissions</th>
            <th className="px-4 py-3">Users</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => {
            const isProtected = role.name === PROTECTED_ROLE_NAME
            const canDelete = !isProtected && role.user_count === 0
            return (
              <tr key={role.id} className="border-t">
                <td className="px-4 py-3">
                  <p className="font-medium">{role.name}</p>
                  {role.description && <p className="text-xs text-muted-foreground">{role.description}</p>}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{role.permissions.length} permissions</td>
                <td className="px-4 py-3 text-muted-foreground">{role.user_count}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(role)}
                      className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label={`Edit ${role.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(role)}
                      disabled={!canDelete}
                      title={
                        isProtected
                          ? 'The built-in Admin role cannot be deleted'
                          : role.user_count > 0
                            ? 'Reassign every user before deleting this role'
                            : undefined
                      }
                      className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-40"
                      aria-label={`Delete ${role.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
