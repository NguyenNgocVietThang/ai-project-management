import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import messages from '../../../../../../messages/en.json'
import viMessages from '../../../../../../messages/vi.json'
import type { Task, TaskListParams } from '@/types/task.types'
import TasksPage from './page'

const mocks = vi.hoisted(() => ({ actions: {} as Record<string, { mutate: ReturnType<typeof vi.fn>; isPending: boolean }>, retry: vi.fn(), error: false, loading: false, wbsLoading: false, params: {} as TaskListParams }))
vi.mock('next/navigation', async () => {
  const { useSyncExternalStore } = await import('react')
  return { useParams: () => ({ id: '2' }), notFound: vi.fn(), useSearchParams: () => {
    const value = useSyncExternalStore(listener => { window.addEventListener('popstate', listener); return () => window.removeEventListener('popstate', listener) }, () => window.location.search)
    return new URLSearchParams(value)
  } }
})
vi.mock('@/features/projects/hooks/useProjects', () => ({ useProjectDetail: () => ({ data: { capabilities: { can_update: true } } }) }))
vi.mock('@/features/projects/hooks/useProjectMembers', () => ({ useProjectMembers: () => ({ data: [{ user: { id: 7, full_name: 'An' } }] }) }))
vi.mock('@/features/wbs/hooks/useWBS', () => ({ useWBS: () => ({ data: { phases: [{ id: 2, name: 'Discovery', sprints: [] }], unphased_sprints: [], epics: [] }, isLoading: mocks.wbsLoading }) }))

const capabilities = { can_update: true, can_delete: true, can_change_status: true, can_manage_dependencies: true, can_manage_assignments: true, can_log_work: true, can_read_worklogs: true }
const tasks: Task[] = Array.from({ length: 17 }, (_, index) => ({ id: index + 1, name: index === 0 ? 'Phân tích yêu cầu' : `Implementation ${index}`, status: index ? 'TODO' : 'IN_PROGRESS', priority: 'MEDIUM', labels: [], due_date: null, start_date: null, primary_assignee: { id: 7, full_name: 'An', username: 'an', email: 'an@example.test', avatar_url: null }, description: null, story_points: null, progress: 0, early_start: null, early_finish: null, late_start: null, late_finish: null, float_days: null, is_critical: false, order_index: 0, created_at: '', updated_at: '', project_id: 2, actual_hours: 0, estimated_hours: 2, phase_id: 2, sprint_id: null, epic_id: null, assignee_id: 7, capabilities }))
const detail = { ...tasks[0], description: '', subtasks: [], assignments: [], predecessor_dependencies: [], successor_dependencies: [], total_logged_hours: 0 }
vi.mock('@/features/tasks/hooks/useTasks', () => ({
  useTasks: (_id: number, params: TaskListParams) => { mocks.params = params; const items = tasks.filter(task => (!params.search || task.name.toLocaleLowerCase().includes(params.search.toLocaleLowerCase())) && (!params.status || task.status === params.status)); return { data: mocks.loading ? undefined : { items, total: items.length, page: params.page || 1, total_pages: 1 }, isLoading: mocks.loading, isError: mocks.error, error: new Error('Unavailable'), refetch: mocks.retry } },
  useTask: (id: number | null) => ({ data: id ? detail : undefined, isLoading: false }), useWorklogs: () => ({ data: [] }), useActiveTimer: () => ({ data: null }), useTaskActions: () => mocks.actions,
}))

beforeEach(() => {
  window.history.replaceState(null, '', '/projects/2/tasks')
  // Mirror Next's documented native-history integration with useSearchParams.
  const push = window.history.pushState.bind(window.history)
  vi.spyOn(window.history, 'pushState').mockImplementation((data, unused, url) => { push(data, unused, url); window.dispatchEvent(new PopStateEvent('popstate')) })
  vi.spyOn(window, 'matchMedia').mockImplementation(query => ({ matches: query.includes('max-width'), media: query, onchange: null, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn() }))
  mocks.error = false
  mocks.loading = false
  mocks.wbsLoading = false
  mocks.actions = Object.fromEntries(['create', 'update', 'changeStatus', 'bulk', 'stopTimer', 'startTimer', 'remove', 'assign', 'unassign', 'createSubtask', 'updateSubtask', 'removeSubtask', 'addDependency', 'removeDependency', 'addWorklog', 'removeWorklog'].map(name => [name, { mutate: vi.fn(), isPending: false }]))
})

function setup(locale = 'en') {
  return render(<NextIntlClientProvider locale={locale} messages={locale === 'vi' ? viMessages : messages} timeZone="UTC"><TasksPage /></NextIntlClientProvider>)
}

describe('task list interactions', () => {
  it('defaults mobile to list; debounces search to 1 result, retains it across views and clear restores 17', async () => {
    setup()
    const user = userEvent.setup()
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('17 results')
    const search = screen.getByRole('searchbox')
    await user.click(search)
    await user.paste('Phân tích')
    expect(mocks.params.search).toBeUndefined()
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('1 result'))
    expect(mocks.params.search).toBe('Phân tích')
    await user.click(screen.getByRole('button', { name: 'Board' }))
    expect(search).toHaveValue('Phân tích')
    expect(window.location.search).toContain('search=Ph%C3%A2n+t%C3%ADch')
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    await waitFor(() => expect(screen.getByText('17 results')).toBeInTheDocument())
    expect(search).toHaveValue('')
  })

  it('restores view and all URL filters on Back/Forward and filter changes reset page', async () => {
    window.history.replaceState(null, '', '/projects/2/tasks?view=board&page=3&status=TODO&priority=HIGH&phase_id=2&sprint_id=4&epic_id=5&assignee_id=7&labels=ui&due_date_from=2026-10-01&due_date_to=2026-10-31')
    setup()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'List' }))
    expect(mocks.params.page).toBe(1)
    expect(mocks.params).toMatchObject({ status: 'TODO', priority: 'HIGH', phase_id: 2, sprint_id: 4, epic_id: 5, assignee_id: 7, labels: ['ui'], due_date_from: '2026-10-01', due_date_to: '2026-10-31' })
    await act(async () => { window.history.back(); await new Promise(resolve => setTimeout(resolve, 30)) })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Board' })).toHaveAttribute('aria-pressed', 'true'))
    expect(mocks.params.page).toBe(3)
    await act(async () => { window.history.forward(); await new Promise(resolve => setTimeout(resolve, 30)) })
    await waitFor(() => expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true'))
    await user.click(screen.getByRole('button', { name: 'Remove Status filter' }))
    expect(mocks.params.page).toBe(1)
    expect(mocks.params.priority).toBe('HIGH')
  })

  it('keeps search mounted during loading and offers clear/retry recovery', async () => {
    const rendered = setup()
    const user = userEvent.setup()
    const search = screen.getByRole('searchbox')
    await user.type(search, 'unmatched')
    await waitFor(() => expect(screen.getByText('No tasks match the current filters.')).toBeInTheDocument())
    expect(screen.getAllByRole('button', { name: 'Clear filters' }).length).toBeGreaterThan(0)
    mocks.loading = true
    rendered.rerender(<NextIntlClientProvider locale="en" messages={messages}><TasksPage /></NextIntlClientProvider>)
    expect(screen.getByRole('searchbox')).toBe(search)
    mocks.loading = false
    mocks.wbsLoading = true
    rendered.rerender(<NextIntlClientProvider locale="en" messages={messages}><TasksPage /></NextIntlClientProvider>)
    expect(screen.getByRole('searchbox')).toBe(search)
    mocks.wbsLoading = false
    mocks.error = true
    rendered.rerender(<NextIntlClientProvider locale="en" messages={messages}><TasksPage /></NextIntlClientProvider>)
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(mocks.retry).toHaveBeenCalled()
  })

  it.each(['en', 'vi'])('opens localized detail with a fixed external save footer (%s)', async locale => {
    setup(locale)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /Phân tích yêu cầu/ }))
    const dialog = screen.getByRole('dialog')
    const save = within(dialog).getByRole('button', { name: locale === 'vi' ? 'Lưu công việc' : 'Save task' })
    expect(save.closest('form')).toBeNull()
    expect(document.getElementById(save.getAttribute('form')!)).toBeInTheDocument()
    await user.click(save)
    expect(mocks.actions.update.mutate).toHaveBeenCalledWith({ id: 1, body: { name: 'Phân tích yêu cầu', description: '', priority: 'MEDIUM', start_date: null, due_date: null, phase_id: 2, sprint_id: null, epic_id: null, labels: [] } })
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phân tích yêu cầu/ })).toHaveFocus()
  })
})
