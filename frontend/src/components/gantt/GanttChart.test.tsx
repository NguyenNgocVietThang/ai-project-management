import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { CPMResponse, CPMTask } from '@/types/cpm.types'
import { ROW_HEIGHT } from '@/features/gantt/lib/layout'
import { GanttChart, type GanttChartLabels } from './GanttChart'

const labels: GanttChartLabels = {
  chart: 'Project Gantt chart',
  zoom: 'Zoom level',
  zoomDay: 'Day',
  zoomWeek: 'Week',
  zoomMonth: 'Month',
  task: 'Task',
  critical: 'Critical',
  nonCritical: 'Has float',
  milestone: 'Milestone',
  float: 'Float',
  floatDays: (days) => `Float ${days} days`,
  unscheduledTitle: 'Not scheduled',
  unscheduledHint: 'These tasks have no dates yet.',
  empty: 'No tasks to schedule yet.',
}

function task(overrides: Partial<CPMTask> & { id: number }): CPMTask {
  return {
    name: `Task ${overrides.id}`, status: 'TODO', duration_days: 2,
    early_start: '2026-10-05', early_finish: '2026-10-07', late_start: '2026-10-05', late_finish: '2026-10-07',
    float_days: 0, is_critical: true, predecessor_ids: [], ...overrides,
  }
}

const small: CPMResponse = {
  project_id: 1,
  project_duration_days: 6,
  anchor_date: '2026-10-05',
  critical_path: [1, 2, 3],
  tasks: [
    task({ id: 1, name: 'Design' }),
    task({ id: 2, name: 'Build', early_start: '2026-10-07', early_finish: '2026-10-11', duration_days: 4, predecessor_ids: [1] }),
    task({ id: 3, name: 'Go-live', duration_days: 0, early_start: '2026-10-11', early_finish: '2026-10-11', predecessor_ids: [2] }),
    task({ id: 4, name: 'Docs', is_critical: false, float_days: 2, early_start: '2026-10-07', early_finish: '2026-10-09', predecessor_ids: [1] }),
    task({ id: 5, name: 'Backlog idea', early_start: null, early_finish: null, late_start: null, late_finish: null }),
  ],
}

function large(count: number): CPMResponse {
  const tasks = Array.from({ length: count }, (_, index) =>
    task({
      id: index + 1,
      name: `Task ${index + 1}`,
      duration_days: 1,
      early_start: '2026-10-05',
      early_finish: '2026-10-06',
      is_critical: index % 2 === 0,
      predecessor_ids: index > 0 ? [index] : [],
    })
  )
  return { project_id: 1, project_duration_days: 30, anchor_date: '2026-10-05', critical_path: [1], tasks }
}

describe('GanttChart', () => {
  it('gắn nhãn đường găng bằng chữ và aria-label, không chỉ dựa màu', () => {
    const { container } = render(<GanttChart data={small} labels={labels} />)
    expect(screen.getByRole('region', { name: 'Project Gantt chart' })).toBeInTheDocument()
    const design = screen.getByRole('listitem', { name: /^Design/ })
    expect(design.getAttribute('aria-label')).toContain('Critical')
    // Nhãn chữ hiển thị cạnh tên, không chỉ là màu.
    expect(within(design).getByText('Critical')).toBeInTheDocument()
    const docs = screen.getByRole('listitem', { name: /^Docs/ })
    expect(docs.getAttribute('aria-label')).toContain('Float 2 days')
    expect(within(docs).queryByText('Critical')).toBeNull()
    // Thanh găng có thêm lớp hoa văn sọc và viền đậm hơn.
    const criticalBar = container.querySelector('[data-testid="gantt-bar"][data-critical="true"]')!
    expect(criticalBar.querySelector('rect[fill^="url(#"]')).not.toBeNull()
    expect(criticalBar.querySelector('rect')?.getAttribute('stroke-width')).toBe('2')
  })

  it('vẽ mốc dạng kim cương, mũi tên dependency bằng SVG và nhóm task thiếu ngày', () => {
    const { container } = render(<GanttChart data={small} labels={labels} />)
    const milestone = container.querySelector('[data-testid="gantt-milestone"] path')
    expect(milestone?.getAttribute('d')).toMatch(/^M.* Z$/)
    expect(screen.getByRole('listitem', { name: /^Go-live/ }).getAttribute('aria-label')).toContain('Milestone')
    const links = container.querySelectorAll('path[data-testid="gantt-link"]')
    expect(links).toHaveLength(3)
    expect(links[0].getAttribute('marker-end')).toMatch(/^url\(#/)
    const unscheduled = screen.getByTestId('gantt-unscheduled')
    expect(within(unscheduled).getByText('Backlog idea')).toBeInTheDocument()
    expect(screen.queryByRole('listitem', { name: /^Backlog idea/ })).toBeNull()
  })

  it('đổi zoom ngày/tuần/tháng làm thay đổi bề rộng trục', () => {
    const onZoomChange = vi.fn()
    const { container } = render(<GanttChart data={small} labels={labels} defaultZoom="week" onZoomChange={onZoomChange} />)
    const widthOf = () => Number(container.querySelector('[data-testid="gantt-scroll"] svg')?.getAttribute('width'))
    const weekWidth = widthOf()
    expect(screen.getByRole('button', { name: 'Week' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Day' }))
    expect(onZoomChange).toHaveBeenCalledWith('day')
    expect(screen.getByRole('button', { name: 'Day' })).toHaveAttribute('aria-pressed', 'true')
    expect(widthOf()).toBeGreaterThan(weekWidth)
    fireEvent.click(screen.getByRole('button', { name: 'Month' }))
    expect(widthOf()).toBeLessThan(weekWidth)
  })

  it('hiển thị trạng thái rỗng khi không có task', () => {
    render(<GanttChart data={{ ...small, tasks: [], anchor_date: null, project_duration_days: 0 }} labels={labels} />)
    expect(screen.getByText('No tasks to schedule yet.')).toBeInTheDocument()
  })

  it('2000 task chỉ dựng số hàng nhìn thấy và cập nhật khi cuộn', () => {
    const viewportHeight = 480
    const { container } = render(<GanttChart data={large(2000)} labels={labels} viewportHeight={viewportHeight} />)
    const rows = () => screen.getAllByTestId('gantt-row')
    const maxRendered = Math.ceil(viewportHeight / ROW_HEIGHT) + 10
    expect(rows().length).toBeLessThanOrEqual(maxRendered)
    expect(container.querySelectorAll('[data-testid="gantt-bar"]').length).toBeLessThanOrEqual(maxRendered)
    expect(container.querySelectorAll('[data-testid="gantt-link"]').length).toBeLessThanOrEqual(maxRendered)
    // Danh sách vẫn báo đủ tổng số hàng cho công nghệ hỗ trợ.
    expect(rows()[0]).toHaveAttribute('aria-setsize', '2000')
    expect(screen.queryByRole('listitem', { name: /^Task 1500,/ })).toBeNull()

    const scroller = screen.getByTestId('gantt-scroll')
    fireEvent.scroll(scroller, { target: { scrollTop: ROW_HEIGHT * 1500 } })
    expect(screen.getByRole('listitem', { name: /^Task 1500,/ })).toBeInTheDocument()
    expect(screen.queryByRole('listitem', { name: /^Task 1,/ })).toBeNull()
    expect(rows().length).toBeLessThanOrEqual(maxRendered)
  })
})
