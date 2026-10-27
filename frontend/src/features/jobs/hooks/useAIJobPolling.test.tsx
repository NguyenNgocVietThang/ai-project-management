import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'
import { aiService } from '@/services/ai.service'
import { useAIJob } from '@/features/ai/hooks/useAIGenerator'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types/auth.types'

vi.mock('@/services/ai.service', () => ({ aiService: { getJob: vi.fn(), generateProject: vi.fn() } }))

beforeEach(() => {
  vi.useFakeTimers()
  vi.mocked(aiService.getJob).mockReset()
  useAuthStore.setState({ user: { id: 1 } as User, accessToken: 'fixture', hasHydrated: true })
})
afterEach(() => { vi.useRealTimers(); useAuthStore.getState().clear() })

describe('AI polling execution', () => {
  it('recovers after backend sleep and stops on completion and unmount', async () => {
    vi.mocked(aiService.getJob).mockRejectedValueOnce({ response: { status: 503 } })
      .mockResolvedValue({ job_id: '4', status: 'COMPLETED', result: {}, error: null, project_id: 3 })
    const client = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
    const mount = renderHook(() => useAIJob('4'), { wrapper })
    await act(async () => { await vi.advanceTimersByTimeAsync(10) })
    expect(mount.result.current.isError).toBe(true)
    await act(async () => { await vi.advanceTimersByTimeAsync(5010) })
    expect(mount.result.current.data?.status).toBe('COMPLETED')
    await act(async () => { await vi.advanceTimersByTimeAsync(60000) })
    expect(aiService.getJob).toHaveBeenCalledTimes(2)
    mount.unmount()
    await act(async () => { await vi.advanceTimersByTimeAsync(60000) })
    expect(aiService.getJob).toHaveBeenCalledTimes(2)
    client.clear()
  })
})

// Restored sessions must recover durable work through owner-authorized GET only.
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn() }) }))
vi.mock('@/i18n/useApiErrorMessage', () => ({ useApiErrorMessage: () => () => 'error' }))
vi.mock('@/services/auth.service', () => ({ authService: { me: vi.fn() } }))


describe('restored session polling', () => {
  it.each([true, false])('requires a restored owner before GET (profile success: %s) and never POSTs', async (success) => {
    useAuthStore.setState({ user: null, accessToken: 'fixture-restored', hasHydrated: true })
    vi.mocked(aiService.generateProject).mockReset()
    if (success) vi.mocked(authService.me).mockResolvedValue({ id: 1 } as User)
    else vi.mocked(authService.me).mockRejectedValue({ response: { status: 503 } })
    vi.mocked(aiService.getJob).mockResolvedValue({ job_id: 'restored', status: 'COMPLETED', result: {}, error: null, project_id: 3 })
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
    const mount = renderHook(() => { useAuth(); return useAIJob('restored') }, { wrapper })
    await act(async () => { await vi.advanceTimersByTimeAsync(50) })
    await act(async () => { await vi.advanceTimersByTimeAsync(10) })
    if (success) {
      expect(useAuthStore.getState().user?.id).toBe(1)
      expect(aiService.getJob).toHaveBeenCalledWith('restored', expect.any(AbortSignal))
      expect(mount.result.current.data?.status).toBe('COMPLETED')
    } else {
      expect(useAuthStore.getState().user).toBeNull()
      expect(aiService.getJob).not.toHaveBeenCalled()
    }
    expect(aiService.generateProject).not.toHaveBeenCalled()
    mount.unmount()
    client.clear()
  })
})


describe('manual recovery GET boundaries', () => {
  it.each(['anonymous', 'offline', 'hidden', 'logout', 'account switch'])('rejects retained refetch after %s', async boundary => {
    vi.mocked(aiService.getJob).mockResolvedValue({ job_id: '4', status: 'PROCESSING', result: null, error: null, project_id: null })
    const client = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
    const mount = renderHook(() => useAIJob('4'), { wrapper })
    await act(async () => { await vi.advanceTimersByTimeAsync(10) })
    const retainedRefetch = mount.result.current.refetch
    act(() => {
      if (boundary === 'anonymous') useAuthStore.setState({ user: null })
      if (boundary === 'logout') useAuthStore.getState().clear()
      if (boundary === 'account switch') useAuthStore.setState({ user: { id: 2 } as User })
      if (boundary === 'offline') Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })
      if (boundary === 'hidden') Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true })
    })
    vi.mocked(aiService.getJob).mockClear()
    await act(async () => { await retainedRefetch() })
    expect(aiService.getJob).not.toHaveBeenCalled()
    mount.unmount(); client.clear()
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
  })
})


it('does not automatically GET or display the previous owner job after account switch', async () => {
  vi.mocked(aiService.getJob).mockResolvedValue({ job_id: '4', status: 'COMPLETED', result: {}, error: null, project_id: 3 })
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
  const mount = renderHook(() => useAIJob('4'), { wrapper })
  await act(async () => { await vi.advanceTimersByTimeAsync(10) })
  expect(mount.result.current.data?.project_id).toBe(3)
  vi.mocked(aiService.getJob).mockClear()
  act(() => { useAuthStore.getState().clear(); useAuthStore.setState({ user: { id: 2 } as User, accessToken: 'second' }) })
  await act(async () => { await vi.advanceTimersByTimeAsync(10) })
  expect(mount.result.current.data).toBeUndefined()
  expect(aiService.getJob).not.toHaveBeenCalled()
  mount.unmount(); client.clear()
})
