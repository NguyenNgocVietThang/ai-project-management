import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import messages from '../../../../messages/en.json'
import viMessages from '../../../../messages/vi.json'
import type { Task, TaskStatus } from '@/types/task.types'
import { TASK_STATUSES } from '../hooks/useTaskListState'
import { TaskBoard } from './TaskBoard'

function task(id: number, status: TaskStatus, allowed = true): Task {
  return { id, name: `Task ${id}`, status, priority: 'MEDIUM', labels: [], due_date: null, start_date: null, primary_assignee: null, description: null, story_points: null, progress: 0, early_start: null, early_finish: null, late_start: null, late_finish: null, float_days: null, is_critical: false, project_id: 2, actual_hours: 0, estimated_hours: 2, phase_id: null, sprint_id: null, epic_id: null, assignee_id: null, capabilities: { can_change_status: allowed, can_update: allowed, can_delete: allowed, can_manage_dependencies: allowed, can_manage_assignments: allowed, can_log_work: allowed, can_read_worklogs: allowed } }
}

function setup(tasks: Task[], locale = 'en') {
  const onOpen = vi.fn()
  const onStatusChange = vi.fn()
  render(<NextIntlClientProvider locale={locale} messages={locale === 'vi' ? viMessages : messages}><TaskBoard tasks={tasks} onOpen={onOpen} onStatusChange={onStatusChange} /></NextIntlClientProvider>)
  return { onOpen, onStatusChange }
}

describe('TaskBoard', () => {
  it('keeps all five real statuses and their loaded counts visible with matching tasks', () => {
    setup(TASK_STATUSES.map((status, index) => task(index + 1, status)))
    for (const status of TASK_STATUSES) {
      const lane = screen.getByRole('region', { name: messages.tasks.statuses[status] })
      expect(within(lane).getByLabelText('1 loaded matching task')).toHaveTextContent('1')
    }
    expect(screen.getByText('5 loaded matching tasks · grouped by status')).toBeInTheDocument()
  })

  it.each(['en', 'vi'])('shows localized feedback in every empty lane (%s)', locale => {
    setup([], locale)
    const catalog = locale === 'vi' ? viMessages : messages
    expect(screen.getAllByText(catalog.tasks.emptyLane)).toHaveLength(5)
    expect(screen.getAllByRole('region')).toHaveLength(5)
  })

  it('opens the full unbroken name and shows drag handles only when status changes are permitted', async () => {
    const long = { ...task(1, 'TODO'), name: 'VeryLongUnbrokenTaskName'.repeat(12), labels: ['LongLabel'.repeat(15)] }
    const { onOpen, onStatusChange } = setup([long, task(2, 'BLOCKED', false)])
    expect(screen.getByText(long.name)).toHaveClass('[overflow-wrap:anywhere]')
    expect(screen.getByRole('button', { name: `Move ${long.name}` })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Move Task 2' })).not.toBeInTheDocument()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: new RegExp(`^${long.name}`) }))
    expect(onOpen).toHaveBeenCalledWith(1)
    // Bàn phím có thể nhấc và hủy kéo mà không thay đổi dữ liệu.
    screen.getByRole('button', { name: `Move ${long.name}` }).focus()
    await user.keyboard('[Space]')
    expect(screen.getByRole('button', { name: `Move ${long.name}` })).toHaveAttribute('aria-pressed', 'true')
    await user.keyboard('{Escape}')
    expect(onStatusChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: `Move ${long.name}` })).toHaveFocus()
  })
})
