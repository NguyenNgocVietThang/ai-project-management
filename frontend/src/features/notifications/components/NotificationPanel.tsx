'use client'

import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useDeleteNotification, useMarkAllRead, useMarkRead, useNotifications } from '../hooks/useNotifications'
import { NotificationItem } from './NotificationItem'

interface Props {
  onClose?: () => void
}

export function NotificationPanel({ onClose: _onClose }: Props) {
  const [unreadOnly, setUnreadOnly] = useState(false)
  const { data, isLoading } = useNotifications({ unread_only: unreadOnly, page_size: 30 })
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()
  const deleteNotif = useDeleteNotification()

  return (
    <div className="flex flex-col" style={{ width: 380, maxHeight: 540 }}>
      {/* Phần đầu */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <span className="font-semibold">Notifications</span>
          {data && data.unread_count > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
              {data.unread_count}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Nút bật/tắt lọc chưa đọc */}
          <button
            id="notif-toggle-unread"
            onClick={() => setUnreadOnly((p) => !p)}
            className={`rounded px-2 py-1 text-xs transition-colors ${
              unreadOnly
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent'
            }`}
          >
            Unread
          </button>
          {/* Đánh dấu tất cả đã đọc */}
          {data && data.unread_count > 0 && (
            <button
              id="notif-mark-all-read"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              title="Mark all as read"
              className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <CheckCheck className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Danh sách */}
      <div className="flex-1 overflow-y-auto py-1">
        {isLoading && (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        {!isLoading && (!data || data.items.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Bell className="mb-3 h-8 w-8 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        )}
        {data?.items.map((n) => (
          <NotificationItem
            key={n.id}
            notification={n}
            onMarkRead={(id) => markRead.mutate(id)}
            onDelete={(id) => deleteNotif.mutate(id)}
          />
        ))}
      </div>

      {/* Chân trang */}
      {data && data.total > data.items.length && (
        <div className="border-t px-4 py-2.5 text-center">
          <span className="text-xs text-muted-foreground">
            Showing {data.items.length} of {data.total} notifications
          </span>
        </div>
      )}
    </div>
  )
}
