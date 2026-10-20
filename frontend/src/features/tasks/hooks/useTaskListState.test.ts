import { describe, expect, it } from 'vitest'
import { parseTaskListState, writeTaskListState } from './useTaskListState'

describe('task list URL contract', () => {
  it('allows known values and rejects malformed dates, unsafe numbers and unknown enums', () => {
    const { filters, view } = parseTaskListState(new URLSearchParams('view=invalid&status=admin&priority=urgent&phase_id=-1&sprint_id=1.5&epic_id=9007199254740993&assignee_id=7&due_date_from=2026-02-30&due_date_to=2026-10-20&page=0&page_size=999&search=Phân+tích&labels=a,b&labels=b,c&token=secret'), true)
    expect(view).toBe('list')
    expect(filters).toEqual({ page: 1, page_size: 200, assignee_id: 7, due_date_to: '2026-10-20', search: 'Phân tích', labels: ['a', 'b', 'c'] })
  })

  it.each(['board', 'list', 'sprint'] as const)('honors explicit %s view on mobile', view => {
    expect(parseTaskListState(new URLSearchParams(`view=${view}`), true).view).toBe(view)
  })

  it('round-trips every task filter and preserves unrelated deep-link parameters', () => {
    const filters = { page: 4, page_size: 25, search: 'Phân tích', status: 'IN_REVIEW' as const, priority: 'HIGH' as const, phase_id: 2, sprint_id: 3, epic_id: 4, assignee_id: 5, labels: ['frontend', 'urgent'], due_date_from: '2026-10-01', due_date_to: '2026-10-31' }
    const url = writeTaskListState(new URLSearchParams('task=17&status=TODO'), filters, 'list')
    expect(url.get('task')).toBe('17')
    expect(parseTaskListState(url)).toEqual({ filters, view: 'list' })
  })
})
