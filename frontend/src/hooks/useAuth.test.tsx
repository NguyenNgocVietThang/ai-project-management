import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types/auth.types'
import { useAuth } from './useAuth'

const mocks = vi.hoisted(() => ({ replace: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: mocks.replace }) }))
vi.mock('@/i18n/useApiErrorMessage', () => ({ useApiErrorMessage: () => () => 'error' }))
vi.mock('@/services/auth.service', () => ({ authService: {
  me: vi.fn(), login: vi.fn(), register: vi.fn(), logout: vi.fn(), resendEmailVerification: vi.fn(),
} }))

const first = { id: 1, full_name: 'First fixture' } as User
const second = { id: 2, full_name: 'Second fixture' } as User
const credentials = { email: 'fixture@example.test', password: 'test-fixture' }
const clients: QueryClient[] = []
function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>(done => { resolve = done })
  return { promise, resolve }
}
function mountAuth() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  clients.push(client)
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
  return { ...renderHook(() => useAuth(), { wrapper }), client }
}
function startSession(token = 'fixture-first') {
  useAuthStore.getState().setTokens({ access_token: token, token_type: 'bearer' })
  useAuthStore.setState({ user: null, hasHydrated: true })
}
beforeEach(() => {
  vi.resetAllMocks()
  useAuthStore.getState().clear()
  useAuthStore.setState({ hasHydrated: true })
})
afterEach(() => { cleanup(); clients.splice(0).forEach(client => client.clear()); useAuthStore.getState().clear() })

describe('current session identity', () => {
  it('synchronizes a restored profile into the owner store', async () => {
    startSession()
    vi.mocked(authService.me).mockResolvedValue(first)
    const mount = mountAuth()
    await waitFor(() => expect(mount.result.current.user).toEqual(first))
    expect(useAuthStore.getState().user).toEqual(first)
  })

  it('does not reuse the previous account profile while the next profile loads', async () => {
    startSession()
    vi.mocked(authService.me).mockResolvedValueOnce(first)
    const mount = mountAuth()
    await waitFor(() => expect(mount.result.current.user).toEqual(first))
    const next = deferred<User>()
    vi.mocked(authService.me).mockReturnValueOnce(next.promise)
    act(() => { useAuthStore.getState().clear(); startSession('fixture-second') })
    expect(mount.result.current.user).toBeNull()
    await act(async () => next.resolve(second))
    await waitFor(() => expect(mount.result.current.user).toEqual(second))
    expect(useAuthStore.getState().user).toEqual(second)
    expect(mount.client.getQueryCache().getAll().some(query => query.state.data === first)).toBe(false)
  })

  it.each(['logout', 'account switch', 'same-token reauthentication'])('discards a pending profile after %s', async (boundary) => {
    startSession()
    const pending = deferred<User>()
    vi.mocked(authService.me).mockReturnValueOnce(pending.promise)
    const mount = mountAuth()
    await waitFor(() => expect(authService.me).toHaveBeenCalledTimes(1))
    vi.mocked(authService.me).mockResolvedValue(second)
    act(() => {
      useAuthStore.getState().clear()
      if (boundary !== 'logout') startSession(boundary === 'account switch' ? 'fixture-second' : 'fixture-first')
    })
    await act(async () => pending.resolve(first))
    if (boundary === 'logout') {
      expect(mount.result.current.user).toBeNull()
      expect(useAuthStore.getState().user).toBeNull()
    } else {
      await waitFor(() => expect(mount.result.current.user).toEqual(second))
      expect(useAuthStore.getState().user).toEqual(second)
    }
    expect(mount.client.getQueryCache().getAll().some(query => query.state.data === first)).toBe(false)
  })

  it('keeps a failed restored profile anonymous', async () => {
    startSession()
    vi.mocked(authService.me).mockRejectedValue({ response: { status: 503 } })
    const mount = mountAuth()
    await waitFor(() => expect(mount.client.isFetching()).toBe(0))
    expect(mount.result.current.user).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('accepts the current profile after access token rotation', async () => {
    startSession()
    const pending = deferred<User>()
    vi.mocked(authService.me).mockReturnValueOnce(pending.promise).mockResolvedValue(first)
    const mount = mountAuth()
    await waitFor(() => expect(authService.me).toHaveBeenCalled())
    act(() => useAuthStore.getState().setTokens({ access_token: 'fixture-rotated', token_type: 'bearer' }))
    await act(async () => pending.resolve(first))
    await waitFor(() => expect(useAuthStore.getState().user).toEqual(first))
    expect(mount.result.current.user).toEqual(first)
  })

  it.each([['login', 'logout'], ['register', 'logout'], ['resend', 'logout'], ['login', 'account switch'], ['register', 'account switch'], ['resend', 'account switch']] as const)('rejects a late direct %s profile after %s', async (path, boundary) => {
    const pending = deferred<User>()
    vi.mocked(authService.login).mockResolvedValue({ access_token: 'fixture-login', token_type: 'bearer' })
    vi.mocked(authService.register).mockResolvedValue(first)
    vi.mocked(authService.resendEmailVerification).mockResolvedValue({ message: 'sent' })
    vi.mocked(authService.me).mockReturnValue(pending.promise)
    if (path === 'resend') { startSession(); useAuthStore.getState().setUser(first) }
    const mount = mountAuth()
    let operation!: Promise<unknown>
    act(() => {
      operation = path === 'login' ? mount.result.current.login(credentials)
        : path === 'register' ? mount.result.current.register({ ...credentials, username: 'fixture', full_name: 'Fixture' })
        : mount.result.current.resendEmailVerification()
    })
    await waitFor(() => expect(authService.me).toHaveBeenCalled())
    act(() => {
      useAuthStore.getState().clear()
      if (boundary === 'account switch') { startSession('fixture-second'); useAuthStore.getState().setUser(second) }
    })
    await act(async () => { pending.resolve(first); await operation })
    expect(useAuthStore.getState().user).toEqual(boundary === 'logout' ? null : second)
    expect(mount.result.current.user).toEqual(boundary === 'logout' ? null : second)
    expect(mount.client.getQueryCache().getAll().some(query => query.state.data === first)).toBe(false)
    expect(mocks.replace).not.toHaveBeenCalledWith('/dashboard')
  })

  it('loads a direct login profile and navigates', async () => {
    vi.mocked(authService.login).mockResolvedValue({ access_token: 'fixture-login', token_type: 'bearer' })
    vi.mocked(authService.me).mockResolvedValue(first)
    const mount = mountAuth()
    await act(async () => { await mount.result.current.login(credentials) })
    expect(useAuthStore.getState().user).toEqual(first)
    expect(mount.result.current.user).toEqual(first)
    expect(mocks.replace).toHaveBeenCalledWith('/dashboard')
  })

  it('invalidates identity immediately while server logout is still pending', async () => {
    startSession()
    const profile = deferred<User>()
    const serverLogout = deferred<void>()
    vi.mocked(authService.me).mockReturnValue(profile.promise)
    vi.mocked(authService.logout).mockReturnValue(serverLogout.promise)
    const mount = mountAuth()
    await waitFor(() => expect(authService.me).toHaveBeenCalled())
    let logout!: Promise<void>
    act(() => { logout = mount.result.current.logout() })
    expect(useAuthStore.getState().accessToken).toBeNull()
    await act(async () => profile.resolve(first))
    expect(mount.result.current.user).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
    await act(async () => { serverLogout.resolve(); await logout })
    expect(mocks.replace).toHaveBeenCalledWith('/login')
  })

  it.each(['register', 'resend'] as const)('synchronizes a successful direct %s profile', async path => {
    vi.mocked(authService.login).mockResolvedValue({ access_token: 'fixture-login', token_type: 'bearer' })
    vi.mocked(authService.register).mockResolvedValue(first)
    vi.mocked(authService.resendEmailVerification).mockResolvedValue({ message: 'sent' })
    vi.mocked(authService.me).mockResolvedValue(first)
    if (path === 'resend') { startSession(); useAuthStore.getState().setUser({ ...first, full_name: 'Before resend' }) }
    const mount = mountAuth()
    await act(async () => {
      if (path === 'register') await mount.result.current.register({ ...credentials, username: 'fixture', full_name: 'Fixture' })
      else await mount.result.current.resendEmailVerification()
    })
    expect(useAuthStore.getState().user).toEqual(first)
    expect(mount.result.current.user).toEqual(first)
    if (path === 'register') expect(mocks.replace).toHaveBeenCalledWith('/dashboard')
  })
})
