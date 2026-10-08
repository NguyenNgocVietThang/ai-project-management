import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types/auth.types'
import messages from '../../../../messages/en.json'
import { JobsPanel } from './JobsPanel'

const mocks = vi.hoisted(() => ({ jobs: vi.fn(), result: vi.fn(), refetch: vi.fn() }))
vi.mock('@/features/jobs/hooks/useJobs', () => ({ useJobs: mocks.jobs }))
vi.mock('@/features/ai/hooks/useAIGenerator', () => ({ useAIJob: mocks.result }))

beforeEach(() => {
  useAuthStore.setState({ user: { id: 1 } as User, accessToken: 'fixture', hasHydrated: true })
  mocks.jobs.mockReturnValue({ data: [{ id: 7, kind: 'ai.project_generate', status: 'succeeded', result: { ai_request_id: 4 }, created_at: '2026-10-08T10:00:00Z' }], refetch: mocks.refetch })
  mocks.result.mockReturnValue({ data: { status: 'COMPLETED', project_id: 3, result: { summary: 'A restored project plan' } } })
})

describe('recent jobs panel', () => {
  it('renders safely outside the query provider after logout', () => {
    useAuthStore.getState().clear()
    const mount = render(<JobsPanel />)
    expect(mount.container).toBeEmptyDOMElement()
  })

  it.each([
    ['ai_quota_exceeded', 'AI usage limit'],
    ['resource_limit_exceeded', 'processing size limit'],
    ['external_outcome_unknown', 'provider may have processed'],
    ['handler_failed', 'Reason: handler_failed'],
  ])('shows the sanitized failure reason for %s', async (code, message) => {
    mocks.jobs.mockReturnValue({ data: [{ id: 8, kind: 'scheduling.cpm', status: 'failed', error_code: code, created_at: '2026-10-08T10:00:00Z' }], refetch: mocks.refetch })
    render(<NextIntlClientProvider locale="en" messages={messages}><JobsPanel /></NextIntlClientProvider>)
    await userEvent.click(screen.getByText('Recent work'))
    expect(screen.getByText(new RegExp(message))).toBeVisible()
  })

  it('renders a recovered result and project link without resubmitting work', async () => {
    render(<NextIntlClientProvider locale="en" messages={messages}><JobsPanel /></NextIntlClientProvider>)
    const user = userEvent.setup()
    await user.click(screen.getByText('Recent work'))
    expect(screen.getByText('Completed')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'View result' }))
    expect(screen.getByText('A restored project plan')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Open project' })).toHaveAttribute('href', '/projects/3/overview')
    expect(mocks.result).toHaveBeenCalledWith('4')
  })

  it('distinguishes interrupted status checks from a failed job', async () => {
    mocks.jobs.mockReturnValue({ data: undefined, isError: true, error: { response: { status: 503 } }, refetch: mocks.refetch })
    render(<NextIntlClientProvider locale="en" messages={messages}><JobsPanel /></NextIntlClientProvider>)
    await userEvent.click(screen.getByText('Recent work'))
    expect(screen.getByRole('status')).toHaveTextContent('work may still be running')
    expect(screen.queryByText('Failed')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Check progress' }))
    expect(mocks.refetch).toHaveBeenCalled()
  })
})
