import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'
import messages from '../../../messages/en.json'
import DashboardLayout from './layout'

const mocks = vi.hoisted(() => ({ adapter: vi.fn(), replace: vi.fn() }))
vi.mock('axios', async original => {
  const actual = await original<typeof import('axios')>()
  return { ...actual, default: { ...actual.default, create: (config: Parameters<typeof actual.default.create>[0]) => {
    const client = actual.default.create(config)
    client.defaults.adapter = mocks.adapter
    return client
  } } }
})
vi.mock('next/navigation', () => {
  const router = { replace: mocks.replace }
  return { useRouter: () => router, usePathname: () => '/dashboard' }
})
vi.mock('@/features/notifications/hooks/useNotifications', () => ({ useNotificationSocket: vi.fn() }))
vi.mock('@/features/notifications/components/NotificationBell', () => ({ NotificationBell: () => null }))
vi.mock('@/features/jobs/components/JobsPanel', () => ({ JobsPanel: () => null }))
vi.mock('@/components/layout/Navigation', () => ({ MainNav: () => null, MobileNav: () => null }))
vi.mock('@/components/layout/LanguageToggle', () => ({ LanguageToggle: () => null }))
vi.mock('@/components/theme/ThemeToggle', () => ({ ThemeToggle: () => null }))

beforeEach(() => {
  vi.clearAllMocks()
  useAuthStore.getState().clear()
  useAuthStore.setState({ hasHydrated: false })
  document.cookie = 'has-session=1; path=/'
})
afterEach(() => { cleanup(); useAuthStore.getState().clear() })

it('restores cookie identity through actual bootstrap and profile requests under StrictMode replay', async () => {
  const completions: (() => void)[] = []
  const requests: InternalAxiosRequestConfig[] = []
  const profile = { id: 1, full_name: 'Cookie restored fixture', email_verified: true, roles: [] }
  mocks.adapter.mockImplementation(async (config: InternalAxiosRequestConfig) => {
    requests.push(config)
    const response = (data: unknown): AxiosResponse => ({ data, status: 200, statusText: 'OK', headers: {}, config })
    if (config.url === '/auth/refresh') {
      expect(config.withCredentials).toBe(true)
      return new Promise(resolve => { completions.push(() => resolve(response({ access_token: 'fixture-restored', token_type: 'bearer' }))) })
    }
    expect(config.url).toBe('/auth/me')
    expect(config.headers.Authorization).toBe('Bearer fixture-restored')
    return response(profile)
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  expect(useAuthStore.getState().user).toBeNull()
  expect(useAuthStore.getState().accessToken).toBeNull()
  render(<StrictMode><QueryClientProvider client={client}><NextIntlClientProvider locale="en" messages={messages}><DashboardLayout><p>Restored workspace</p></DashboardLayout></NextIntlClientProvider></QueryClientProvider></StrictMode>)
  await waitFor(() => expect(completions.length).toBeGreaterThan(0))
  await act(async () => { completions.forEach(complete => complete()) })
  await screen.findByText('Restored workspace')
  await waitFor(() => expect(useAuthStore.getState().user).toEqual(profile))
  expect(mocks.replace).not.toHaveBeenCalled()
  expect(requests.filter(request => request.url === '/auth/refresh')).toHaveLength(1)
  expect(requests.some(request => request.url === '/auth/me')).toBe(true)
  expect(useAuthStore.getState().hasHydrated).toBe(true)
  client.clear()
})
