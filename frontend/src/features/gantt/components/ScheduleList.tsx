'use client'

import { useId, useMemo, useState } from 'react'
import type { CPMResponse, CPMTask } from '@/types/cpm.types'
import { fromDayNumber, toDayNumber } from '@/features/gantt/lib/layout'
import { cn } from '@/lib/utils'

export interface ScheduleListLabels {
  title: string
  hint: string
  grouping: string
  day: string
  week: string
  weekOf: (date: string) => string
  critical: string
  milestone: string
  unscheduledTitle: string
  unscheduledHint: string
}

interface ScheduleListProps {
  data: CPMResponse
  labels: ScheduleListLabels
  locale: string
}

/** A readable schedule on narrow screens, using the same calculated CPM dates. */
export function ScheduleList({ data, labels, locale }: ScheduleListProps) {
  const [grouping, setGrouping] = useState<'day' | 'week'>('day')
  const id = useId()
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }), [locale])
  const formatDate = (date: string) => dateFormatter.format(new Date(`${date.slice(0, 10)}T00:00:00Z`))
  const { groups, unscheduled } = useMemo(() => {
    const groups = new Map<string, CPMTask[]>()
    const unscheduled: CPMTask[] = []
    const ordered = [...data.tasks].sort((a, b) => (a.early_start ?? '').localeCompare(b.early_start ?? '') || a.id - b.id)
    for (const task of ordered) {
      if (!data.anchor_date || !task.early_start || !task.early_finish) {
        unscheduled.push(task)
        continue
      }
      const startDay = toDayNumber(task.early_start)
      const weekday = new Date(`${task.early_start.slice(0, 10)}T00:00:00Z`).getUTCDay()
      const key = grouping === 'week' ? fromDayNumber(startDay - (weekday + 6) % 7) : task.early_start.slice(0, 10)
      const group = groups.get(key) ?? []
      group.push(task)
      groups.set(key, group)
    }
    return { groups: Array.from(groups), unscheduled }
  }, [data, grouping])

  return (
    <section aria-label={labels.title} className="min-w-0 space-y-4">
      <div role="group" aria-label={labels.grouping} className="inline-flex rounded-lg border border-border p-1">
        {(['day', 'week'] as const).map((option) => (
          <button key={option} type="button" aria-pressed={grouping === option} onClick={() => setGrouping(option)}
            className={cn('min-h-11 min-w-11 rounded-md px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', grouping === option ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>
            {labels[option]}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{labels.hint}</p>
      {groups.map(([date, tasks], index) => (
        <section key={date} aria-labelledby={`${id}-${index}`} className="min-w-0">
          <h3 id={`${id}-${index}`} className="border-b border-border pb-2 text-sm font-semibold text-foreground">
            {grouping === 'week' ? labels.weekOf(formatDate(date)) : formatDate(date)}
          </h3>
          <ul className="divide-y divide-border">
            {tasks.map((task) => (
              <li key={task.id} className="min-w-0 space-y-2 py-3">
                <p className="break-words text-sm font-medium text-foreground">{task.name}</p>
                <p className="text-sm text-muted-foreground">
                  <time dateTime={task.early_start!}>{formatDate(task.early_start!)}</time>
                  {task.early_finish !== task.early_start && <> – <time dateTime={task.early_finish!}>{formatDate(task.early_finish!)}</time></>}
                </p>
                {(task.is_critical || task.duration_days === 0) && <div className="flex flex-wrap gap-2 text-xs">
                  {task.is_critical && <span className="rounded border border-destructive px-2 py-1 text-destructive">{labels.critical}</span>}
                  {task.duration_days === 0 && <span className="rounded border border-border px-2 py-1 text-foreground">{labels.milestone}</span>}
                </div>}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {unscheduled.length > 0 && <section aria-labelledby={`${id}-unscheduled`} className="rounded-lg border border-dashed border-border p-3">
        <h3 id={`${id}-unscheduled`} className="text-sm font-semibold">{labels.unscheduledTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{labels.unscheduledHint}</p>
        <ul className="mt-2 space-y-2 text-sm">{unscheduled.map((task) => <li key={task.id} className="break-words">{task.name}</li>)}</ul>
      </section>}
    </section>
  )
}
