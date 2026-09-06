'use client'
import { useTranslations } from 'next-intl'

import { CheckCheck } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { NotificationItem } from '@/features/notifications/components/NotificationItem'
import {
  useDeleteNotification,
  useMarkAllRead,
  useMarkRead,
  useNotifications,
} from '@/features/notifications/hooks/useNotifications'
import { getApiErrorMessage } from '@/types/api.types'

const PAGE_SIZE = 25

/**
 * Lịch sử thông báo đầy đủ, có phân trang.
 *
 * Trước đây chỉ có dropdown ở thanh header, giới hạn 30 mục và không có cách nào
 * xem xa hơn — thông báo cũ hơn thì đơn giản là không truy cập được.
 */
export default function NotificationsPage() {
  const [page, setPage] = useState(1)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const t = useTranslations('notifications')
  const tCommon = useTranslations('common')

  const query = useNotifications({ page, page_size: PAGE_SIZE, unread_only: unreadOnly })
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()
  const remove = useDeleteNotification()

  if (query.isLoading) return <LoadingState label="Loading notifications…" />
  if (query.isError) return <ErrorState message={getApiErrorMessage(query.error)} />

  const data = query.data
  const totalPages = Math.max(1, data?.total_pages ?? 1)

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('unreadOf', { unread: data?.unread_count ?? 0, total: data?.total ?? 0 })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="w-auto"
            aria-pressed={unreadOnly}
            onClick={() => {
              setUnreadOnly((current) => !current)
              setPage(1)
            }}
          >
            {unreadOnly ? t('showAll') : t('unreadOnly')}
          </Button>
          {(data?.unread_count ?? 0) > 0 && (
            <Button
              className="w-auto"
              isLoading={markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
            >
              <CheckCheck className="h-4 w-4" aria-hidden="true" />
              {t('markAllRead')}
            </Button>
          )}
        </div>
      </header>

      {!data || data.items.length === 0 ? (
        <EmptyState
          title={unreadOnly ? t('nothingUnread') : t('empty')}
          description={t('emptyMessage')}
        />
      ) : (
        <div className="divide-y rounded-xl border bg-card">
          {data.items.map((item) => (
            <NotificationItem
              key={item.id}
              notification={item}
              onMarkRead={(id) => markRead.mutate(id)}
              onDelete={(id) => remove.mutate(id)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          className="flex items-center justify-between gap-3 text-sm"
          aria-label={t('pages')}
        >
          <Button
            variant="outline"
            className="w-auto"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            {tCommon('previous')}
          </Button>
          <span className="text-muted-foreground">
            {tCommon('page', { page, total: totalPages })}
          </span>
          <Button
            variant="outline"
            className="w-auto"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            {tCommon('next')}
          </Button>
        </nav>
      )}
    </div>
  )
}
