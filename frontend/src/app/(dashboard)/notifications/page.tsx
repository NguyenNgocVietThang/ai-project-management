'use client'
import { useTranslations } from 'next-intl'

import { BellOff, CheckCheck, ListFilter } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { NotificationItem } from '@/features/notifications/components/NotificationItem'
import {
  useDeleteNotification,
  useMarkAllRead,
  useMarkRead,
  useNotifications,
} from '@/features/notifications/hooks/useNotifications'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'

const PAGE_SIZE = 25

/**
 * Lịch sử thông báo đầy đủ, có phân trang.
 *
 * Trước đây chỉ có dropdown ở thanh header, giới hạn 30 mục và không có cách nào
 * xem xa hơn — thông báo cũ hơn thì đơn giản là không truy cập được.
 */
export default function NotificationsPage() {
  const getApiErrorMessage = useApiErrorMessage()
  const [page, setPage] = useState(1)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const t = useTranslations('notifications')
  const tCommon = useTranslations('common')

  const query = useNotifications({ page, page_size: PAGE_SIZE, unread_only: unreadOnly })
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()
  const remove = useDeleteNotification()

  const data = query.data
  const totalPages = Math.max(1, data?.total_pages ?? 1)
  const unreadCount = data?.unread_count ?? 0

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('title')}
        description={data ? t('unreadOf', { unread: unreadCount, total: data.total }) : undefined}
        actions={
          <>
            <Button
              variant="outline"
              fullWidth={false}
              aria-pressed={unreadOnly}
              onClick={() => {
                setUnreadOnly((current) => !current)
                setPage(1)
              }}
            >
              <ListFilter className="h-4 w-4" aria-hidden="true" />
              {unreadOnly ? t('showAll') : t('unreadOnly')}
            </Button>
            {unreadCount > 0 && (
              <Button fullWidth={false} isLoading={markAllRead.isPending} onClick={() => markAllRead.mutate()}>
                <CheckCheck className="h-4 w-4" aria-hidden="true" />
                {t('markAllRead')}
              </Button>
            )}
          </>
        }
      />

      {query.isLoading && <LoadingState variant="table" label={tCommon('loading')} />}
      {query.isError && (
        <ErrorState
          message={getApiErrorMessage(query.error)}
          onRetry={() => void query.refetch()}
          retryLabel={tCommon('retry')}
        />
      )}

      {data && data.items.length === 0 && (
        <EmptyState
          icon={BellOff}
          title={unreadOnly ? t('nothingUnread') : t('empty')}
          description={t('emptyMessage')}
          action={
            unreadOnly ? (
              <Button
                variant="outline"
                fullWidth={false}
                onClick={() => {
                  setUnreadOnly(false)
                  setPage(1)
                }}
              >
                {t('showAll')}
              </Button>
            ) : undefined
          }
        />
      )}

      {data && data.items.length > 0 && (
        <Card flush className="divide-y overflow-hidden">
          {data.items.map((item) => (
            <NotificationItem
              key={item.id}
              notification={item}
              onMarkRead={(id) => markRead.mutate(id)}
              onDelete={(id) => remove.mutate(id)}
            />
          ))}
        </Card>
      )}

      {data && totalPages > 1 && (
        <nav
          className="flex items-center justify-between gap-3 text-body-sm"
          aria-label={t('pages')}
        >
          <Button
            variant="outline"
            fullWidth={false}
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            {tCommon('previous')}
          </Button>
          <span className="text-center text-muted-foreground">
            {tCommon('page', { page, total: totalPages })}
          </span>
          <Button
            variant="outline"
            fullWidth={false}
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
