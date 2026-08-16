'use client'

/**
 * RecentActivityFeed – timeline feed of latest audit log events
 */
import { formatDistanceToNow, parseISO } from 'date-fns'
import { Activity } from 'lucide-react'
import { formatStatus } from '@/lib/format'
import type { RecentActivityItem } from '@/features/dashboard/types/dashboard.types'

const ENTITY_COLOR: Record<string, string> = {
  Task: 'bg-blue-500',
  Project: 'bg-violet-500',
  Phase: 'bg-emerald-500',
  Sprint: 'bg-amber-500',
  Milestone: 'bg-rose-500',
}

function timeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
  } catch {
    return dateStr
  }
}

function ActivityRow({ item }: { item: RecentActivityItem }) {
  const color = ENTITY_COLOR[item.entity_type] ?? 'bg-gray-400'
  return (
    <div className="flex gap-3 py-2.5">
      <div className="flex flex-col items-center">
        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${color}`} />
        <span className="mt-1.5 w-px flex-1 bg-border" />
      </div>
      <div className="min-w-0 pb-2">
        <p className="text-sm text-foreground">
          {item.description || formatStatus(item.action)}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          <span className="font-medium">{item.actor_name ?? 'System'}</span>
          {' · '}
          <span className="capitalize">{item.entity_type}</span>
          {' · '}
          {timeAgo(item.created_at)}
        </p>
      </div>
    </div>
  )
}

interface RecentActivityFeedProps {
  items: RecentActivityItem[]
}

export function RecentActivityFeed({ items }: RecentActivityFeedProps) {
  return (
    <section className="rounded-xl border bg-card">
      <div className="flex items-center gap-2 border-b px-5 py-3.5">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Recent Activity</h2>
      </div>
      <div className="px-5">
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No recent activity</p>
        ) : (
          items.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))
        )}
      </div>
    </section>
  )
}
