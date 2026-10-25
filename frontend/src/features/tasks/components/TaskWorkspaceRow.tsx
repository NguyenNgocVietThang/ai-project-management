'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Task, TaskPriority, TaskStatus } from '@/types/task.types'

const STATUS_TONE: Record<TaskStatus, BadgeTone> = { TODO: 'neutral', IN_PROGRESS: 'primary', IN_REVIEW: 'info', DONE: 'success', BLOCKED: 'danger' }
const PRIORITY_TONE: Record<TaskPriority, BadgeTone> = { LOW: 'neutral', MEDIUM: 'info', HIGH: 'warning', CRITICAL: 'danger' }

export function TaskWorkspaceRow({ task, onOpen, selected = false, onSelect }: { task: Task; onOpen: (id: number) => void; selected?: boolean; onSelect?: (checked: boolean) => void }) {
  const locale = useLocale()
  const t = useTranslations('tasks')
  const tc = useTranslations('common')
  return <li className={cn('flex min-w-0 gap-2 px-3 py-3 transition-colors hover:bg-muted/40 motion-reduce:transition-none sm:gap-3 sm:px-4', selected && 'bg-accent')}>
    {onSelect && <label className="flex min-h-11 w-8 shrink-0 items-start justify-center pt-1">
      <input type="checkbox" aria-label={t('selectTask', { name: task.name })} className="mt-0.5 h-4 w-4 accent-primary" disabled={!task.capabilities.can_update || !task.capabilities.can_change_status} checked={selected} onChange={event => onSelect(event.target.checked)} />
    </label>}
    <div className="min-w-0 flex-1">
      <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-3">
        <button type="button" className="min-w-0 rounded text-left text-body-sm font-semibold [overflow-wrap:anywhere] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => onOpen(task.id)}>{task.name}</button>
        <div className="flex shrink-0 flex-wrap gap-1.5">
          <Badge tone={STATUS_TONE[task.status]} size="sm" dot>{t(`statuses.${task.status}`)}</Badge>
          <Badge tone={PRIORITY_TONE[task.priority]} size="sm">{t(`priorities.${task.priority}`)}</Badge>
        </div>
      </div>
      <dl className="mt-2 flex min-w-0 flex-wrap gap-x-4 gap-y-1 text-caption text-muted-foreground">
        <div className="min-w-0 [overflow-wrap:anywhere]"><dt className="sr-only">{t('assignee')}</dt><dd>{task.primary_assignee?.full_name || tc('unassigned')}</dd></div>
        <div><dt className="inline">{t('due')}: </dt><dd className="inline tabular-nums">{task.due_date ? formatDate(task.due_date, locale) : t('noDate')}</dd></div>
        <div><dt className="inline">{t('hours')}: </dt><dd className="inline tabular-nums">{task.actual_hours.toFixed(1)} / {task.estimated_hours ?? 0}</dd></div>
      </dl>
    </div>
  </li>
}
