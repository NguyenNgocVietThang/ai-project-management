'use client'

/**
 * RecentActivityFeed – dòng thời gian các sự kiện audit log mới nhất
 */
import { formatDistanceToNow, parseISO } from 'date-fns'
import { useLocale, useTranslations } from 'next-intl'
import { vi, enUS } from 'date-fns/locale'
import { Activity } from 'lucide-react'
import { Card, CardTitle } from '@/components/ui/Card'
import { formatStatus } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { RecentActivityItem } from '@/features/dashboard/types/dashboard.types'

// Loại thực thể -> màu chấm theo token ngữ nghĩa
const ENTITY_COLOR: Record<string, string> = {
  Task: 'bg-info',
  Project: 'bg-primary',
  Phase: 'bg-success',
  Sprint: 'bg-warning',
  Milestone: 'bg-destructive',
}

function timeAgo(dateStr: string, locale: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: locale === 'vi' ? vi : enUS })
  } catch {
    return dateStr
  }
}

function ActivityRow({ item }: { item: RecentActivityItem }) {
  const locale = useLocale()
  const t = useTranslations('home')
  const color = ENTITY_COLOR[item.entity_type] ?? 'bg-muted-foreground'
  return (
    <div className="flex gap-3 py-2">
      <div className="flex flex-col items-center" aria-hidden="true">
        <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', color)} />
        <span className="mt-2 w-px flex-1 bg-border" />
      </div>
      <div className="min-w-0 pb-2">
        <p className="break-words text-body-sm text-foreground">
          {item.description || formatStatus(item.action)}
        </p>
        <p className="mt-1 text-caption text-muted-foreground">
          <span className="font-medium">{item.actor_name ?? t('system')}</span>
          {' · '}
          <span className="capitalize">{item.entity_type}</span>
          {' · '}
          {timeAgo(item.created_at, locale)}
        </p>
      </div>
    </div>
  )
}

interface RecentActivityFeedProps {
  items: RecentActivityItem[]
}

export function RecentActivityFeed({ items }: RecentActivityFeedProps) {
  const t = useTranslations('home')
  return (
    <Card as="section" flush className="overflow-hidden">
      <div className="flex items-center gap-2 border-b px-4 py-4 sm:px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Activity className="h-4 w-4 text-accent-foreground" aria-hidden="true" />
        </span>
        <CardTitle>{t('activity')}</CardTitle>
      </div>
      <div className="px-4 py-2 sm:px-6">
        {items.length === 0 ? (
          <p className="py-8 text-center text-body-sm text-muted-foreground">{t('noActivity')}</p>
        ) : (
          items.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))
        )}
      </div>
    </Card>
  )
}
