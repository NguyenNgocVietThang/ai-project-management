import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import en from '../../../../messages/en.json'
import type { RequirementBriefDetail } from '@/features/ai/types/requirementBrief.types'
import { AIGeneratorModal } from './AIGeneratorModal'

const mocks = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn(), push: vi.fn(), refetch: vi.fn() }))
vi.mock('@/services/api', () => ({ api: { get: mocks.get, post: mocks.post, patch: mocks.patch } }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }) }))
// Hook polling job sinh dự án phụ thuộc phiên đăng nhập; giả lập trạng thái job trực tiếp.
const jobState = vi.hoisted(() => ({ value: {} as Record<string, unknown> }))
vi.mock('@/features/ai/hooks/useAIGenerator', () => ({
  useAIJob: () => ({ isError: false, refetch: mocks.refetch, isFetching: false, ...jobState.value }),
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
    expect(window.localStorage.getItem('ai.requirementBrief.activeId')).toBe('11')
  })

  it('restores the conversation from the stored brief id after remount', async () => {
    window.localStorage.setItem('ai.requirementBrief.activeId', '11')
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
    window.localStorage.setItem('ai.requirementBrief.activeId', '11')
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
    window.localStorage.setItem('ai.requirementBrief.activeId', '11')
    mocks.patch.mockResolvedValue({ data: brief() })
    renderModal()
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: 'Edit Constraints' }))
    await user.type(screen.getByRole('textbox', { name: 'Value for Constraints' }), 'Budget 10k')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(mocks.patch).toHaveBeenCalledWith('/requirement-briefs/11/items/constraints', { status: 'clear', value: 'Budget 10k' })
  })

  it('skips the remaining items and then queues project generation', async () => {
    window.localStorage.setItem('ai.requirementBrief.activeId', '11')
    mocks.post.mockImplementation((url: string) => {
      if (url.endsWith('/skip')) return Promise.resolve({ data: brief({ status: 'ready' }) })
      return Promise.resolve({ data: { job_id: '77', status: 'PENDING', message: 'queued' } })
    })
    renderModal()
    await userEvent.setup().click(await screen.findByRole('button', { name: 'Skip, generate now' }))
    await waitFor(() => expect(mocks.post).toHaveBeenCalledWith('/ai/generate-project-from-brief', { brief_id: 11 }))
    expect(mocks.post.mock.calls[0][0]).toBe('/requirement-briefs/11/skip')
    expect(await screen.findByText('AI is drafting your project plan...')).toBeVisible()
    expect(window.localStorage.getItem('ai.requirementBrief.generationJobId')).toBe('77')
  })

  it('shows turn-limit (409) and quota (429) errors in plain language', async () => {
    window.localStorage.setItem('ai.requirementBrief.activeId', '11')
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
    window.localStorage.setItem('ai.requirementBrief.activeId', '11')
    serveBrief(brief({ pending_turn: { job_id: 5, status: 'failed' } }))
    mocks.post.mockResolvedValue({ data: { brief: brief(), job_id: 6, ai_request_id: 10 } })
    renderModal()
    await userEvent.setup().click(await screen.findByRole('button', { name: 'Retry this turn' }))
    expect(mocks.post).toHaveBeenCalledWith('/requirement-briefs/11/answer', { answer: null })
  })

  it('shows a retry action instead of an endless spinner when job status fails', async () => {
    window.localStorage.setItem('ai.requirementBrief.generationJobId', '77')
    jobState.value = { isError: true, error: new Error('Status unavailable') }
    renderModal()
    await userEvent.setup().click(await screen.findByRole('button', { name: 'Retry' }))
    expect(mocks.refetch).toHaveBeenCalledOnce()
    expect(screen.queryByText('AI is drafting your project plan...')).not.toBeInTheDocument()
  })

  it('navigates to the generated project once the job completes', async () => {
    window.localStorage.setItem('ai.requirementBrief.generationJobId', '77')
    jobState.value = { data: { status: 'COMPLETED', project_id: 42 } }
    renderModal()
    await userEvent.setup().click(await screen.findByRole('button', { name: 'View project' }))
    expect(mocks.push).toHaveBeenCalledWith('/projects/42/overview')
    expect(window.localStorage.getItem('ai.requirementBrief.generationJobId')).toBeNull()
  })
})
