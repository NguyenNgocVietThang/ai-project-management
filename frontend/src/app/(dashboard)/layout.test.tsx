import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types/auth.types'
import messages from '../../../messages/en.json'
import DashboardLayout from './layout'

const mocks = vi.hoisted(() => ({ bootstrap: vi.fn(), replace: vi.fn() }))
vi.mock('next/navigation', () => {
  const router = { replace: mocks.replace }
  return { useRouter: () => router, usePathname: () => '/dashboard' }
})
vi.mock('@/services/api', () => ({ bootstrapSession: mocks.bootstrap }))
vi.mock('@/store/authStore', async (original) => ({ ...await original<typeof import('@/store/authStore')>(), hasSessionCookie: () => true }))
vi.mock('@/services/auth.service', () => ({ authService: { me: vi.fn() } }))
vi.mock('@/features/notifications/hooks/useNotifications', () => ({ useNotificationSocket: vi.fn() }))
vi.mock('@/features/notifications/components/NotificationBell', () => ({ NotificationBell: () => null }))
vi.mock('@/features/jobs/components/JobsPanel', () => ({ JobsPanel: () => null }))
vi.mock('@/components/layout/Navigation', () => ({ MainNav: () => null, MobileNav: () => null }))
vi.mock('@/components/layout/LanguageToggle', () => ({ LanguageToggle: () => null }))
vi.mock('@/components/theme/ThemeToggle', () => ({ ThemeToggle: () => null }))

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(authService.me).mockResolvedValue({ id: 1, full_name: 'Restored fixture', email_verified: true, roles: [] } as unknown as User)
  useAuthStore.setState({ user: null, accessToken: null, hasHydrated: false })
})

describe('dashboard session recovery', () => {
  it('keeps a transient bootstrap failure recoverable and restores on retry', async () => {
    mocks.bootstrap.mockRejectedValueOnce({ response: { status: 503 } }).mockImplementationOnce(async () => {
      useAuthStore.setState({ user: null, accessToken: 'fixture' })
      return true
    })
    render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><NextIntlClientProvider locale="en" messages={messages}><DashboardLayout><p>Restored workspace</p></DashboardLayout></NextIntlClientProvider></QueryClientProvider>)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('work may still be running'))
    expect(useAuthStore.getState().hasHydrated).toBe(false)
    expect(mocks.replace).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Check progress' }))
    await screen.findByText('Restored workspace')
    await waitFor(() => expect(useAuthStore.getState().user?.id).toBe(1))
    expect(screen.getByText('Restored fixture')).toBeInTheDocument()
    expect(mocks.bootstrap).toHaveBeenCalledTimes(2)
    expect(useAuthStore.getState().hasHydrated).toBe(true)
    expect(mocks.replace).not.toHaveBeenCalled()
  })

  it('redirects after a definitive invalid refresh session', async () => {
    mocks.bootstrap.mockResolvedValue(false)
    render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><NextIntlClientProvider locale="en" messages={messages}><DashboardLayout><p>Workspace</p></DashboardLayout></NextIntlClientProvider></QueryClientProvider>)
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith('/login'))
    expect(screen.queryByText('Workspace')).not.toBeInTheDocument()
  })
})
