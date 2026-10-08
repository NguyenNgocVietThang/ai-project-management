import { act, renderHook, waitFor } from '@testing-library/react'
import { focusManager, onlineManager, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types/auth.types'
import { jobsService } from '@/services/jobs.service'
import { useJobs } from './useJobs'

vi.mock('@/services/jobs.service', () => ({ jobsService: { list: vi.fn(), get: vi.fn() } }))

function session(id: number) {
  useAuthStore.setState({ user: { id } as User, accessToken: 'test-memory-token', hasHydrated: true })
}

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
  return { client, wrapper }
}

beforeEach(() => { vi.resetAllMocks(); onlineManager.setOnline(true); session(1) })
afterEach(() => { useAuthStore.getState().clear(); vi.restoreAllMocks(); vi.useRealTimers(); focusManager.setFocused(undefined) })

describe('durable jobs recovery', () => {
  it('polls active work and stops when the server returns only terminal work', async () => {
    vi.useFakeTimers()
    vi.mocked(jobsService.list).mockResolvedValueOnce([{ id: 7, status: 'queued' }] as never)
      .mockResolvedValue([{ id: 7, status: 'succeeded' }] as never)
    const { wrapper, client } = setup()
    const mount = renderHook(() => useJobs(), { wrapper })
    await act(async () => { await vi.advanceTimersByTimeAsync(10) })
    expect(mount.result.current.data?.[0].status).toBe('queued')
    await act(async () => { await vi.advanceTimersByTimeAsync(5010) })
    expect(mount.result.current.data?.[0].status).toBe('succeeded')
    await act(async () => { await vi.advanceTimersByTimeAsync(60000) })
    expect(jobsService.list).toHaveBeenCalledTimes(2)
    mount.unmount(); client.clear()
  })

  it('stops timer and focus retries after access has been denied', async () => {
    vi.useFakeTimers()
    vi.mocked(jobsService.list).mockRejectedValue({ response: { status: 403 } })
    const { wrapper, client } = setup()
    const mount = renderHook(() => useJobs(), { wrapper })
    await act(async () => { await vi.advanceTimersByTimeAsync(10) })
    expect(mount.result.current.isError).toBe(true)
    act(() => { focusManager.setFocused(false); focusManager.setFocused(true) })
    await act(async () => { await vi.advanceTimersByTimeAsync(60000) })
    expect(jobsService.list).toHaveBeenCalledTimes(1)
    mount.unmount(); client.clear()
  })

  it('reloads authoritative jobs on remount without browser persistence', async () => {
    vi.mocked(jobsService.list).mockResolvedValue([{ id: 7, kind: 'ai.project_generate', status: 'queued' }] as never)
    const first = setup()
    const mount = renderHook(() => useJobs(), { wrapper: first.wrapper })
    await waitFor(() => expect(mount.result.current.data?.[0].id).toBe(7))
    mount.unmount(); first.client.clear()
    const second = setup()
    const reload = renderHook(() => useJobs(), { wrapper: second.wrapper })
    await waitFor(() => expect(reload.result.current.data?.[0].id).toBe(7))
    expect(jobsService.list).toHaveBeenCalledTimes(2)
    reload.unmount(); second.client.clear()
  })

  it('never displays the previous owner cache while a new owner request is pending', async () => {
    vi.mocked(jobsService.list).mockResolvedValueOnce([{ id: 7, status: 'succeeded' }] as never)
    const { wrapper, client } = setup()
    const mount = renderHook(() => useJobs(), { wrapper })
    await waitFor(() => expect(mount.result.current.data?.[0].id).toBe(7))
    vi.mocked(jobsService.list).mockReturnValue(new Promise(() => {}))
    act(() => session(2))
    await waitFor(() => expect(mount.result.current.data).toBeUndefined())
    mount.unmount(); client.clear()
  })

  it('pauses hidden or offline requests and resumes on visibility/online events', async () => {
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    const online = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
    vi.mocked(jobsService.list).mockResolvedValue([])
    const { wrapper, client } = setup()
    const mount = renderHook(() => useJobs(), { wrapper })
    expect(jobsService.list).not.toHaveBeenCalled()
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible')
    online.mockReturnValue(false)
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    expect(jobsService.list).not.toHaveBeenCalled()
    online.mockReturnValue(true)
    act(() => window.dispatchEvent(new Event('online')))
    await waitFor(() => expect(jobsService.list).toHaveBeenCalledOnce())
    mount.unmount(); client.clear()
  })

  it('does not request jobs until the user and session are hydrated', () => {
    useAuthStore.setState({ user: null, accessToken: null, hasHydrated: false })
    const { wrapper, client } = setup()
    const mount = renderHook(() => useJobs(), { wrapper })
    expect(jobsService.list).not.toHaveBeenCalled()
    mount.unmount(); client.clear()
  })

  it.each(['hidden', 'offline', 'logout'])('aborts an in-flight status request on %s', async (reason) => {
    let signal: AbortSignal | undefined
    vi.mocked(jobsService.list).mockImplementation((value) => {
      signal = value
      return new Promise(() => {})
    })
    const { wrapper, client } = setup()
    const mount = renderHook(() => useJobs(), { wrapper })
    await waitFor(() => expect(signal).toBeDefined())
    if (reason === 'hidden') {
      vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
      act(() => document.dispatchEvent(new Event('visibilitychange')))
    } else if (reason === 'offline') {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
      act(() => window.dispatchEvent(new Event('offline')))
    } else act(() => useAuthStore.getState().clear())
    await waitFor(() => expect(signal?.aborted).toBe(true))
    mount.unmount(); client.clear()
  })
})
