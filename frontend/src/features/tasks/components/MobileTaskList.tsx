'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import type { Task, TaskStatus } from '@/types/task.types'

const tones: Record<TaskStatus, BadgeTone> = { TODO: 'neutral', IN_PROGRESS: 'primary', IN_REVIEW: 'info', DONE: 'success', BLOCKED: 'danger' }

export function MobileTaskList({ tasks, onOpen }: { tasks: Task[]; onOpen: (id: number) => void }) {
  const t = useTranslations('tasks')
  const common = useTranslations('common')
  const locale = useLocale()
  return <ul aria-label={t('title')} className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
    {tasks.map(task => <li key={task.id}>
      <button type="button" onClick={() => onOpen(task.id)} className="block min-h-11 w-full space-y-2 p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
        <span className="block break-words text-body-sm font-semibold">{task.name}</span>
        <Badge tone={tones[task.status]} size="sm" dot>{t(`statuses.${task.status}`)}</Badge>
        <span className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-caption text-muted-foreground">
          <span className="break-words">{task.primary_assignee?.full_name || common('unassigned')}</span>
          <span>{t('due')}: {task.due_date ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${task.due_date.slice(0, 10)}T00:00:00Z`)) : t('noDate')}</span>
        </span>
      </button>
    </li>)}
  </ul>
}
