import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { taskService } from '@/services/task.service'
import { taskKeys, useTaskActions } from './useTasks'
import type { ReactNode } from 'react'
import type { Task } from '@/types/task.types'

vi.mock('@/services/task.service', () => ({ taskService: { changeStatus: vi.fn() } }))

describe('task status cache', () => {
  it('preserves dependency arrays while optimistically updating only task lists', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    const edges = [{ id: 1, predecessor_id: 1, successor_id: 2 }]
    client.setQueryData(taskKeys.dependencies(1), edges)
    client.setQueryData(taskKeys.list(1, {}), { items: [{ id: 1, status: 'TODO' }], total: 1 })
    let resolve!: (value: Task) => void
    vi.mocked(taskService.changeStatus).mockReturnValue(new Promise(r => { resolve = r }))
    const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
    const { result } = renderHook(() => useTaskActions(1), { wrapper })
    act(() => result.current.changeStatus.mutate({ id: 1, status: 'IN_PROGRESS' }))
    await waitFor(() => expect(client.getQueryData(taskKeys.list(1, {}))).toMatchObject({ items: [{ status: 'IN_PROGRESS' }] }))
    expect(client.getQueryData(taskKeys.dependencies(1))).toEqual(edges)
    await act(async () => resolve({ id: 1, status: 'IN_PROGRESS' } as Task))
    client.clear()
  })
})
