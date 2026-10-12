import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import en from '../../../../../../messages/en.json'
import vi_ from '../../../../../../messages/vi.json'
import type { UseCPMResult } from '@/features/gantt/hooks/useCPM'
import type { CPMResponse } from '@/types/cpm.types'
import GanttPage from './page'

const mocks = vi.hoisted(() => ({ useCPM: vi.fn() }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '7' }), notFound: vi.fn() }))
vi.mock('@/features/gantt/hooks/useCPM', () => ({ useCPM: mocks.useCPM }))

function result(over: Partial<UseCPMResult>): UseCPMResult {
  return { data: undefined, isLoading: false, isFetching: false, error: null, isRecalculating: false, jobLimitExceeded: false, refetch: vi.fn(), ...over }
}
const renderPage = () => render(<NextIntlClientProvider locale="en" messages={en}><GanttPage /></NextIntlClientProvider>)

beforeEach(() => mocks.useCPM.mockReset())

describe('trang Gantt', () => {
  it('hiển thị trạng thái rỗng khi chưa có task', () => {
    mocks.useCPM.mockReturnValue(result({ data: { project_id: 7, project_duration_days: 0, anchor_date: null, critical_path: [], tasks: [] } }))
    renderPage()
    expect(screen.getByText(en.gantt.empty)).toBeInTheDocument()
    expect(screen.getByText(en.gantt.emptyHint)).toBeInTheDocument()
  })

  it('lỗi vòng phụ thuộc có hướng dẫn và liên kết tới trang task', () => {
    mocks.useCPM.mockReturnValue(result({ error: { kind: 'cycle', status: 409, message: 'cycle' } }))
    renderPage()
    expect(screen.getByRole('alert')).toHaveTextContent(en.gantt.errorCycle)
    expect(screen.getByRole('link', { name: en.gantt.goToTasks })).toHaveAttribute('href', '/projects/7/tasks')
  })

  it('lỗi vượt giới hạn hiển thị thông báo giới hạn', () => {
    mocks.useCPM.mockReturnValue(result({ error: { kind: 'resource_limit', status: 422, message: '' } }))
    renderPage()
    expect(screen.getByRole('alert')).toHaveTextContent(en.gantt.errorLimit)
  })

  it('lỗi chung có nút thử lại gọi refetch', async () => {
    const refetch = vi.fn()
    mocks.useCPM.mockReturnValue(result({ error: { kind: 'network', status: null, message: '' }, refetch }))
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: en.gantt.retry }))
    expect(refetch).toHaveBeenCalledOnce()
  })

  it('có dữ liệu thì vẽ biểu đồ và báo đang tính lại', () => {
    const data: CPMResponse = {
      project_id: 7, project_duration_days: 3, anchor_date: '2026-01-01', critical_path: [1],
      tasks: [{ id: 1, name: 'Thiết kế', status: 'todo', duration_days: 3, early_start: '2026-01-01', early_finish: '2026-01-04', late_start: '2026-01-01', late_finish: '2026-01-04', float_days: 0, is_critical: true, predecessor_ids: [] }],
    }
    mocks.useCPM.mockReturnValue(result({ data, isRecalculating: true }))
    renderPage()
    expect(screen.getByRole('region', { name: en.gantt.chart })).toBeInTheDocument()
    expect(screen.getAllByText('Thiết kế').length).toBeGreaterThan(0)
    expect(screen.getByRole('status')).toHaveTextContent(en.gantt.recalculating)
  })

  it('mọi key gantt có ở cả EN và VI, không rỗng, không emoji', () => {
    expect(Object.keys(vi_.gantt).sort()).toEqual(Object.keys(en.gantt).sort())
    for (const value of [...Object.values(en.gantt), ...Object.values(vi_.gantt)]) {
      expect(value.trim()).not.toBe('')
      expect(value).not.toMatch(/\p{Extended_Pictographic}/u)
    }
  })
})
