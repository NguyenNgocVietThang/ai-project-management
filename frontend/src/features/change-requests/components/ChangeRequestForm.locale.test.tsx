import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import en from '../../../../messages/en.json'
import viMessages from '../../../../messages/vi.json'
import { ChangeRequestForm } from './ChangeRequestForm'
import { ChangeRequestStatusBadge, RiskLevelBadge } from './ChangeRequestStatusBadge'
import type { ChangeRequestStatus, RiskLevel } from '@/types/change-request.types'

vi.mock('@/features/change-requests/hooks/useChangeRequests', () => ({
  useCreateChangeRequest: () => ({ reset: vi.fn(), mutateAsync: vi.fn(), isPending: false, isError: false }),
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
})
