'use client'

import { Pencil, RotateCcw, UserX, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/PageState'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/format'
import type { AdminUser } from '@/types/admin.types'

export function UserTable({
  users,
  currentUserId,
  onEdit,
  onDeactivate,
  onReactivate,
  emptyAction,
}: {
  users: AdminUser[]
  currentUserId: number | undefined
  onEdit: (user: AdminUser) => void
  onDeactivate: (user: AdminUser) => void
  onReactivate: (user: AdminUser) => Promise<void>
  /** CTA hiển thị khi danh sách rỗng (tạo mới hoặc xoá bộ lọc). */
  emptyAction?: ReactNode
}) {
  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No users found"
        description="Create a user or adjust the current filters."
        action={emptyAction}
      />
    )
  }

  return (
    <Card flush className="overflow-hidden">
      {/* Bảng tự cuộn ngang bên trong wrapper, trang không bị cuộn ngang trên mobile */}
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full min-w-[820px] text-left text-body-sm">
          {/* thead dính: nền card đặc bên dưới để hàng cuộn qua không lộ chữ */}
          <thead className="sticky top-0 z-10 bg-card text-caption uppercase text-muted-foreground">
            <tr className="bg-muted/50">
              <th scope="col" className="px-4 py-3 font-medium">User</th>
              <th scope="col" className="px-4 py-3 font-medium">Roles</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 font-medium">Joined</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t transition-colors hover:bg-muted/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.full_name} src={user.avatar_url} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{user.full_name}</p>
                        {user.is_superuser && (
                          <Badge tone="primary" size="sm">
                            Superuser
                          </Badge>
                        )}
                        {user.id === currentUserId && (
                          <Badge tone="neutral" size="sm">
                            You
                          </Badge>
                        )}
                      </div>
                      <p className="text-caption text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.length === 0 && <span className="text-caption text-muted-foreground">No roles</span>}
                    {user.roles.map((role) => (
                      <Badge key={role.id} tone="neutral">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={user.is_active ? 'success' : 'neutral'} dot>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(user.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      fullWidth={false}
                      onClick={() => onEdit(user)}
                      className="text-muted-foreground"
                      aria-label={`Edit ${user.full_name}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    {user.is_active ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        fullWidth={false}
                        onClick={() => onDeactivate(user)}
                        disabled={user.id === currentUserId}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Deactivate ${user.full_name}`}
                      >
                        <UserX className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        fullWidth={false}
                        onClick={() => onReactivate(user)}
                        className="text-muted-foreground"
                        aria-label={`Reactivate ${user.full_name}`}
                      >
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
