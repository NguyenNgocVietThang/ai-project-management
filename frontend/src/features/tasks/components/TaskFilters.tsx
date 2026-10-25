'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { Select } from '@/components/ui/Select'
import { TASK_PRIORITIES, TASK_STATUSES } from '../hooks/useTaskListState'
import type { TaskListParams } from '@/types/task.types'

type Item = { id: number; name: string }
interface Props {
  filters: TaskListParams
  onChange: <K extends keyof TaskListParams>(key: K, value: TaskListParams[K]) => void
  onReset: () => void
  phases: Item[]
  sprints: Item[]
  epics: Item[]
  members: Item[]
  total: number | undefined
}

export function TaskFilters({ filters, onChange, onReset, phases, sprints, epics, members, total }: Props) {
  const t = useTranslations('tasks')
  const [open, setOpen] = useState(false)
  const active = Object.entries(filters).filter(([key, value]) => !['page', 'page_size'].includes(key) && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0))
  const select = (key: 'status' | 'priority' | 'phase_id' | 'sprint_id' | 'epic_id' | 'assignee_id', label: string, placeholder: string, options: { value: string; label: string }[], compact = false) => <label className="block min-w-0 space-y-1 text-caption font-medium"><span className={compact ? 'sr-only' : undefined}>{label}</span><Select className={compact ? 'h-10' : undefined} value={filters[key] || ''} onChange={event => onChange(key, (event.target.value ? key.endsWith('_id') ? Number(event.target.value) : event.target.value : undefined) as TaskListParams[typeof key])}><option value="">{placeholder}</option>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></label>
  const status = (compact = false) => select('status', t('status'), t('allStatuses'), TASK_STATUSES.map(value => ({ value, label: t(`statuses.${value}`) })), compact)
  const assignee = (compact = false) => select('assignee_id', t('assignee'), t('allAssignees'), members.map(item => ({ value: String(item.id), label: item.name })), compact)
  const chipValue = (key: string, value: unknown) => {
    if (key === 'status') return t(`statuses.${value}`)
    if (key === 'priority') return t(`priorities.${value}`)
    const items = key === 'phase_id' ? phases : key === 'sprint_id' ? sprints : key === 'epic_id' ? epics : key === 'assignee_id' ? members : []
    return items.find(item => item.id === value)?.name || (Array.isArray(value) ? value.join(', ') : String(value))
  }
  const chipLabel: Record<string, string> = { search: t('searchPlaceholder'), status: t('status'), priority: t('priority'), phase_id: t('phase'), sprint_id: t('sprint'), epic_id: t('epic'), assignee_id: t('assignee'), labels: t('labels'), due_date_from: t('dueFrom'), due_date_to: t('dueTo') }
  return <section aria-label={t('filters')} className="space-y-2">
    <div className="flex flex-wrap items-end gap-2">
      <div className="min-w-0 flex-1 basis-40"><Input className="h-10" type="search" aria-label={t('searchPlaceholder')} placeholder={t('searchPlaceholder')} value={filters.search || ''} onChange={event => onChange('search', event.target.value || undefined)} /></div>
      <div className="hidden w-40 md:block">{status(true)}</div><div className="hidden w-44 md:block">{assignee(true)}</div>
      <Button size="sm" className="min-h-10" variant="outline" fullWidth={false} onClick={() => setOpen(true)} aria-haspopup="dialog"><SlidersHorizontal className="h-4 w-4" aria-hidden="true" />{t('filters')}{active.length > 0 && <span className="tabular-nums">({active.length})</span>}</Button>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <p role="status" className="text-caption text-muted-foreground">{total === undefined ? t('updating') : t('results', { count: total })}</p>
      {active.map(([key, value]) => <button type="button" key={key} aria-label={t('removeFilter', { name: chipLabel[key] })} onClick={() => onChange(key as keyof TaskListParams, undefined)} className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-lg border border-border bg-muted px-3 text-caption focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="truncate">{chipLabel[key]}: {chipValue(key, value)}</span><X className="h-3 w-3 shrink-0" aria-hidden="true" /></button>)}
      {active.length > 0 && <Button variant="ghost" fullWidth={false} onClick={onReset}>{t('resetFilters')}</Button>}
    </div>
    <Modal open={open} onClose={() => setOpen(false)} title={t('filters')} className="max-w-xl" footer={<div className="flex flex-wrap justify-between gap-2"><Button variant="outline" fullWidth={false} onClick={onReset}>{t('resetFilters')}</Button><Button fullWidth={false} onClick={() => setOpen(false)}>{total === undefined ? t('done') : t('showResults', { count: total })}</Button></div>}>
      <div className="grid gap-4 sm:grid-cols-2">
        {status()}{assignee()}
        {select('priority', t('priority'), t('allPriorities'), TASK_PRIORITIES.map(value => ({ value, label: t(`priorities.${value}`) })))}
        {select('phase_id', t('phase'), t('allPhases'), phases.map(item => ({ value: String(item.id), label: item.name })))}
        {select('sprint_id', t('sprint'), t('allSprints'), sprints.map(item => ({ value: String(item.id), label: item.name })))}
        {select('epic_id', t('epic'), t('allEpics'), epics.map(item => ({ value: String(item.id), label: item.name })))}
        <label className="space-y-1 text-caption font-medium"><span>{t('labels')}</span><Input placeholder={t('labelsFilter')} key={filters.labels?.join(',')} defaultValue={filters.labels?.join(', ') || ''} onBlur={event => onChange('labels', event.target.value.split(',').map(value => value.trim()).filter(Boolean))} /></label>
        <label className="space-y-1 text-caption font-medium"><span>{t('dueFrom')}</span><Input type="date" value={filters.due_date_from || ''} onChange={event => onChange('due_date_from', event.target.value || undefined)} /></label>
        <label className="space-y-1 text-caption font-medium"><span>{t('dueTo')}</span><Input type="date" value={filters.due_date_to || ''} onChange={event => onChange('due_date_to', event.target.value || undefined)} /></label>
      </div>
    </Modal>
  </section>
}
