import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import en from '../../../../messages/en.json'
import viMessages from '../../../../messages/vi.json'
import { ChangeRequestForm } from './ChangeRequestForm'
import { ChangeRequestStatusBadge, RiskLevelBadge } from './ChangeRequestStatusBadge'
import type { ChangeRequestStatus, RiskLevel } from '@/types/change-request.types'

const mocks = vi.hoisted(() => ({ mutateAsync: vi.fn() }))
vi.mock('@/features/change-requests/hooks/useChangeRequests', () => ({
  useCreateChangeRequest: () => ({ reset: vi.fn(), mutateAsync: mocks.mutateAsync, isPending: false, isError: false }),
}))

describe('change request form locale switching', () => {
  it('translates every approval status and risk level when the provider locale changes', () => {
    const statuses: ChangeRequestStatus[] = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IMPLEMENTED', 'CANCELLED']
    const risks: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    const content = <>{statuses.map((status) => <ChangeRequestStatusBadge key={status} status={status} />)}{risks.map((level) => <RiskLevelBadge key={level} level={level} />)}</>
    const { rerender } = render(<NextIntlClientProvider locale="en" messages={en}>{content}</NextIntlClientProvider>)
    for (const label of Object.values(en.workflowUi.status)) expect(screen.getByText(label)).toBeInTheDocument()
    rerender(<NextIntlClientProvider locale="vi" messages={viMessages}>{content}</NextIntlClientProvider>)
    for (const label of Object.values(viMessages.workflowUi.status)) expect(screen.getByText(label)).toBeInTheDocument()
    for (const label of ['Thấp', 'Trung bình', 'Cao', 'Nghiêm trọng']) expect(screen.getByText(label)).toBeInTheDocument()
    for (const label of Object.values(en.workflowUi.status)) expect(screen.queryByText(label)).not.toBeInTheDocument()
  })

  it('updates open form labels while retaining user input', async () => {
    const form = <ChangeRequestForm projectId={1} open onClose={vi.fn()} onCreated={vi.fn()} />
    const { rerender } = render(<NextIntlClientProvider locale="en" messages={en}>{form}</NextIntlClientProvider>)
    await userEvent.type(screen.getByLabelText('Title'), 'Scope proposal')
    rerender(<NextIntlClientProvider locale="vi" messages={viMessages}>{form}</NextIntlClientProvider>)
    expect(screen.getByLabelText('Tiêu đề')).toHaveValue('Scope proposal')
    expect(screen.getByRole('button', { name: 'Tạo' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Create' })).not.toBeInTheDocument()
    rerender(<NextIntlClientProvider locale="en" messages={en}>{form}</NextIntlClientProvider>)
    expect(screen.getByLabelText('Title')).toHaveValue('Scope proposal')
  })

  it('gửi mức tác động người tạo đề xuất (mặc định Trung bình)', async () => {
    mocks.mutateAsync.mockResolvedValue({ id: 1 })
    render(<NextIntlClientProvider locale="en" messages={en}><ChangeRequestForm projectId={3} open onClose={vi.fn()} onCreated={vi.fn()} /></NextIntlClientProvider>)
    expect(screen.getByLabelText(en.impactControl.proposedLabel)).toHaveValue('MODERATE')
    await userEvent.type(screen.getByLabelText('Title'), 'Swap payment provider')
    await userEvent.type(screen.getByLabelText('Description'), 'Replace the gateway')
    await userEvent.selectOptions(screen.getByLabelText(en.impactControl.proposedLabel), 'MAJOR')
    await userEvent.click(screen.getByRole('button', { name: 'Create' }))
    expect(mocks.mutateAsync).toHaveBeenCalledWith({
      projectId: 3,
      body: expect.objectContaining({ title: 'Swap payment provider', impact_level: 'MAJOR' }),
    })
  })
})
