import { fireEvent, render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import en from '../../../../messages/en.json'
import viMessages from '../../../../messages/vi.json'
import { RegisterForm } from './RegisterForm'
import { PasswordSection } from '@/features/profile/components/PasswordSection'
import { RoleTable } from '@/features/admin/roles/components/RoleTable'
import { RoleForm } from '@/features/admin/roles/components/RoleForm'

vi.mock('@/features/admin/roles/hooks/useAdminRoles', () => ({
  usePermissionCatalog: () => ({ data: [{ id: 1, resource: 'project', action: 'read', description: null }], isLoading: false }),
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ register: vi.fn(), isRegistering: false, registerError: null }),
}))

function localized(locale: 'en' | 'vi', children: React.ReactNode) {
  return <NextIntlClientProvider locale={locale} messages={locale === 'en' ? en : viMessages}>{children}</NextIntlClientProvider>
}

describe('Account interfaces follow the active locale', () => {
  it('translates the visible permission resource heading and preserves selected permissions', () => {
    const form = <RoleForm onSubmit={vi.fn()} onCancel={vi.fn()} isLoading={false} />
    const view = render(localized('en', form))
    expect(screen.getByText(en.accountUi.resources.project)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('checkbox'))
    view.rerender(localized('vi', form))
    expect(screen.getByText(viMessages.accountUi.resources.project)).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
  it('switches registration labels, password strength and existing validation errors without resetting the form', async () => {
    const view = render(localized('en', <RegisterForm />))
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'abc' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
    expect(await screen.findByText('Full name must be at least 2 characters')).toBeInTheDocument()
    expect(screen.getByText('Weak')).toBeInTheDocument()
    view.rerender(localized('vi', <RegisterForm />))
    expect(screen.getByLabelText('Mật khẩu')).toHaveValue('abc')
    expect(screen.getByText('Họ và tên phải có ít nhất 2 ký tự')).toBeInTheDocument()
    expect(screen.getByText('Yếu')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tạo tài khoản' })).toBeInTheDocument()
  })

  it('translates profile validation and password settings when the provider locale changes', async () => {
    const section = <PasswordSection hasPassword onSubmit={vi.fn()} isLoading={false} error={null} />
    const view = render(localized('en', section))
    fireEvent.click(screen.getByRole('button', { name: 'Change password' }))
    expect(await screen.findByText('Password must be at least 12 characters')).toBeInTheDocument()
    view.rerender(localized('vi', section))
    expect(screen.getByLabelText('Mật khẩu hiện tại')).toBeInTheDocument()
    expect(screen.getByText('Mật khẩu phải có ít nhất 12 ký tự')).toBeInTheDocument()
  })

  it('translates admin role headings and accessible actions while preserving custom role names', () => {
    const table = <RoleTable roles={[{ id: 1, name: 'Custom role', description: null, permissions: [], user_count: 0 }]} onEdit={vi.fn()} onDelete={vi.fn()} />
    const view = render(localized('en', table))
    expect(screen.getByRole('button', { name: 'Edit Custom role' })).toBeInTheDocument()
    view.rerender(localized('vi', table))
    expect(screen.getByRole('columnheader', { name: 'Quyền hạn' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Chỉnh sửa Custom role' })).toBeInTheDocument()
    expect(screen.getByText('Custom role')).toBeInTheDocument()
  })
})
