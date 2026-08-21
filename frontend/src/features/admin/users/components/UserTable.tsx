'use client'

import { Pencil, RotateCcw, UserX } from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import { EmptyState } from '@/components/common/PageState'
import { formatDate } from '@/lib/format'
import type { AdminUser } from '@/types/admin.types'

export function UserTable({
  users,
  currentUserId,
  onEdit,
  onDeactivate,
  onReactivate,
}: {
  users: AdminUser[]
  currentUserId: number | undefined
  onEdit: (user: AdminUser) => void
  onDeactivate: (user: AdminUser) => void
  onReactivate: (user: AdminUser) => Promise<void>
}) {
  if (users.length === 0) {
    return <EmptyState title="No users found" description="Create a user or adjust the current filters." />
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Roles</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={user.full_name} src={user.avatar_url} />
                  <div>
                    <p className="font-medium">
                      {user.full_name}
                      {user.is_superuser && (
                        <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] uppercase text-primary">
                          Superuser
                        </span>
                      )}
                      {user.id === currentUserId && (
                        <span className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-[10px] uppercase text-secondary-foreground">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {user.roles.length === 0 && <span className="text-xs text-muted-foreground">No roles</span>}
                  {user.roles.map((role) => (
                    <span key={role.id} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                      {role.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    user.is_active
                      ? 'rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground'
                  }
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(user.created_at)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                    aria-label={`Edit ${user.full_name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  {user.is_active ? (
                    <button
                      type="button"
                      onClick={() => onDeactivate(user)}
                      disabled={user.id === currentUserId}
                      className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-40"
                      aria-label={`Deactivate ${user.full_name}`}
                    >
                      <UserX className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onReactivate(user)}
                      className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label={`Reactivate ${user.full_name}`}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
