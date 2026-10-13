import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types/auth.types'
import { cpmService, classifyCPMError } from '@/services/cpm.service'
import { jobsService } from '@/services/jobs.service'
import { taskKeys } from '@/features/tasks/hooks/useTasks'
import { cpmKeys, useCPM } from './useCPM'
import type { CPMResponse } from '@/types/cpm.types'
import type { DurableJob } from '@/types/job.types'

vi.mock('@/services/jobs.service', () => ({ jobsService: { list: vi.fn(), get: vi.fn() } }))
vi.mock('@/services/cpm.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/cpm.service')>()
  return { ...actual, cpmService: { get: vi.fn() } }
})

const schedule: CPMResponse = {
  project_id: 5,
  project_duration_days: 3,
  anchor_date: '2026-10-01',
  critical_path: [1],
  tasks: [],
}

function job(overrides: Partial<DurableJob>): DurableJob {
  return {
    id: 1, kind: 'scheduling.cpm', status: 'queued', owner_id: null, project_id: 5, attempts: 0,
    max_attempts: 3, error_code: null, result: null, created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-01T00:00:00Z', ...overrides,
  }
}

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
  return { client, wrapper }
}

beforeEach(() => {
  vi.resetAllMocks()
  onlineManager.setOnline(true)
  useAuthStore.setState({ user: { id: 1 } as User, accessToken: 'test-memory-token', hasHydrated: true })
})
afterEach(() => { useAuthStore.getState().clear() })

describe('classifyCPMError', () => {
  it('phân biệt vòng phụ thuộc, vượt giới hạn và lỗi mạng', () => {
    expect(classifyCPMError({ response: { status: 409, data: { detail: 'Cycle detected' } } }).kind).toBe('cycle')
    expect(classifyCPMError({ response: { status: 422, data: { detail: 'resource_limit_exceeded' } } }).kind).toBe('resource_limit')
    expect(classifyCPMError({ response: { status: 403, data: {} } }).kind).toBe('forbidden')
    expect(classifyCPMError({ response: { status: 404, data: {} } }).kind).toBe('not_found')
    expect(classifyCPMError(new Error('offline')).kind).toBe('network')
    expect(classifyCPMError({ response: { status: 500, data: {} } }).kind).toBe('unknown')
  })
})

describe('useCPM', () => {
  it('trả lỗi 409 đã phân loại và không thử lại', async () => {
    vi.mocked(jobsService.list).mockResolvedValue([])
    vi.mocked(cpmService.get).mockRejectedValue({ response: { status: 409, data: { detail: 'Cycle detected: 1 -> 2 -> 1' } } })
    const { wrapper, client } = setup()
    const { result } = renderHook(() => useCPM(5), { wrapper })
    await waitFor(() => expect(result.current.error?.kind).toBe('cycle'))
    expect(result.current.error?.status).toBe(409)
    expect(cpmService.get).toHaveBeenCalledTimes(1)
    client.clear()
  })

  it('trả lỗi giới hạn tài nguyên đã phân loại', async () => {
    vi.mocked(jobsService.list).mockResolvedValue([])
    vi.mocked(cpmService.get).mockRejectedValue({ response: { status: 422, data: { detail: 'resource_limit_exceeded' } } })
    const { wrapper, client } = setup()
    const { result } = renderHook(() => useCPM(5), { wrapper })
    await waitFor(() => expect(result.current.error?.kind).toBe('resource_limit'))
    client.clear()
  })

  it('tải lại khi task/dependency của dự án bị invalidate', async () => {
    vi.mocked(jobsService.list).mockResolvedValue([])
    vi.mocked(cpmService.get).mockResolvedValue(schedule)
    const { wrapper, client } = setup()
    const { result } = renderHook(() => useCPM(5), { wrapper })
    await waitFor(() => expect(result.current.data).toEqual(schedule))
    expect(cpmKeys.project(5).slice(0, 3)).toEqual(taskKeys.project(5))
    // Đây đúng là khoá mà mọi mutation task/dependency trong useTaskActions invalidate.
    await client.invalidateQueries({ queryKey: taskKeys.project(5) })
    await waitFor(() => expect(cpmService.get).toHaveBeenCalledTimes(2))
    client.clear()
  })

  it('tải lại khi job scheduling.cpm của dự án chuyển sang succeeded', async () => {
    vi.mocked(jobsService.list)
      .mockResolvedValueOnce([job({ status: 'running' }), job({ id: 2, project_id: 99, status: 'running' })])
      .mockResolvedValue([job({ status: 'succeeded', updated_at: '2026-10-01T00:01:00Z' }), job({ id: 2, project_id: 99, status: 'running' })])
    vi.mocked(cpmService.get).mockResolvedValue(schedule)
    const { wrapper, client } = setup()
    const { result } = renderHook(() => useCPM(5), { wrapper })
    await waitFor(() => expect(result.current.isRecalculating).toBe(true))
    expect(cpmService.get).toHaveBeenCalledTimes(1)
    await client.refetchQueries({ queryKey: ['durable-jobs'] })
    await waitFor(() => expect(result.current.isRecalculating).toBe(false))
    await waitFor(() => expect(cpmService.get).toHaveBeenCalledTimes(2))
    client.clear()
  })

  it('báo job CPM thất bại do vượt giới hạn', async () => {
    vi.mocked(jobsService.list).mockResolvedValue([job({ status: 'failed', error_code: 'resource_limit_exceeded' })])
    vi.mocked(cpmService.get).mockResolvedValue(schedule)
    const { wrapper, client } = setup()
    const { result } = renderHook(() => useCPM(5), { wrapper })
    await waitFor(() => expect(result.current.jobLimitExceeded).toBe(true))
    client.clear()
  })
})
