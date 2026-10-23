import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../../../../messages/en.json'
import type { User } from '@/types/auth.types'
import InvestorLayout from './layout'

const mocks = vi.hoisted(() => ({ replace: vi.fn(), user: null as User | null }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: mocks.replace }) }))
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: mocks.user }) }))

const asUser = (roles: string[]) => ({ id: 1, is_superuser: false, roles: roles.map((name, id) => ({ id, name })) }) as unknown as User

beforeEach(() => vi.clearAllMocks())

describe('chặn cổng nhà đầu tư theo role', () => {
  it('PM bị chuyển về dashboard', () => {
    mocks.user = asUser(['PM'])
    render(<NextIntlClientProvider locale="en" messages={messages}><InvestorLayout><p>Secret</p></InvestorLayout></NextIntlClientProvider>)
    expect(mocks.replace).toHaveBeenCalledWith('/dashboard')
    expect(screen.queryByText('Secret')).not.toBeInTheDocument()
  })

  it('investor xem được nội dung', () => {
    mocks.user = asUser(['Investor'])
    render(<NextIntlClientProvider locale="en" messages={messages}><InvestorLayout><p>Secret</p></InvestorLayout></NextIntlClientProvider>)
    expect(screen.getByText('Secret')).toBeInTheDocument()
    expect(mocks.replace).not.toHaveBeenCalled()
  })
})
