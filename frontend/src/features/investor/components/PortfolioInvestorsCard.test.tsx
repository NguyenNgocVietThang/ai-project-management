import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import messages from '../../../../messages/vi.json'
import { PortfolioInvestorsCard } from './PortfolioInvestorsCard'

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), delete: vi.fn() }))
vi.mock('@/services/api', () => ({ api }))

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale="vi" messages={messages}><PortfolioInvestorsCard portfolioId={7} /></NextIntlClientProvider>
    </QueryClientProvider>,
  )
}

const grant = { user_id: 3, full_name: 'Nhà đầu tư A', email: 'a@example.com', granted_at: '2026-10-16T08:00:00Z', granted_by_id: 1 }

beforeEach(() => vi.clearAllMocks())

describe('thẻ quản lý nhà đầu tư', () => {
  it('cấp quyền theo email', async () => {
    api.get.mockResolvedValue({ data: [] })
    api.post.mockResolvedValue({ data: grant })
    setup()
    await userEvent.type(await screen.findByLabelText('Email nhà đầu tư'), 'a@example.com')
    await userEvent.click(screen.getByRole('button', { name: 'Cấp quyền' }))
    expect(api.post).toHaveBeenCalledWith('/portfolios/7/investors', { email: 'a@example.com' })
  })

  it('thu hồi sau khi xác nhận', async () => {
    api.get.mockResolvedValue({ data: [grant] })
    api.delete.mockResolvedValue({})
    setup()
    await userEvent.click(await screen.findByRole('button', { name: 'Thu hồi' }))
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Thu hồi' }))
    expect(api.delete).toHaveBeenCalledWith('/portfolios/7/investors/3')
  })
})
