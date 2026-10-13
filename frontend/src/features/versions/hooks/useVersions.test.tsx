import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useVersionDiff } from '@/features/versions/hooks/useVersions'

const mocks = vi.hoisted(() => ({ get: vi.fn() }))
vi.mock('@/services/api', () => ({ api: { get: mocks.get, post: vi.fn() } }))

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

beforeEach(() => mocks.get.mockReset())

describe('useVersionDiff', () => {
  it('gọi endpoint diff, không gọi endpoint snapshot', async () => {
    mocks.get.mockResolvedValue({ data: { truncated: false } })
    const { result } = renderHook(() => useVersionDiff(7, 1, 'current'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mocks.get).toHaveBeenCalledWith('/projects/7/versions/1/diff/current')
    expect(mocks.get.mock.calls[0][0]).not.toContain('include_snapshot')
  })

  it('không gọi khi chưa chọn đủ hoặc chọn trùng phiên bản', () => {
    renderHook(() => useVersionDiff(7, 1, null), { wrapper })
    renderHook(() => useVersionDiff(7, 2, 2), { wrapper })
    expect(mocks.get).not.toHaveBeenCalled()
  })
})
