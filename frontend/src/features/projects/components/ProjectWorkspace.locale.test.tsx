import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import en from '../../../../messages/en.json'
import viMessages from '../../../../messages/vi.json'
import { ProjectWizard } from './ProjectWizard'
import { ProjectMembersTable } from './ProjectMembersTable'
import { InviteMemberDialog } from './InviteMemberDialog'
import type { ProjectMember } from '@/types/project.types'

vi.mock('@/features/projects/hooks/useProjectMembers', () => ({
  useUserSearch: () => ({ data: [{ id: 3, full_name: 'An Nguyen', username: 'an', email_hint: 'a***@example.com', avatar_url: null }] }),
  useAssignableRoles: () => ({ data: [{ id: 2, name: 'Member', description: null }, { id: 4, name: 'Custom reviewer', description: null }] }),
}))

describe('project creation and members language switching', () => {
  it('shows and translates blocked wizard description and currency validation errors', async () => {
    const content = <ProjectWizard portfolios={[]} onSubmit={vi.fn()} onCancel={vi.fn()} isLoading={false} />
    const { rerender } = render(<NextIntlClientProvider locale="en" messages={en}>{content}</NextIntlClientProvider>)
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'x'.repeat(5001) } })
    await userEvent.clear(screen.getByLabelText('Currency'))
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(await screen.findByText('Description must not exceed 5000 characters')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toHaveAccessibleDescription('Description must not exceed 5000 characters')
    expect(screen.getByLabelText('Currency')).toHaveAccessibleDescription('Currency must have at least 3 characters')
    rerender(<NextIntlClientProvider locale="vi" messages={viMessages}>{content}</NextIntlClientProvider>)
    expect(screen.getByLabelText('Mô tả')).toHaveAccessibleDescription('Mô tả không được vượt quá 5000 ký tự')
    expect(screen.getByLabelText('Tiền tệ')).toHaveAccessibleDescription('Mã tiền tệ phải có ít nhất 3 ký tự')
    rerender(<NextIntlClientProvider locale="en" messages={en}>{content}</NextIntlClientProvider>)
    expect(screen.getByLabelText('Description')).toHaveValue('x'.repeat(5001))
    expect(screen.getByLabelText('Currency')).toHaveAccessibleDescription('Currency must have at least 3 characters')
  })

  it('updates wizard steps and review values without resetting the current step', async () => {
    const content = <ProjectWizard portfolios={[]} onSubmit={vi.fn()} onCancel={vi.fn()} isLoading={false} />
    const { rerender } = render(<NextIntlClientProvider locale="en" messages={en}>{content}</NextIntlClientProvider>)
    await userEvent.type(screen.getByLabelText('Name'), 'Retained project')
    fireEvent.input(screen.getByLabelText('Start date'), { target: { value: '2026-10-01' } })
    fireEvent.change(screen.getByLabelText('Start date'), { target: { value: '2026-10-01' } })
    fireEvent.input(screen.getByLabelText('End date'), { target: { value: '2026-10-31' } })
    fireEvent.change(screen.getByLabelText('End date'), { target: { value: '2026-10-31' } })
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await screen.findByLabelText('Search users')
    await userEvent.type(screen.getByLabelText('Search users'), 'An')
    await userEvent.click(screen.getByRole('button', { name: /An Nguyen/ }))
    expect(screen.getByRole('combobox', { name: 'Role for An Nguyen' })).toHaveValue('2')
    rerender(<NextIntlClientProvider locale="vi" messages={viMessages}>{content}</NextIntlClientProvider>)
    expect(screen.getByRole('combobox', { name: /Vai trò.*An Nguyen/ })).toHaveValue('2')
    expect(screen.getByRole('button', { name: /(?:Xóa|Gỡ).*An Nguyen/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Thành viên' })).toBeInTheDocument()
    expect(screen.getByLabelText('Tìm người dùng')).toHaveValue('An')
    await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục' }))
    expect(await screen.findByText('Sẵn sàng tạo')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Các bước tạo dự án' })).toBeInTheDocument()
    expect(screen.getByText('Sẵn sàng tạo')).toBeInTheDocument()
    expect(screen.getByText('Retained project')).toBeInTheDocument()
    expect(screen.getByText('Linh hoạt (Agile)')).toBeInTheDocument()
    expect(screen.queryByText(/^agile$/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tạo dự án' })).toBeInTheDocument()
    rerender(<NextIntlClientProvider locale="en" messages={en}>{content}</NextIntlClientProvider>)
    expect(screen.getByText('Ready to create')).toBeInTheDocument()
    expect(screen.getByText('Retained project')).toBeInTheDocument()
    expect(screen.getByText('Agile')).toBeInTheDocument()
  })

  it('updates member roles and person-specific action labels while keeping personal names', () => {
    const member: ProjectMember = { user: { id: 3, full_name: 'An Nguyen', username: 'an', email: 'an@example.com', avatar_url: null }, role: { id: 2, name: 'Member', description: null }, joined_at: '2026-10-01T08:00:00Z', is_owner: false }
    const content = <ProjectMembersTable members={[member]} canManage onRemove={vi.fn()} isRemoving={false} />
    const { rerender } = render(<NextIntlClientProvider locale="en" messages={en}>{content}</NextIntlClientProvider>)
    expect(screen.getByRole('button', { name: 'Remove An Nguyen' })).toBeInTheDocument()
    rerender(<NextIntlClientProvider locale="vi" messages={viMessages}>{content}</NextIntlClientProvider>)
    const row = screen.getByRole('row', { name: /An Nguyen/ })
    expect(within(row).getByText('Thành viên')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /(?:Xóa|Gỡ).*An Nguyen/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remove An Nguyen' })).not.toBeInTheDocument()
    rerender(<NextIntlClientProvider locale="en" messages={en}>{content}</NextIntlClientProvider>)
    expect(screen.getByRole('button', { name: 'Remove An Nguyen' })).toBeInTheDocument()
  })

  it('translates known invite roles and preserves custom role names and selected role ids', async () => {
    const content = <InviteMemberDialog open onClose={vi.fn()} onInvite={vi.fn()} isLoading={false} />
    const { rerender } = render(<NextIntlClientProvider locale="en" messages={en}>{content}</NextIntlClientProvider>)
    await userEvent.selectOptions(screen.getByLabelText('Project role'), '4')
    rerender(<NextIntlClientProvider locale="vi" messages={viMessages}>{content}</NextIntlClientProvider>)
    expect(screen.getByRole('option', { name: 'Thành viên' })).toHaveValue('2')
    expect(screen.getByRole('option', { name: 'Custom reviewer' })).toHaveValue('4')
    expect(screen.getByLabelText('Vai trò trong dự án')).toHaveValue('4')
    expect(screen.queryByRole('option', { name: 'Member' })).not.toBeInTheDocument()
    rerender(<NextIntlClientProvider locale="en" messages={en}>{content}</NextIntlClientProvider>)
    expect(screen.getByRole('option', { name: 'Member' })).toBeInTheDocument()
    expect(screen.getByLabelText('Project role')).toHaveValue('4')
  })
})
