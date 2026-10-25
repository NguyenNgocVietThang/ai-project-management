import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import messages from '../../../../messages/en.json'
import viMessages from '../../../../messages/vi.json'
import type { Task } from '@/types/task.types'
import { GroupedTaskList } from './GroupedTaskList'
import { SprintWorkspace } from './SprintWorkspace'
import { groupTasksByPhase, groupTasksBySprint } from './taskGroups'

function task(id: number, changes: Partial<Task> = {}): Task {
  return { id, name: `Task ${id}`, status: 'TODO', priority: 'MEDIUM', labels: [], due_date: '2026-10-25', start_date: null, primary_assignee: null, description: null, story_points: 3, progress: 100, early_start: null, early_finish: null, late_start: null, late_finish: null, float_days: null, is_critical: false, project_id: 2, actual_hours: 1.5, estimated_hours: 2, phase_id: null, sprint_id: null, epic_id: null, assignee_id: null, capabilities: { can_change_status: true, can_update: true, can_delete: true, can_manage_dependencies: true, can_manage_assignments: true, can_log_work: true, can_read_worklogs: true }, ...changes }
}

const phases = [{ id: 1, name: 'Discovery' }, { id: 2, name: 'Implementation' }]
const sprints = Array.from({ length: 12 }, (_, index) => ({ id: index + 1, name: `Sprint ${index + 1}`, status: 'PLANNED' }))
const wrapper = ({ children }: { children: React.ReactNode }) => <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">{children}</NextIntlClientProvider>

describe('grouping preserves loaded work', () => {
  it('keeps empty real phases, unphased and each unknown id distinct with no task lost or duplicated', () => {
    const tasks = [task(1, { phase_id: 1 }), task(2), task(3, { phase_id: 999 }), task(4, { phase_id: 998 })]
    const groups = groupTasksByPhase(tasks, phases)
    expect(groups.map(group => group.key)).toEqual(['phase_id:1', 'phase_id:2', 'phase_id:999', 'phase_id:998', 'phase_id:none'])
    expect(groups.flatMap(group => group.tasks).map(item => item.id).sort()).toEqual([1, 2, 3, 4])
    expect(groups[1].tasks).toEqual([])
  })

  it('keeps 12 real sprints plus strict null backlog and unknown sprint groups reachable', () => {
    const groups = groupTasksBySprint([task(1), task(2, { sprint_id: 12 }), task(3, { sprint_id: 999 })], sprints)
    expect(groups).toHaveLength(14)
    expect(groups[0].tasks.map(item => item.id)).toEqual([1])
    expect(groups.find(group => group.key === 'sprint_id:12')?.tasks.map(item => item.id)).toEqual([2])
    expect(groups.at(-1)?.tasks.map(item => item.id)).toEqual([3])
  })
})

describe('GroupedTaskList', () => {
  it('collapses only its phase, preserves readable titles and opens task detail', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    const title = 'LongUnbrokenTitle'.repeat(15)
    render(<GroupedTaskList tasks={[task(1, { phase_id: 1, name: title }), task(2)]} phases={phases} onOpen={onOpen} onBulkStatus={vi.fn()} />, { wrapper })
    const group = screen.getByRole('region', { name: 'Discovery' })
    const toggle = within(group).getByRole('button', { expanded: true })
    await user.click(within(group).getByRole('button', { name: title }))
    expect(onOpen).toHaveBeenCalledWith(1)
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('button', { name: title })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Task 2' })).toBeVisible()
    await user.click(toggle)
    expect(screen.getByRole('button', { name: title })).toBeVisible()
    expect(within(group).getByText('1.5 / 2')).toBeInTheDocument()
    expect(screen.getByText(messages.tasks.emptyPhase)).toBeInTheDocument()
  })

  it('selects only editable loaded tasks, including collapsed groups, and clears after successful bulk', async () => {
    const user = userEvent.setup()
    const onBulkStatus = vi.fn()
    const readonly = task(3)
    readonly.capabilities.can_update = false
    // Assigned Members can change individual statuses but the bulk API requires PM/BA/admin.
    readonly.capabilities.can_change_status = true
    render(<GroupedTaskList tasks={[task(1, { phase_id: 1 }), task(2), readonly]} phases={phases} onOpen={vi.fn()} onBulkStatus={onBulkStatus} />, { wrapper })
    await user.click(within(screen.getByRole('region', { name: 'Discovery' })).getByRole('button', { expanded: true }))
    await user.click(screen.getByRole('checkbox', { name: 'Select loaded tasks' }))
    expect(screen.getByRole('checkbox', { name: 'Select task: Task 3' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: 'Select task: Task 3' })).not.toBeChecked()
    await user.selectOptions(screen.getByRole('combobox', { name: messages.tasks.setStatus }), 'DONE')
    expect(onBulkStatus).toHaveBeenCalledWith([1, 2], 'DONE', expect.any(Function))
    act(() => onBulkStatus.mock.calls[0][2]())
    expect(screen.queryByRole('combobox', { name: messages.tasks.setStatus })).not.toBeInTheDocument()
  })

  it('drops selection outside refreshed loaded scope or revoked capability', async () => {
    const user = userEvent.setup()
    const onBulkStatus = vi.fn()
    const rendered = render(<GroupedTaskList tasks={[task(1), task(2)]} phases={[]} onOpen={vi.fn()} onBulkStatus={onBulkStatus} />, { wrapper })
    await user.click(screen.getByRole('checkbox', { name: 'Select loaded tasks' }))
    const restricted = task(2)
    restricted.capabilities.can_change_status = false
    rendered.rerender(<GroupedTaskList tasks={[restricted, task(3)]} phases={[]} onOpen={vi.fn()} onBulkStatus={onBulkStatus} />)
    expect(screen.queryByRole('combobox', { name: messages.tasks.setStatus })).not.toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', { name: 'Select loaded tasks' }))
    await user.selectOptions(screen.getByRole('combobox', { name: messages.tasks.setStatus }), 'BLOCKED')
    expect(onBulkStatus).toHaveBeenCalledWith([3], 'BLOCKED', expect.any(Function))
  })
})

describe('SprintWorkspace', () => {
  it('reaches late and zero-task sprints through both labelled selector and desktop navigator', async () => {
    const user = userEvent.setup()
    render(<SprintWorkspace tasks={[task(1), task(2, { sprint_id: 12 }), task(3, { sprint_id: 999 })]} sprints={sprints} onOpen={vi.fn()} />, { wrapper })
    const selector = screen.getByRole('combobox', { name: 'Sprint or backlog' })
    expect(within(selector).getAllByRole('option')).toHaveLength(14)
    await user.selectOptions(selector, 'sprint_id:12')
    expect(screen.getByRole('region', { name: 'Sprint 12' })).toHaveTextContent('Task 2')
    const nav = screen.getByRole('navigation', { name: 'Sprints and backlog' })
    await user.click(within(nav).getByRole('button', { name: /^Sprint 11/ }))
    expect(screen.getByRole('region', { name: 'Sprint 11' })).toHaveTextContent(messages.tasks.emptySprint)
    expect(within(nav).getByRole('button', { name: /^Sprint 11/ })).toHaveAttribute('aria-current', 'true')
    await user.selectOptions(selector, 'sprint_id:999')
    expect(screen.getByRole('region', { name: 'Unavailable sprint #999' })).toHaveTextContent('Task 3')
    await user.selectOptions(selector, 'sprint_id:none')
    expect(screen.getByRole('region', { name: 'Backlog' })).toHaveTextContent('Task 1')
    expect(screen.getByRole('region', { name: 'Backlog' })).not.toHaveTextContent('Task 3')
  })

  it('uses actual DONE counts, story points and sprint status while opening full task title', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<SprintWorkspace tasks={[task(1, { sprint_id: 12, status: 'DONE' }), task(2, { sprint_id: 12, progress: 100 })]} sprints={sprints} onOpen={onOpen} />, { wrapper })
    const detail = screen.getByRole('region', { name: 'Sprint 12' })
    expect(within(detail).getByRole('progressbar')).toHaveAttribute('value', '1')
    expect(within(detail).getByRole('progressbar')).toHaveAttribute('max', '2')
    expect(detail).toHaveTextContent('1 done / 2 loaded matching tasks')
    expect(detail).toHaveTextContent('6 points')
    expect(detail).toHaveTextContent('Planned')
    await user.click(within(detail).getByRole('button', { name: 'Task 2' }))
    expect(onOpen).toHaveBeenCalledWith(2)
  })

  it('preserves an intentionally selected empty sprint on filter refresh and falls back when WBS removes it', async () => {
    const user = userEvent.setup()
    const rendered = render(<SprintWorkspace tasks={[task(1), task(2, { sprint_id: 12 })]} sprints={sprints} onOpen={vi.fn()} />, { wrapper })
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sprint or backlog' }), 'sprint_id:12')
    rendered.rerender(<SprintWorkspace tasks={[]} sprints={sprints} onOpen={vi.fn()} />)
    expect(screen.getByRole('region', { name: 'Sprint 12' })).toHaveTextContent(messages.tasks.emptySprint)
    rendered.rerender(<SprintWorkspace tasks={[task(1)]} sprints={sprints.slice(0, 11)} onOpen={vi.fn()} />)
    expect(screen.getByRole('combobox', { name: 'Sprint or backlog' })).toHaveValue('sprint_id:none')
    expect(screen.getByRole('region', { name: 'Backlog' })).toHaveTextContent('Task 1')
  })

  it('falls back when an orphan group disappears and resets selected sprint for a new project', async () => {
    const user = userEvent.setup()
    const rendered = render(<SprintWorkspace key={2} tasks={[task(1, { sprint_id: 999 })]} sprints={sprints} onOpen={vi.fn()} />, { wrapper })
    expect(screen.getByRole('region', { name: 'Unavailable sprint #999' })).toBeInTheDocument()
    rendered.rerender(<SprintWorkspace key={2} tasks={[]} sprints={sprints} onOpen={vi.fn()} />)
    expect(screen.getByRole('region', { name: 'Backlog' })).toBeInTheDocument()
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sprint or backlog' }), 'sprint_id:12')
    rendered.rerender(<SprintWorkspace key={3} tasks={[task(2, { sprint_id: 2 })]} sprints={sprints} onOpen={vi.fn()} />)
    expect(screen.getByRole('region', { name: 'Sprint 2' })).toHaveTextContent('Task 2')
  })

  it.each(['en', 'vi'])('localizes empty and unknown groups (%s)', locale => {
    const catalog = locale === 'vi' ? viMessages : messages
    render(<NextIntlClientProvider locale={locale} messages={catalog}><SprintWorkspace tasks={[]} sprints={sprints} onOpen={vi.fn()} /></NextIntlClientProvider>)
    expect(screen.getByText(catalog.tasks.emptySprint)).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: catalog.tasks.selectSprintGroup })).toBeInTheDocument()
  })
})
