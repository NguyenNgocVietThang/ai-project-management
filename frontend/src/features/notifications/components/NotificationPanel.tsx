'use client'
import { useTranslations } from 'next-intl'

import Link from 'next/link'

import { Bell, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import { buttonClasses } from '@/components/common/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import { useDeleteNotification, useMarkAllRead, useMarkRead, useNotifications } from '../hooks/useNotifications'
import { NotificationItem } from './NotificationItem'

interface Props {
  onClose?: () => void
}

export function NotificationPanel({ onClose: _onClose }: Props) {
  const [unreadOnly, setUnreadOnly] = useState(false)
  const t = useTranslations('notifications')
  const tCommon = useTranslations('common')
  const { data, isLoading } = useNotifications({ unread_only: unreadOnly, page_size: 30 })
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()
  const deleteNotif = useDeleteNotification()

  return (
    <div className="flex max-h-[min(540px,calc(100vh-6rem))] w-full flex-col">
      {/* Phần đầu */}
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Bell className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="truncate text-body-sm font-semibold">{t('title')}</span>
          {data && data.unread_count > 0 && (
            <Badge tone="primary" size="sm" className="tabular-nums">
              {data.unread_count}
            </Badge>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {/* Nút bật/tắt lọc chưa đọc */}
          <button
            id="notif-toggle-unread"
            type="button"
            aria-pressed={unreadOnly}
            onClick={() => setUnreadOnly((p) => !p)}
            className={cn(
              buttonClasses({ variant: unreadOnly ? 'secondary' : 'ghost', size: 'sm' }),
              'min-h-8 px-2 text-caption',
              unreadOnly ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {t('unreadOnly')}
          </button>
          {/* Đánh dấu tất cả đã đọc */}
          {data && data.unread_count > 0 && (
            <button
              id="notif-mark-all-read"
              type="button"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              title={t('markAllRead')}
              aria-label={t('markAllRead')}
              className={buttonClasses({ variant: 'ghost', size: 'icon', className: 'h-8 w-8 text-muted-foreground' })}
            >
              <CheckCheck className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Danh sách */}
      <div className="flex-1 divide-y overflow-y-auto">
        {isLoading && (
          <SkeletonRegion label={tCommon('loading')} className="divide-y">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-3 px-4 py-3">
                <Skeleton className="h-8 w-8 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </SkeletonRegion>
        )}
        {!isLoading && (!data || data.items.length === 0) && (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
              <Bell className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
            </span>
            <p className="mt-4 text-body-sm font-medium text-foreground">
              {unreadOnly ? t('nothingUnread') : t('empty')}
            </p>
            <p className="mt-1 text-caption text-muted-foreground">{t('emptyMessage')}</p>
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
      {/* Dropdown chỉ giữ được vài mục gần nhất; đường dẫn tới lịch sử đầy đủ. */}
      <div className="border-t px-4 py-2 text-center">
        <Link
          href="/notifications"
          onClick={_onClose}
          className="inline-flex min-h-9 items-center text-caption font-medium text-primary hover:underline"
        >
          {data && data.total > data.items.length
            ? t('viewAllCount', { total: data.total })
            : t('viewAll')}
        </Link>
      </div>
    </div>
  )
}
