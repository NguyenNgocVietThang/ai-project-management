import { describe, expect, it } from 'vitest'
import type { CPMResponse, CPMTask } from '@/types/cpm.types'
import { computeGanttLayout, PX_PER_DAY, ROW_HEIGHT, visibleRowRange } from './layout'

function task(overrides: Partial<CPMTask> & { id: number }): CPMTask {
  return {
    name: `Task ${overrides.id}`, status: 'TODO', duration_days: 2,
    early_start: '2026-10-05', early_finish: '2026-10-07', late_start: '2026-10-05', late_finish: '2026-10-07',
    float_days: 0, is_critical: true, predecessor_ids: [], ...overrides,
  }
}

const cpm: CPMResponse = {
  project_id: 1,
  project_duration_days: 4.5,
  anchor_date: '2026-10-05',
  critical_path: [1, 2, 3],
  tasks: [
    task({ id: 2, duration_days: 2, early_start: '2026-10-07', early_finish: '2026-10-09', predecessor_ids: [1] }),
    task({ id: 1 }),
    task({ id: 3, name: 'Go-live', duration_days: 0, early_start: '2026-10-09', early_finish: '2026-10-09', predecessor_ids: [2] }),
    task({ id: 4, is_critical: false, float_days: 1, duration_days: 1, early_start: '2026-10-07', early_finish: '2026-10-08', predecessor_ids: [1] }),
    task({ id: 5, early_start: null, early_finish: null, late_start: null, late_finish: null }),
  ],
}

describe('computeGanttLayout', () => {
  it('trục chạy từ anchor_date tới anchor + project_duration_days', () => {
    const layout = computeGanttLayout(cpm, 'day')
    expect(layout.axis?.start).toBe('2026-10-05')
    // 4.5 ngày làm tròn lên 5.
    expect(layout.axis?.end).toBe('2026-10-10')
    expect(layout.axis?.totalDays).toBe(5)
    expect(layout.axis?.width).toBe(5 * PX_PER_DAY.day)
  })

  it('mốc 0 ngày vẽ dạng kim cương', () => {
    const layout = computeGanttLayout(cpm, 'day')
    const milestone = layout.rows.find((row) => row.task.id === 3)
    expect(milestone?.kind).toBe('milestone')
    expect(milestone?.width).toBe(0)
    expect(layout.rows.find((row) => row.task.id === 1)?.kind).toBe('bar')
  })

  it('task thiếu ngày tách thành nhóm riêng', () => {
    const layout = computeGanttLayout(cpm, 'day')
    expect(layout.unscheduled.map((t) => t.id)).toEqual([5])
    expect(layout.rows.map((row) => row.task.id)).not.toContain(5)
  })

  it('xếp hàng theo early_start rồi id và đặt tọa độ theo px/ngày', () => {
    const layout = computeGanttLayout(cpm, 'week')
    expect(layout.rows.map((row) => row.task.id)).toEqual([1, 2, 4, 3])
    const second = layout.rows[1]
    expect(second.x).toBe(2 * PX_PER_DAY.week)
    expect(second.y).toBe(ROW_HEIGHT)
    expect(second.width).toBe(2 * PX_PER_DAY.week)
    expect(layout.rows[2].floatWidth).toBe(PX_PER_DAY.week)
    expect(layout.height).toBe(4 * ROW_HEIGHT)
  })

  it('nối dependency giữa các task có hàng và đánh dấu đoạn găng', () => {
    const layout = computeGanttLayout(cpm, 'day')
    const critical = layout.links.find((link) => link.fromId === 1 && link.toId === 2)
    const slack = layout.links.find((link) => link.fromId === 1 && link.toId === 4)
    expect(critical?.critical).toBe(true)
    expect(slack?.critical).toBe(false)
    expect(critical?.path.startsWith('M')).toBe(true)
    expect(layout.links).toHaveLength(3)
  })

  it('vạch trục theo zoom: ngày mỗi ngày, tuần vào thứ Hai, tháng vào ngày 1', () => {
    const long: CPMResponse = { ...cpm, anchor_date: '2026-10-05', project_duration_days: 70 }
    const day = computeGanttLayout(long, 'day').axis!
    expect(day.ticks).toHaveLength(71)
    const week = computeGanttLayout(long, 'week').axis!
    // 2026-10-05 là thứ Hai.
    expect(week.ticks[0]).toMatchObject({ date: '2026-10-05', x: 0 })
    expect(week.ticks[1].date).toBe('2026-10-12')
    const month = computeGanttLayout(long, 'month').axis!
    expect(month.ticks.map((t) => t.date)).toEqual(['2026-11-01', '2026-12-01'])
  })

  it('không có anchor_date thì không có trục và mọi task vào nhóm thiếu ngày', () => {
    const layout = computeGanttLayout({ ...cpm, anchor_date: null }, 'day')
    expect(layout.axis).toBeNull()
    expect(layout.rows).toEqual([])
    expect(layout.unscheduled).toHaveLength(5)
  })
})

describe('visibleRowRange', () => {
  it('chỉ trả các hàng nằm trong khung nhìn cộng đệm', () => {
    expect(visibleRowRange(0, 320, 2000, 5)).toEqual({ start: 0, end: 15 })
    expect(visibleRowRange(ROW_HEIGHT * 100, 320, 2000, 5)).toEqual({ start: 95, end: 115 })
    expect(visibleRowRange(ROW_HEIGHT * 1999, 320, 2000, 5)).toEqual({ start: 1994, end: 2000 })
  })
})
