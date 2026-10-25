'use client'

import { useId, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Select } from '@/components/ui/Select'
import { formatStatus } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/task.types'
import { completedTasks, groupTasksBySprint, type TaskGroup } from './taskGroups'
import { TaskWorkspaceRow } from './TaskWorkspaceRow'

export function SprintWorkspace({ tasks, sprints, onOpen }: { tasks: Task[]; sprints: Array<{ id: number; name: string; status: string }>; onOpen: (id: number) => void }) {
  const t = useTranslations('tasks')
  const locale = useLocale()
  const controlId = useId()
  const groups = groupTasksBySprint(tasks, sprints)
  const [selected, setSelected] = useState<string | null>(null)
  // Preserve a selected real sprint even when filters leave it empty; fall back if WBS removes it.
  const active = groups.find(group => group.key === selected) || groups.find(group => group.tasks.length > 0) || groups[0]
  const name = (group: TaskGroup) => group.kind === 'known' ? group.name! : group.kind === 'unassigned' ? t('backlog') : t('unknownSprint', { id: group.id! })
  const done = completedTasks(active.tasks)
  return <div className="grid min-w-0 items-start gap-3 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
    <div className="min-w-0 lg:hidden">
      <label htmlFor={controlId} className="mb-1 block text-body-sm font-medium">{t('selectSprintGroup')}</label>
      <Select id={controlId} value={active.key} onChange={event => setSelected(event.target.value)}>{groups.map(group => <option key={group.key} value={group.key} aria-label={`${name(group)} · ${t('laneLoaded', { count: group.tasks.length })}`}>{name(group)} · {group.tasks.length}</option>)}</Select>
    </div>
    <nav aria-label={t('sprintNavigator')} className="sticky top-36 hidden min-w-0 rounded-lg border bg-muted p-2 lg:block">
      <h3 className="px-2 py-2 text-body-sm font-semibold">{t('sprintNavigator')}</h3>
      <div className="max-h-[calc(100dvh-12rem)] space-y-1 overflow-y-auto overscroll-contain">{groups.map(group => <button key={group.key} type="button" aria-label={`${name(group)} · ${t('laneLoaded', { count: group.tasks.length })}`} aria-current={active.key === group.key ? 'true' : undefined} onClick={() => setSelected(group.key)} className={cn('flex min-h-12 w-full min-w-0 items-start gap-2 rounded-md border border-transparent px-3 py-2 text-left transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring motion-reduce:transition-none', active.key === group.key && 'border-primary/30 bg-accent text-accent-foreground')}>
        <span className="min-w-0 flex-1 text-body-sm font-medium [overflow-wrap:anywhere]">{name(group)}</span><span className="pt-0.5 text-caption tabular-nums">{group.tasks.length}</span>
      </button>)}</div>
    </nav>
    <section aria-label={name(active)} className="min-w-0 rounded-lg border bg-card">
      <header className="space-y-3 border-b px-3 py-3 sm:px-4">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
          <div className="min-w-0"><h3 className="text-h4 [overflow-wrap:anywhere]">{name(active)}</h3>{active.status && <p className="mt-1 text-caption text-muted-foreground">{formatStatus(active.status, locale)}</p>}</div>
          <p className="text-caption tabular-nums text-muted-foreground">{t('points', { count: active.tasks.reduce((sum, task) => sum + (task.story_points || 0), 0) })}</p>
        </div>
        <div className="space-y-1.5">
          <p className="text-caption tabular-nums text-muted-foreground">{t('sprintLoadedProgress', { done, count: active.tasks.length })}</p>
          <progress aria-label={t('sprintCompletion')} max={Math.max(1, active.tasks.length)} value={done} className="block h-1.5 w-full overflow-hidden rounded-full accent-primary [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary" />
        </div>
      </header>
      {active.tasks.length ? <ul className="divide-y">{active.tasks.map(task => <TaskWorkspaceRow key={task.id} task={task} onOpen={onOpen} />)}</ul> : <p className="px-4 py-8 text-body-sm text-muted-foreground">{t('emptySprint')}</p>}
    </section>
  </div>
}
