import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { CPMResponse, CPMTask } from '@/types/cpm.types'
import { ScheduleList, type ScheduleListLabels } from './ScheduleList'

const labels: ScheduleListLabels = {
  title: 'Schedule list', hint: 'Grouped by start date', grouping: 'Group schedule', day: 'Day', week: 'Week',
  weekOf: (date) => `Week of ${date}`, critical: 'Critical', milestone: 'Milestone',
  unscheduledTitle: 'Not scheduled', unscheduledHint: 'Dates have not been set.',
}
function task(id: number, overrides: Partial<CPMTask> = {}): CPMTask {
  return { id, name: `Task ${id}`, status: 'todo', duration_days: 2, early_start: '2026-10-05', early_finish: '2026-10-07', late_start: null, late_finish: null, float_days: 0, is_critical: false, predecessor_ids: [], ...overrides }
}
const data: CPMResponse = { project_id: 7, project_duration_days: 9, anchor_date: '2026-10-05', critical_path: [1], tasks: [
  task(1, { name: 'A full task name with details that remain readable on a narrow screen', is_critical: true }),
  task(2, { early_start: '2026-10-07', early_finish: '2026-10-07', duration_days: 0 }),
  task(3, { early_start: null, early_finish: null }),
] }

describe('ScheduleList', () => {
  it('shows full names, calculated date ranges and explicit missing dates', () => {
    const { container } = render(<ScheduleList data={data} labels={labels} locale="en" />)
    expect(screen.getByText(data.tasks[0].name)).toBeVisible()
    expect(container.querySelector('time[datetime="2026-10-05"]')).toHaveTextContent('Oct 5, 2026')
    expect(container.querySelector('time[datetime="2026-10-07"]')).toBeInTheDocument()
    expect(screen.getByText('Critical')).toBeInTheDocument()
    expect(screen.getByText('Milestone')).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'Not scheduled' })).getByText('Task 3')).toBeInTheDocument()
  })

  it('changes from date sections to Monday based weeks without changing task dates', () => {
    render(<ScheduleList data={data} labels={labels} locale="en" />)
    expect(screen.getByRole('button', { name: 'Day' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3)
    fireEvent.click(screen.getByRole('button', { name: 'Week' }))
    expect(screen.getByRole('button', { name: 'Week' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: 'Week of Oct 5, 2026' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2)
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  it('keeps tasks unscheduled when no project anchor is available', () => {
    render(<ScheduleList data={{ ...data, anchor_date: null }} labels={labels} locale="vi" />)
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1)
    expect(screen.getByRole('region', { name: 'Not scheduled' })).toHaveTextContent(data.tasks[0].name)
  })
})
