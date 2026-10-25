'use client'

import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types/task.types'
import { TASK_STATUSES } from '../hooks/useTaskListState'
import { groupTasksByPhase } from './taskGroups'
import { TaskWorkspaceRow } from './TaskWorkspaceRow'

export function GroupedTaskList({ tasks, phases, onOpen, onBulkStatus }: { tasks: Task[]; phases: Array<{ id: number; name: string }>; onOpen: (id: number) => void; onBulkStatus: (ids: number[], status: TaskStatus, onSuccess: () => void) => void }) {
  const t = useTranslations('tasks')
  const regionId = useId()
  const [collapsed, setCollapsed] = useState<string[]>([])
  const [selection, setSelection] = useState<number[]>([])
  // Recheck loaded scope and permissions on every render, including server refreshes.
  const eligible = tasks.filter(task => task.capabilities.can_update && task.capabilities.can_change_status).map(task => task.id)
  const selected = selection.filter(id => eligible.includes(id))
  const groups = groupTasksByPhase(tasks, phases)
  return <div className="min-w-0 space-y-3">
    {eligible.length > 0 && <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border bg-muted px-3 py-2">
      <label className="flex min-h-11 items-center gap-2 text-body-sm font-medium">
        <input type="checkbox" className="h-4 w-4 accent-primary" checked={selected.length === eligible.length} onChange={event => setSelection(event.target.checked ? eligible : [])} />
        {t('selectLoaded')}
      </label>
      <p className={selected.length ? "text-caption text-muted-foreground" : "sr-only"}>{t('bulkScope')}</p>
      {selected.length > 0 && <>
        <span className="text-caption font-medium tabular-nums">{t('selected', { count: selected.length })}</span>
        <Select aria-label={t('setStatus')} wrapperClassName="w-full sm:w-44" value="" onChange={event => { if (event.target.value) onBulkStatus(selected, event.target.value as TaskStatus, () => setSelection([])) }}>
          <option value="">{t('setStatus')}</option>{TASK_STATUSES.map(status => <option key={status} value={status}>{t(`statuses.${status}`)}</option>)}
        </Select>
      </>}
    </div>}
    {groups.map((group, index) => {
      const name = group.kind === 'known' ? group.name! : group.kind === 'unassigned' ? t('unphased') : t('unknownPhase', { id: group.id! })
      const open = !collapsed.includes(group.key)
      const id = `${regionId}-${index}`
      return <section key={group.key} aria-label={name} className="min-w-0 rounded-lg border bg-card">
        <h3><button type="button" aria-expanded={open} aria-controls={id} className="flex min-h-12 w-full min-w-0 items-center gap-2 rounded-lg bg-muted px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4" onClick={() => setCollapsed(open ? [...collapsed, group.key] : collapsed.filter(key => key !== group.key))}>
          <ChevronDown aria-hidden="true" className={cn('h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none', !open && '-rotate-90')} />
          <span className="min-w-0 flex-1 text-body-sm font-semibold [overflow-wrap:anywhere]">{name}</span>
          <span aria-label={t('laneLoaded', { count: group.tasks.length })} className="shrink-0 text-caption tabular-nums text-muted-foreground">{group.tasks.length}</span>
        </button></h3>
        <div id={id} hidden={!open}>
          {group.tasks.length ? <ul className="divide-y">{group.tasks.map(task => <TaskWorkspaceRow key={task.id} task={task} onOpen={onOpen} selected={selected.includes(task.id)} onSelect={checked => setSelection(checked ? [...selected, task.id] : selected.filter(id => id !== task.id))} />)}</ul> : <p className="px-4 py-5 text-body-sm text-muted-foreground">{t('emptyPhase')}</p>}
        </div>
      </section>
    })}
  </div>
}
