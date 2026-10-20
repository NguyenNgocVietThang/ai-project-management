'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { TaskListParams, TaskPriority, TaskStatus } from '@/types/task.types'

export type TaskView = 'board' | 'list' | 'sprint'
export const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED']
export const TASK_PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const IDS = ['phase_id', 'sprint_id', 'epic_id', 'assignee_id'] as const
const DATES = ['due_date_from', 'due_date_to'] as const
const KEYS = ['search', 'status', 'priority', ...IDS, ...DATES, 'labels', 'page', 'page_size', 'view']
const positiveInteger = (value: string | null) => value && /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value)) ? Number(value) : undefined
const validDate = (value: string | null) => value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value ? value : undefined

export function parseTaskListState(params: URLSearchParams, mobile = false): { filters: TaskListParams; view: TaskView } {
  const requestedView = params.get('view')
  const view: TaskView = requestedView === 'list' || requestedView === 'board' || requestedView === 'sprint' ? requestedView : mobile ? 'list' : 'board'
  const filters: TaskListParams = { page: positiveInteger(params.get('page')) || 1, page_size: Math.min(positiveInteger(params.get('page_size')) || (view === 'list' ? 25 : 200), 200) }
  const search = params.get('search')
  if (search) filters.search = search
  const status = params.get('status') as TaskStatus
  const priority = params.get('priority') as TaskPriority
  if (TASK_STATUSES.includes(status)) filters.status = status
  if (TASK_PRIORITIES.includes(priority)) filters.priority = priority
  IDS.forEach(key => { const value = positiveInteger(params.get(key)); if (value) filters[key] = value })
  DATES.forEach(key => { const value = validDate(params.get(key)); if (value) filters[key] = value })
  const labels = params.getAll('labels').flatMap(value => value.split(',')).map(value => value.trim()).filter(Boolean)
  if (labels.length) filters.labels = [...new Set(labels)]
  return { filters, view }
}

export function writeTaskListState(source: URLSearchParams, filters: TaskListParams, view: TaskView): URLSearchParams {
  const result = new URLSearchParams(source)
  KEYS.forEach(key => result.delete(key))
  result.set('view', view)
  Object.entries(filters).forEach(([key, value]) => {
    if (!KEYS.includes(key) || value === undefined || value === '' || (Array.isArray(value) && !value.length)) return
    if (Array.isArray(value)) value.forEach(label => result.append(key, label))
    else result.set(key, String(value))
  })
  return result
}

export function useTaskListState() {
  const params = useSearchParams()
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const update = () => setMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const source = params.toString()
  const { filters, view } = useMemo(() => parseTaskListState(new URLSearchParams(source), mobile), [source, mobile])
  const debouncedSearch = useDebouncedValue(filters.search || '')
  const queryFilters = useMemo(() => ({ ...filters, search: debouncedSearch || undefined }), [filters, debouncedSearch])
  const navigate = (next: TaskListParams, nextView = view) => {
    // Next.js integrates native history with useSearchParams, without scrolling or refetching the route.
    const url = new URL(window.location.href)
    url.search = writeTaskListState(url.searchParams, next, nextView).toString()
    window.history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }
  const setFilter = <K extends keyof TaskListParams>(key: K, value: TaskListParams[K]) => navigate({ ...filters, [key]: value, page: 1 })
  return { filters, queryFilters, view, mobile, setFilter, changePage: (page: number) => navigate({ ...filters, page }), changeView: (next: TaskView) => navigate({ ...filters, page: 1, page_size: next === 'list' ? 25 : 200 }, next), reset: () => navigate({ page: 1, page_size: filters.page_size }) }
}
