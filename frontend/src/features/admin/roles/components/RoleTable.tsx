'use client'

import { Lock, Pencil, ShieldCheck, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/PageState'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { Role } from '@/types/admin.types'

const PROTECTED_ROLE_NAME = 'Admin'

export function RoleTable({
  roles,
  onEdit,
  onDelete,
  emptyAction,
}: {
  roles: Role[]
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  /** CTA hiển thị khi chưa có vai trò nào. */
  emptyAction?: ReactNode
}) {
  if (roles.length === 0) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="No roles found"
        description="Create a role to get started."
        action={emptyAction}
      />
    )
  }

  return (
    <Card flush className="overflow-hidden">
      {/* Bảng tự cuộn bên trong wrapper, thead dính khi cuộn dọc */}
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full min-w-[720px] text-left text-body-sm">
          <thead className="sticky top-0 z-10 bg-card text-caption uppercase text-muted-foreground">
            <tr className="bg-muted/50">
              <th scope="col" className="px-4 py-3 font-medium">Role</th>
              <th scope="col" className="px-4 py-3 font-medium">Permissions</th>
              <th scope="col" className="px-4 py-3 font-medium">Users</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => {
              const isProtected = role.name === PROTECTED_ROLE_NAME
              const canDelete = !isProtected && role.user_count === 0
              return (
                <tr key={role.id} className="border-t transition-colors hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{role.name}</p>
                      {isProtected && (
                        <Badge tone="primary" size="sm">
                          <Lock className="h-3 w-3" aria-hidden="true" />
                          Built-in
                        </Badge>
                      )}
                    </div>
                    {role.description && <p className="mt-1 text-caption text-muted-foreground">{role.description}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="info">{role.permissions.length} permissions</Badge>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">{role.user_count}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        fullWidth={false}
                        onClick={() => onEdit(role)}
                        className="text-muted-foreground"
                        aria-label={`Edit ${role.name}`}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        fullWidth={false}
                        onClick={() => onDelete(role)}
                        disabled={!canDelete}
                        title={
                          isProtected
                            ? 'The built-in Admin role cannot be deleted'
                            : role.user_count > 0
                              ? 'Reassign every user before deleting this role'
                              : undefined
                        }
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Delete ${role.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
