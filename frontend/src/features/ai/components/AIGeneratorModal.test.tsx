import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { AIGeneratorModal } from './AIGeneratorModal'

const mocks = vi.hoisted(() => ({ generate: vi.fn(), refetch: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('@/features/ai/hooks/useAIGenerator', () => ({
  useGenerateProject: () => ({ mutateAsync: mocks.generate, reset: vi.fn(), isPending: false, isError: false }),
  useAIJob: (id: string | null) => ({ isError: Boolean(id), error: new Error('Status unavailable'), refetch: mocks.refetch, isFetching: false }),
}))

describe('AI generator recovery', () => {
  it('shows a retry action instead of an endless spinner when job status fails', async () => {
    mocks.generate.mockResolvedValue({ job_id: '7' })
    const client = new QueryClient()
    render(<QueryClientProvider client={client}><AIGeneratorModal open onClose={() => {}} /></QueryClientProvider>)
    const user = userEvent.setup()
    await user.type(screen.getByRole('textbox', { name: 'Project prompt' }), 'Build a team planning workspace')
    await user.click(screen.getByRole('button', { name: 'Generate', exact: true }))
    expect(await screen.findByRole('button', { name: 'Retry status check' })).toBeVisible()
    expect(screen.queryByText('Queued…')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Retry status check' }))
    expect(mocks.refetch).toHaveBeenCalledOnce()
    client.clear()
  })
})
