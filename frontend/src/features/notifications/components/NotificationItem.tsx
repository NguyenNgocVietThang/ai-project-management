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
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { buttonClasses } from '@/components/common/Button'
import { cn } from '@/lib/utils'
import type { NotificationItem, NotificationType } from '../types/notification.types'

interface Props {
  notification: NotificationItem
  onMarkRead?: (id: number) => void
  onDelete?: (id: number) => void
}

// Tông màu ngữ nghĩa cho ô biểu tượng (nền nhạt + chữ đậm), lấy từ token để
// tự đổi theo sáng/tối thay vì hard-code bảng màu Tailwind.
const TONE_CLASSES = {
  info: 'bg-info-soft text-info',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-destructive/10 text-destructive',
  success: 'bg-success-soft text-success',
  primary: 'bg-accent text-accent-foreground',
  neutral: 'bg-muted text-muted-foreground',
} as const

const TYPE_META: Record<NotificationType, { Icon: LucideIcon; tone: keyof typeof TONE_CLASSES }> = {
  TASK_ASSIGNED: { Icon: UserCheck, tone: 'info' },
  TASK_DUE_SOON: { Icon: Clock3, tone: 'warning' },
  TASK_OVERDUE: { Icon: AlertTriangle, tone: 'danger' },
  CR_SUBMITTED: { Icon: FileText, tone: 'primary' },
  CR_APPROVED: { Icon: CheckCircle2, tone: 'success' },
  CR_REJECTED: { Icon: X, tone: 'danger' },
  CR_NEEDS_REVIEW: { Icon: FileText, tone: 'warning' },
  CRITICAL_PATH_CHANGED: { Icon: AlertTriangle, tone: 'warning' },
  RESOURCE_OVERLOADED: { Icon: AlertTriangle, tone: 'danger' },
  AI_JOB_COMPLETED: { Icon: Bot, tone: 'primary' },
  RISK_HIGH: { Icon: AlertTriangle, tone: 'danger' },
  MENTION: { Icon: Megaphone, tone: 'info' },
  SYSTEM: { Icon: Bell, tone: 'neutral' },
}

// Nút hành động nhỏ gọn trong danh sách dày đặc.
const ACTION_BUTTON = buttonClasses({ variant: 'ghost', size: 'icon', className: 'h-8 w-8 text-muted-foreground' })

export function NotificationItem({ notification, onMarkRead, onDelete }: Props) {
  const meta = TYPE_META[notification.notification_type] ?? TYPE_META.SYSTEM
  const { Icon } = meta
  const timeAgo = formatDistanceToNow(parseISO(notification.created_at), { addSuffix: true })
  const unread = !notification.is_read

  const inner = (
    <div
      className={cn(
        'group relative flex gap-3 px-4 py-3 transition-colors hover:bg-muted/40',
        unread && 'bg-accent/40'
      )}
    >
      {/* Thanh chỉ báo chưa đọc ở mép trái */}
      {unread && <span className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-primary" aria-hidden="true" />}

      {/* Biểu tượng theo loại thông báo */}
      <span
        className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', TONE_CLASSES[meta.tone])}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </span>

      {/* Nội dung */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-body-sm',
              unread ? 'font-semibold text-foreground' : 'text-muted-foreground'
            )}
          >
            {notification.title}
          </p>
          {/* focus-within cùng với group-hover: nếu chỉ ẩn theo hover thì người
              dùng bàn phím không bao giờ nhìn thấy các nút này, dù vẫn tab tới được. */}
          <div className="-my-1 flex shrink-0 items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100">
            {unread && onMarkRead && (
              <button
                id={`notif-mark-read-${notification.id}`}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  onMarkRead(notification.id)
                }}
                className={ACTION_BUTTON}
                title="Mark as read"
                aria-label="Mark as read"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            {onDelete && (
              <button
                id={`notif-delete-${notification.id}`}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  onDelete(notification.id)
                }}
                className={cn(ACTION_BUTTON, 'hover:bg-destructive/10 hover:text-destructive')}
                title="Delete"
                aria-label="Delete"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        <p className="mt-1 line-clamp-2 text-caption text-muted-foreground">{notification.message}</p>
        <p className="mt-1 text-caption text-muted-foreground/80">{timeAgo}</p>
      </div>
    </div>
  )

  return notification.link ? (
    <Link
      href={notification.link}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
    >
      {inner}
    </Link>
  ) : (
    <div>{inner}</div>
  )
}
