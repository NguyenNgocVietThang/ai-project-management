'use client'

import { useLocale, useTranslations } from 'next-intl'

/**
 * MyTasksList – các task được giao cho người dùng hiện tại (chưa hoàn thành)
 * Hiển thị tối đa 20 task, kèm badge quá hạn và mức nghiêm trọng
 */
import Link from 'next/link'
import { AlertTriangle, Flag } from 'lucide-react'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Card, CardTitle } from '@/components/ui/Card'
import { formatDate, formatStatus } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { MyTaskItem } from '@/features/dashboard/types/dashboard.types'

// Mức ưu tiên -> tông màu ngữ nghĩa của Badge
const PRIORITY_TONE: Record<string, BadgeTone> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'neutral',
}

// Trạng thái task -> màu chấm tròn theo token
const STATUS_DOT: Record<string, string> = {
  todo: 'bg-muted-foreground',
  in_progress: 'bg-info',
  in_review: 'bg-warning',
  done: 'bg-success',
  blocked: 'bg-destructive',
}

function TaskRow({ task }: { task: MyTaskItem }) {
  const locale = useLocale()
  const t = useTranslations('dashboard')
  return (
    <Link
      href={`/projects/${task.project_id}/tasks`}
      className="group flex min-h-11 items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        aria-hidden="true"
        className={cn('mt-2 h-2 w-2 shrink-0 rounded-full', STATUS_DOT[task.status.toLowerCase()] ?? 'bg-muted-foreground')}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm font-medium text-foreground transition-colors group-hover:text-primary">
          {task.name}
        </p>
        <p className="mt-1 truncate text-caption text-muted-foreground">{task.project_name}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge size="sm" tone={PRIORITY_TONE[task.priority.toLowerCase()] ?? 'neutral'}>
          <Flag className="h-3 w-3" aria-hidden="true" />
          {formatStatus(task.priority, locale)}
        </Badge>
        {task.is_overdue && (
          <span className="flex items-center gap-1 text-caption font-medium text-destructive">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            {task.due_date ? formatDate(task.due_date, locale) : t('overdue')}
          </span>
        )}
        {!task.is_overdue && task.due_date && (
          <span className="text-caption text-muted-foreground">{formatDate(task.due_date, locale)}</span>
        )}
      </div>
    </Link>
  )
}

interface MyTasksListProps {
  tasks: MyTaskItem[]
}

export function MyTasksList({ tasks }: MyTasksListProps) {
  const t = useTranslations('home')
  return (
    <Card as="section" flush className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-4 sm:px-6">
        <CardTitle>{t('myTasks')}</CardTitle>
        <Badge tone="primary" size="sm" className="tabular-nums">{tasks.length}</Badge>
      </div>
      <div className="divide-y">
        {tasks.length === 0 ? (
          <p className="p-8 text-center text-body-sm text-muted-foreground">
            {t('noTasks')}
          </p>
        ) : (
          tasks.map((t) => (
            <div key={t.id} className="px-2 py-1 sm:px-3">
              <TaskRow task={t} />
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
