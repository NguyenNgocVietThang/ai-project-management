import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { aiService } from '@/services/ai.service'
import { useAIJob } from '@/features/ai/hooks/useAIGenerator'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types/auth.types'

vi.mock('@/services/ai.service', () => ({ aiService: { getJob: vi.fn() } }))

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
