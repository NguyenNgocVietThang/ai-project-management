import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import en from '../../../../messages/en.json'
import viMessages from '../../../../messages/vi.json'
import PortfoliosPage from '@/app/(dashboard)/portfolios/page'
import { PortfolioForm } from './PortfolioForm'

const mocks = vi.hoisted(() => ({ list: vi.fn() }))
vi.mock('@/features/portfolios/hooks/usePortfolios', () => ({
  usePortfolios: mocks.list,
  useCreatePortfolio: () => ({ isPending: false, isError: false }),
  useUpdatePortfolio: () => ({ isPending: false, isError: false }),
  useDeletePortfolio: () => ({ isPending: false, isError: false }),
}))

describe('portfolio workspace language switching', () => {
  it('updates page controls without losing entered search or the selected status', async () => {
    mocks.list.mockReturnValue({ data: { items: [] }, isLoading: false, isError: false })
    const content = <PortfoliosPage />
    const { rerender } = render(<NextIntlClientProvider locale="en" messages={en}>{content}</NextIntlClientProvider>)
    await userEvent.type(screen.getByRole('textbox', { name: 'Search portfolios' }), 'Operations')
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Filter portfolio status' }), 'ACTIVE')
    rerender(<NextIntlClientProvider locale="vi" messages={viMessages}>{content}</NextIntlClientProvider>)
    expect(screen.getByRole('textbox', { name: 'Tìm danh mục' })).toHaveValue('Operations')
    expect(screen.getByRole('combobox', { name: 'Lọc trạng thái danh mục' })).toHaveValue('ACTIVE')
    expect(screen.getByRole('heading', { name: 'Danh mục' })).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: 'Search portfolios' })).not.toBeInTheDocument()
    expect(mocks.list).toHaveBeenLastCalledWith({ page_size: 100, search: 'Operations', status: 'ACTIVE' })
    rerender(<NextIntlClientProvider locale="en" messages={en}>{content}</NextIntlClientProvider>)
    expect(screen.getByRole('textbox', { name: 'Search portfolios' })).toHaveValue('Operations')
    expect(screen.getByRole('combobox', { name: 'Filter portfolio status' })).toHaveValue('ACTIVE')
  })

  it('translates an already visible form validation error without submitting again', async () => {
    const submit = vi.fn()
    const content = <PortfolioForm isLoading={false} onCancel={vi.fn()} onSubmit={submit} />
    const { rerender } = render(<NextIntlClientProvider locale="en" messages={en}>{content}</NextIntlClientProvider>)
    await userEvent.type(screen.getByLabelText('Name'), 'AB')
    await userEvent.clear(screen.getByLabelText('Currency'))
    await userEvent.click(screen.getByRole('button', { name: 'Create portfolio' }))
    expect(await screen.findByText('Name must be at least 3 characters')).toBeInTheDocument()
    expect(screen.getByLabelText('Currency')).toHaveAccessibleDescription('Currency must have at least 3 characters')
    rerender(<NextIntlClientProvider locale="vi" messages={viMessages}>{content}</NextIntlClientProvider>)
    expect(screen.getByText('Tên phải có ít nhất 3 ký tự')).toBeInTheDocument()
    expect(screen.queryByText('Name must be at least 3 characters')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Tên')).toHaveValue('AB')
    expect(screen.getByLabelText('Tiền tệ')).toHaveAccessibleDescription('Mã tiền tệ phải có ít nhất 3 ký tự')
    expect(submit).not.toHaveBeenCalled()
    rerender(<NextIntlClientProvider locale="en" messages={en}>{content}</NextIntlClientProvider>)
    expect(screen.getByText('Name must be at least 3 characters')).toBeInTheDocument()
  })
})
