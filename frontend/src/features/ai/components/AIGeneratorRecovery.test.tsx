import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import en from '../../../../messages/en.json'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types/auth.types'
import { AIGeneratorModal } from './AIGeneratorModal'

const mocks = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), push: vi.fn(), replace: vi.fn() }))
vi.mock('@/services/api', () => ({ api: { get: mocks.get, post: mocks.post } }))
vi.mock('@/services/auth.service', () => ({ authService: { me: vi.fn() } }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push, replace: mocks.replace }) }))
vi.mock('@/i18n/useApiErrorMessage', () => ({ useApiErrorMessage: () => () => 'error' }))
const clients: QueryClient[] = []
function SessionAndModal() { useAuth(); return <AIGeneratorModal open onClose={() => {}} /> }
function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  clients.push(client)
  return { client, ...render(<QueryClientProvider client={client}><NextIntlClientProvider locale="en" messages={en} timeZone="UTC"><SessionAndModal /></NextIntlClientProvider></QueryClientProvider>) }
}
beforeEach(() => {
  vi.resetAllMocks(); window.localStorage.clear(); useAuthStore.getState().clear()
  useAuthStore.getState().setTokens({ access_token: 'restored-fixture', token_type: 'bearer' })
  useAuthStore.setState({ user: null, hasHydrated: true })
  mocks.get.mockImplementation((url: string) => Promise.resolve({ data: url === '/ai/jobs/77'
    ? { job_id: '77', status: 'COMPLETED', project_id: 42, result: {}, error: null } : [] }))
})
afterEach(() => { cleanup(); clients.splice(0).forEach(client => client.clear()); useAuthStore.getState().clear() })

describe('real restored identity and owner-scoped recovery', () => {
  it('starts with user=null, recovers only after /auth/me, invalidates projects and reloads without POST', async () => {
    let resolve!: (user: User) => void
    vi.mocked(authService.me).mockImplementation(() => new Promise(done => { resolve = done }))
    window.localStorage.setItem('ai.requirementBrief.generationJobId.owner:1', '77')
    const first = mount()
    const invalidation = vi.spyOn(first.client, 'invalidateQueries')
    expect(screen.getByText(en.clarifier.restoringSession)).toBeVisible()
    expect(mocks.get).not.toHaveBeenCalled()
    await waitFor(() => expect(resolve).toBeDefined())
    await act(async () => resolve({ id: 1 } as User))
    expect(await screen.findByRole('button', { name: en.clarifier.viewProject })).toBeVisible()
    expect(mocks.get).toHaveBeenCalledWith('/ai/jobs/77', expect.objectContaining({ signal: expect.any(AbortSignal) }))
    expect(invalidation).toHaveBeenCalledWith({ queryKey: ['projects'] })
    first.unmount(); first.client.clear()
    useAuthStore.getState().clear()
    useAuthStore.getState().setTokens({ access_token: 'reload-fixture', token_type: 'bearer' })
    vi.mocked(authService.me).mockResolvedValue({ id: 1 } as User)
    mount()
    expect(await screen.findByRole('button', { name: en.clarifier.viewProject })).toBeVisible()
    expect(mocks.post).not.toHaveBeenCalled()
  })
  it('does not read owner storage or GET the old job until a restored different owner is known', async () => {
    window.localStorage.setItem('ai.requirementBrief.generationJobId.owner:1', '77')
    window.localStorage.setItem('ai.requirementBrief.activeId.owner:1', '11')
    vi.mocked(authService.me).mockResolvedValue({ id: 2 } as User)
    mount()
    expect(await screen.findByRole('textbox', { name: en.clarifier.ideaLabel })).toBeVisible()
    expect(mocks.get.mock.calls.map(call => call[0])).toEqual(['/requirement-briefs'])
    expect(screen.queryByRole('button', { name: en.clarifier.viewProject })).not.toBeInTheDocument()
    expect(mocks.post).not.toHaveBeenCalled()
  })
})
