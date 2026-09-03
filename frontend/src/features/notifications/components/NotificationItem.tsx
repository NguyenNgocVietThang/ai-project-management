'use client'

import { formatDistanceToNow, parseISO } from 'date-fns'
import {
  AlertTriangle,
  Bell,
  Bot,
  CheckCircle2,
  Clock3,
  FileText,
  Megaphone,
  UserCheck,
  X,
} from 'lucide-react'
import Link from 'next/link'
import type { NotificationItem, NotificationType } from '../types/notification.types'

interface Props {
  notification: NotificationItem
  onMarkRead?: (id: number) => void
  onDelete?: (id: number) => void
}

const TYPE_META: Record<
  NotificationType,
  { icon: React.ReactNode; color: string }
> = {
  TASK_ASSIGNED: {
    icon: <UserCheck className="h-4 w-4" />,
    color: 'text-blue-500',
  },
  TASK_DUE_SOON: {
    icon: <Clock3 className="h-4 w-4" />,
    color: 'text-amber-500',
  },
  TASK_OVERDUE: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'text-red-500',
  },
  CR_SUBMITTED: { icon: <FileText className="h-4 w-4" />, color: 'text-purple-500' },
  CR_APPROVED: { icon: <CheckCircle2 className="h-4 w-4" />, color: 'text-green-500' },
  CR_REJECTED: { icon: <X className="h-4 w-4" />, color: 'text-red-500' },
  CR_NEEDS_REVIEW: { icon: <FileText className="h-4 w-4" />, color: 'text-amber-500' },
  CRITICAL_PATH_CHANGED: { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-orange-500' },
  RESOURCE_OVERLOADED: { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-red-500' },
  AI_JOB_COMPLETED: { icon: <Bot className="h-4 w-4" />, color: 'text-violet-500' },
  RISK_HIGH: { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-red-600' },
  MENTION: { icon: <Megaphone className="h-4 w-4" />, color: 'text-sky-500' },
  SYSTEM: { icon: <Bell className="h-4 w-4" />, color: 'text-gray-500' },
}

export function NotificationItem({ notification, onMarkRead, onDelete }: Props) {
  const meta = TYPE_META[notification.notification_type] ?? TYPE_META.SYSTEM
  const timeAgo = formatDistanceToNow(parseISO(notification.created_at), { addSuffix: true })

  const inner = (
    <div
      className={`group flex gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent ${
        notification.is_read ? 'opacity-70' : ''
      }`}
    >
      {/* Biểu tượng */}
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background ${meta.color}`}
      >
        {meta.icon}
      </span>

      {/* Nội dung */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${notification.is_read ? '' : 'font-semibold'}`}>
            {notification.title}
          </p>
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {!notification.is_read && onMarkRead && (
              <button
                id={`notif-mark-read-${notification.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  onMarkRead(notification.id)
                }}
                className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                title="Mark as read"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                id={`notif-delete-${notification.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  onDelete(notification.id)
                }}
                className="rounded p-0.5 text-muted-foreground hover:text-destructive"
                title="Delete"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{notification.message}</p>
        <p className="mt-1 text-[10px] text-muted-foreground/70">{timeAgo}</p>
      </div>

      {/* Chấm chưa đọc */}
      {!notification.is_read && (
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </div>
  )

  return notification.link ? (
    <Link href={notification.link}>{inner}</Link>
  ) : (
    <div>{inner}</div>
  )
}
