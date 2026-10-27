import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import en from '../../../../messages/en.json'
import type { RequirementBriefDetail } from '@/features/ai/types/requirementBrief.types'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types/auth.types'
import { AIGeneratorModal } from './AIGeneratorModal'

const mocks = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn(), push: vi.fn(), refetch: vi.fn() }))
vi.mock('@/services/api', () => ({ api: { get: mocks.get, post: mocks.post, patch: mocks.patch } }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }) }))
// Hook polling job sinh dự án phụ thuộc phiên đăng nhập; giả lập trạng thái job trực tiếp.
const jobState = vi.hoisted(() => ({ value: {} as Record<string, unknown> }))
vi.mock('@/features/ai/hooks/useAIGenerator', () => ({
  useAIJob: () => ({ isError: false, refetch: mocks.refetch, isFetching: false, pollingState: 'active', ...jobState.value }),
}))

const empty = { status: 'missing', value: null, source: null, proposed_assumption: null } as const

function brief(overrides: Partial<RequirementBriefDetail> = {}): RequirementBriefDetail {
  return {
    id: 11, idea: 'Sales visit tracker', status: 'clarifying', turn_count: 1, project_id: null, pending_job_id: null,
    created_at: '', updated_at: '',
    items: {
      goals: { status: 'clear', value: 'Track visits', source: 'user', proposed_assumption: null },
      stakeholders: { status: 'assumed', value: 'Sales reps', source: 'ai_assumption_confirmed', proposed_assumption: null },
      in_scope: { ...empty, proposed_assumption: 'Mobile check-in' },
      out_of_scope: { ...empty }, key_features: { ...empty }, constraints: { ...empty }, success_criteria: { ...empty },
    },
    qa_history: [
      { question: 'Who uses it?', answer: 'Field sales team', asked_at: null, answered_at: null, ai_request_id: 1 },
      { question: 'What is in scope?', answer: null, asked_at: null, answered_at: null, ai_request_id: 2 },
    ],
    pending_turn: null, max_turns: 8, turns_remaining: 6,
    item_counts: { clear: 1, missing: 5, assumed: 1, skipped: 0, total: 7, resolved: 2 },
    open_question: 'What is in scope?', can_finalize: false,
    ...overrides,
  }
}

function axiosError(status: number, detail: string) {
  return Object.assign(new Error(detail), { response: { status, data: { detail } } })
}

function renderModal() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const utils = render(
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale="en" messages={en} timeZone="UTC">
        <AIGeneratorModal open onClose={() => {}} />
      </NextIntlClientProvider>
    </QueryClientProvider>,
  )
  return { ...utils, client }
}

function serveBrief(detail: RequirementBriefDetail) {
  mocks.get.mockImplementation((url: string) =>
    url === '/requirement-briefs' ? Promise.resolve({ data: [] }) : Promise.resolve({ data: detail }))
}

beforeEach(() => {
  mocks.get.mockReset()
  mocks.post.mockReset()
  mocks.patch.mockReset()
  mocks.push.mockReset()
  mocks.refetch.mockReset()
  window.localStorage.clear()
  useAuthStore.setState({ user: { id: 1 } as User, accessToken: 'fixture', hasHydrated: true })
  jobState.value = { data: { status: 'PROCESSING', project_id: null } }
  serveBrief(brief())
})

describe('AI generator clarifier flow', () => {
  it('creates a brief from an idea, shows the running turn and stores the brief id', async () => {
    const running = brief({ qa_history: [], open_question: null, pending_turn: { job_id: 5, status: 'running' } })
    mocks.post.mockResolvedValue({ data: { brief: running, job_id: 5, ai_request_id: 9 } })
    serveBrief(running)
    renderModal()
    const user = userEvent.setup()
    await user.type(screen.getByRole('textbox', { name: 'Your project idea' }), 'Sales visit tracker')
    await user.click(screen.getByRole('button', { name: /Start clarifying/ }))
    expect(mocks.post).toHaveBeenCalledWith('/requirement-briefs', { idea: 'Sales visit tracker' })
    expect(await screen.findByText('AI is analyzing your answers...')).toBeVisible()
    expect(window.localStorage.getItem('ai.requirementBrief.activeId.owner:1')).toBe('11')
  })

  it('restores the conversation from the stored brief id after remount', async () => {
    window.localStorage.setItem('ai.requirementBrief.activeId.owner:1', '11')
    const first = renderModal()
    expect(await screen.findByText('Who uses it?')).toBeVisible()
    first.unmount()
    first.client.clear()
    renderModal()
    expect(await screen.findByText('Who uses it?')).toBeVisible()
    expect(screen.getByText('Field sales team')).toBeVisible()
    expect(screen.getByText('2/7 items resolved')).toBeVisible()
    expect(mocks.get).toHaveBeenCalledWith('/requirement-briefs/11', expect.anything())
  })

  it('marks assumptions distinctly from user-confirmed items and accepts proposals', async () => {
    window.localStorage.setItem('ai.requirementBrief.activeId.owner:1', '11')
    mocks.post.mockResolvedValue({ data: brief() })
    renderModal()
    const goals = await screen.findByTestId('item-goals')
    const stakeholders = screen.getByTestId('item-stakeholders')
    expect(within(goals).getByText('Confirmed')).toBeVisible()
    expect(within(goals).queryByText(/Assumption/)).not.toBeInTheDocument()
    expect(within(stakeholders).getByText('Assumption (accepted)')).toBeVisible()
    expect(stakeholders.className).toContain('border-dashed')
    expect(goals.className).not.toContain('border-dashed')
    const scope = screen.getByTestId('item-in_scope')
    expect(within(scope).getByText('Mobile check-in')).toBeVisible()
    await userEvent.setup().click(within(scope).getByRole('button', { name: 'Accept' }))
    expect(mocks.post).toHaveBeenCalledWith('/requirement-briefs/11/assumptions/in_scope/accept', {})
  })

  it('lets the user edit an item directly', async () => {
    window.localStorage.setItem('ai.requirementBrief.activeId.owner:1', '11')
    mocks.patch.mockResolvedValue({ data: brief() })
    renderModal()
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: 'Edit Constraints' }))
    await user.type(screen.getByRole('textbox', { name: 'Value for Constraints' }), 'Budget 10k')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(mocks.patch).toHaveBeenCalledWith('/requirement-briefs/11/items/constraints', { status: 'clear', value: 'Budget 10k' })
  })

  it('skips the remaining items and then queues project generation', async () => {
    window.localStorage.setItem('ai.requirementBrief.activeId.owner:1', '11')
    mocks.post.mockImplementation((url: string) => {
      if (url.endsWith('/skip')) return Promise.resolve({ data: brief({ status: 'ready' }) })
      return Promise.resolve({ data: { job_id: '77', status: 'PENDING', message: 'queued' } })
    })
    renderModal()
    await userEvent.setup().click(await screen.findByRole('button', { name: 'Skip, generate now' }))
    await waitFor(() => expect(mocks.post).toHaveBeenCalledWith('/ai/generate-project-from-brief', { brief_id: 11 }))
    expect(mocks.post.mock.calls[0][0]).toBe('/requirement-briefs/11/skip')
    expect(await screen.findByText('AI is drafting your project plan...')).toBeVisible()
    expect(window.localStorage.getItem('ai.requirementBrief.generationJobId.owner:1')).toBe('77')
  })

  it('shows turn-limit (409) and quota (429) errors in plain language', async () => {
    window.localStorage.setItem('ai.requirementBrief.activeId.owner:1', '11')
    mocks.post.mockRejectedValueOnce(axiosError(409, 'clarify_turn_limit'))
    renderModal()
    const user = userEvent.setup()
    await user.type(await screen.findByRole('textbox', { name: 'Your answer' }), 'Mobile check-in')
    await user.click(screen.getByRole('button', { name: 'Send answer' }))
    expect(await screen.findByText(/question limit has been reached/)).toBeVisible()

    mocks.post.mockRejectedValueOnce(axiosError(429, 'ai_quota_exceeded'))
    await user.click(screen.getByRole('button', { name: 'Send answer' }))
    expect(await screen.findByText(/AI usage limit has been reached/)).toBeVisible()
  })

  it('offers to retry a failed turn without a new answer', async () => {
    window.localStorage.setItem('ai.requirementBrief.activeId.owner:1', '11')
    serveBrief(brief({ pending_turn: { job_id: 5, status: 'failed' } }))
    mocks.post.mockResolvedValue({ data: { brief: brief(), job_id: 6, ai_request_id: 10 } })
    renderModal()
    await userEvent.setup().click(await screen.findByRole('button', { name: 'Retry this turn' }))
    expect(mocks.post).toHaveBeenCalledWith('/requirement-briefs/11/answer', { answer: null })
  })

  it('shows a retry action instead of an endless spinner when job status fails', async () => {
    window.localStorage.setItem('ai.requirementBrief.generationJobId.owner:1', '77')
    jobState.value = { isError: true, error: new Error('Status unavailable') }
    renderModal()
    await userEvent.setup().click(await screen.findByRole('button', { name: 'Retry' }))
    expect(mocks.refetch).toHaveBeenCalledOnce()
    expect(screen.queryByText('AI is drafting your project plan...')).not.toBeInTheDocument()
  })

  it('navigates to the generated project once the job completes', async () => {
    window.localStorage.setItem('ai.requirementBrief.generationJobId.owner:1', '77')
    jobState.value = { data: { status: 'COMPLETED', project_id: 42 } }
    renderModal()
    await userEvent.setup().click(await screen.findByRole('button', { name: 'View project' }))
    expect(mocks.push).toHaveBeenCalledWith('/projects/42/overview')
    expect(window.localStorage.getItem('ai.requirementBrief.generationJobId.owner:1')).toBeNull()
  })
})


afterEach(() => { vi.useRealTimers() })
describe('observable durable recovery', () => {
  it.each([
    [{}, 'Checking the saved job status...'],
    [{ data: { status: 'PENDING' } }, 'Your project is queued.'],
    [{ data: { status: 'PROCESSING' } }, 'AI is drafting your project plan...'],
    [{ pollingState: 'offline', data: { status: 'PROCESSING' } }, 'You are offline. Reconnect to check the saved job.'],
    [{ pollingState: 'hidden', data: { status: 'PROCESSING' } }, 'Status checks are paused while this tab is hidden. Return to this tab to continue.'],
    [{ isError: true }, 'The job status could not be loaded. Check again to recover the latest result.'],
    [{ data: { status: 'FAILED' } }, en.clarifier.generationFailed],
    [{ data: { status: 'COMPLETED' } }, 'The job completed, but its project link is missing. Check the status again.'],
  ])('reports state %j', async (state, text) => {
    window.localStorage.setItem('ai.requirementBrief.generationJobId.owner:1', '77')
    jobState.value = state
    renderModal()
    expect(await screen.findByText(text)).toBeVisible()
    if (!('data' in state) || state.data?.status !== 'PROCESSING' || 'pollingState' in state) expect(screen.queryByText(en.clarifier.generating)).not.toBeInTheDocument()
    expect(mocks.post).not.toHaveBeenCalled()
  })
  it('preserves legacy keys unassigned and waits for an owner', async () => {
    useAuthStore.setState({ user: null })
    window.localStorage.setItem('ai.requirementBrief.activeId', '99')
    window.localStorage.setItem('ai.requirementBrief.generationJobId', 'legacy')
    renderModal()
    expect(screen.getByText('Restoring your session before loading saved work...')).toBeVisible()
    expect(mocks.get).not.toHaveBeenCalled()
    act(() => useAuthStore.setState({ user: { id: 2 } as User }))
    expect(await screen.findByRole('textbox', { name: 'Your project idea' })).toBeVisible()
    expect(window.localStorage.getItem('ai.requirementBrief.activeId')).toBe('99')
    expect(window.localStorage.getItem('ai.requirementBrief.generationJobId')).toBe('legacy')
    expect(window.localStorage.getItem('ai.requirementBrief.generationJobId.owner:2')).toBeNull()
  })
  it('hides the old job after logout or account change', async () => {
    window.localStorage.setItem('ai.requirementBrief.generationJobId.owner:1', '77')
    jobState.value = { data: { status: 'COMPLETED', project_id: 42 } }
    renderModal()
    expect(await screen.findByRole('button', { name: 'View project' })).toBeVisible()
    act(() => useAuthStore.getState().clear())
    expect(screen.queryByRole('button', { name: 'View project' })).not.toBeInTheDocument()
    act(() => useAuthStore.setState({ user: { id: 2 } as User, accessToken: 'second' }))
    expect(await screen.findByRole('textbox', { name: 'Your project idea' })).toBeVisible()
  })
  it('reopens the saved job for the same owner without POST', async () => {
    window.localStorage.setItem('ai.requirementBrief.generationJobId.owner:1', '77')
    const first = renderModal()
    expect(await screen.findByText(en.clarifier.generating)).toBeVisible()
    first.unmount(); first.client.clear(); renderModal()
    expect(await screen.findByText(en.clarifier.generating)).toBeVisible()
    expect(mocks.post).not.toHaveBeenCalled()
  })
  it('offers a GET check after 120 seconds without declaring failure', async () => {
    window.localStorage.setItem('ai.requirementBrief.generationJobId.owner:1', '77')
    vi.useFakeTimers()
    renderModal()
    await act(async () => { await vi.advanceTimersByTimeAsync(120000) })
    expect(screen.getByText('This is taking longer than expected. Your saved job can still complete.')).toBeVisible()
    await act(async () => screen.getByRole('button', { name: 'Check status' }).click())
    expect(mocks.refetch).toHaveBeenCalledOnce()
    expect(mocks.post).not.toHaveBeenCalled()
    expect(window.localStorage.getItem('ai.requirementBrief.generationJobId.owner:1')).toBe('77')
    expect(screen.queryByText(en.clarifier.generationFailed)).not.toBeInTheDocument()
  })
})


describe('pending generation account boundaries', () => {
  it('does not persist a late generation response into the next owner', async () => {
    window.localStorage.setItem('ai.requirementBrief.activeId.owner:1', '11')
    let resolve!: (response: unknown) => void
    mocks.post.mockImplementation((url: string) => url.endsWith('/skip')
      ? Promise.resolve({ data: brief({ status: 'ready' }) })
      : new Promise(done => { resolve = done }))
    renderModal()
    await userEvent.setup().click(await screen.findByRole('button', { name: 'Skip, generate now' }))
    await waitFor(() => expect(resolve).toBeDefined())
    act(() => { useAuthStore.getState().clear(); useAuthStore.setState({ user: { id: 2 } as User, accessToken: 'second' }) })
    await act(async () => resolve({ data: { job_id: 'old-owner', status: 'PENDING' } }))
    expect(await screen.findByRole('textbox', { name: 'Your project idea' })).toBeVisible()
    expect(window.localStorage.getItem('ai.requirementBrief.generationJobId.owner:2')).toBeNull()
    expect(window.localStorage.getItem('ai.requirementBrief.generationJobId.owner:1')).toBeNull()
  })
  it('does not enqueue after the owner changes during finalization', async () => {
    window.localStorage.setItem('ai.requirementBrief.activeId.owner:1', '11')
    let resolve!: (response: unknown) => void
    mocks.post.mockImplementation(() => new Promise(done => { resolve = done }))
    renderModal()
    await userEvent.setup().click(await screen.findByRole('button', { name: 'Skip, generate now' }))
    act(() => { useAuthStore.getState().clear(); useAuthStore.setState({ user: { id: 2 } as User, accessToken: 'second' }) })
    await act(async () => resolve({ data: brief({ status: 'ready' }) }))
    expect(mocks.post.mock.calls.map(call => call[0])).toEqual(['/requirement-briefs/11/skip'])
  })
})
