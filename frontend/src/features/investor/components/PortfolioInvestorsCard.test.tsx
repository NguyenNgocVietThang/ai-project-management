import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import messages from '../../../../messages/vi.json'
import { PortfolioInvestorsCard } from './PortfolioInvestorsCard'

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), delete: vi.fn() }))
vi.mock('@/services/api', () => ({ api }))

function setup(onGlobalError = vi.fn()) {
  // Mô phỏng MutationCache toàn cục của app để kiểm tra toast chung đã bị tắt.
  const mutationCache = new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (!mutation.meta?.silent) onGlobalError(error)
    },
  })
  const client = new QueryClient({ mutationCache, defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale="vi" messages={messages} timeZone="UTC"><PortfolioInvestorsCard portfolioId={7} /></NextIntlClientProvider>
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

  it('lỗi cấp quyền chỉ hiện một thông báo và không báo toast chung', async () => {
    api.get.mockResolvedValue({ data: [] })
    api.post.mockRejectedValue({ response: { status: 400, data: { detail: 'User does not have the Investor role' } } })
    const onGlobalError = vi.fn()
    setup(onGlobalError)
    await userEvent.type(await screen.findByLabelText('Email nhà đầu tư'), 'a@example.com')
    await userEvent.click(screen.getByRole('button', { name: 'Cấp quyền' }))
    expect(await screen.findAllByText('Người dùng chưa có vai trò Nhà đầu tư.')).toHaveLength(1)
    expect(onGlobalError).not.toHaveBeenCalled()
    // Sửa email thì lỗi cũ biến mất.
    await userEvent.type(screen.getByLabelText('Email nhà đầu tư'), 'x')
    await waitFor(() => expect(screen.queryByText('Người dùng chưa có vai trò Nhà đầu tư.')).toBeNull())
  })

  it('cấp quyền thành công thì xóa ô email', async () => {
    api.get.mockResolvedValue({ data: [] })
    api.post.mockResolvedValue({ data: grant })
    setup()
    const input = await screen.findByLabelText('Email nhà đầu tư')
    await userEvent.type(input, 'a@example.com')
    await userEvent.click(screen.getByRole('button', { name: 'Cấp quyền' }))
    await waitFor(() => expect(input).toHaveValue(''))
  })

  it('thu hồi thành công thì đóng hộp thoại', async () => {
    api.get.mockResolvedValue({ data: [grant] })
    api.delete.mockResolvedValue({})
    setup()
    await userEvent.click(await screen.findByRole('button', { name: 'Thu hồi' }))
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Thu hồi' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('lỗi thu hồi không còn khi mở lại hộp thoại', async () => {
    api.get.mockResolvedValue({ data: [grant] })
    api.delete.mockRejectedValue({ response: { status: 404, data: { detail: 'Investor access not found' } } })
    const onGlobalError = vi.fn()
    setup(onGlobalError)
    await userEvent.click(await screen.findByRole('button', { name: 'Thu hồi' }))
    let dialog = await screen.findByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Thu hồi' }))
    expect(await screen.findAllByText('Không tìm thấy quyền truy cập của nhà đầu tư.')).toHaveLength(1)
    expect(onGlobalError).not.toHaveBeenCalled()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Hủy' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await userEvent.click(screen.getByRole('button', { name: 'Thu hồi' }))
    dialog = await screen.findByRole('dialog')
    expect(within(dialog).queryByText('Không tìm thấy quyền truy cập của nhà đầu tư.')).toBeNull()
  })
})
