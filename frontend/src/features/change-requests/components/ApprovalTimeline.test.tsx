import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import en from '../../../../messages/en.json'
import type { ApprovalChain } from '@/features/change-requests/approvals'
import { parseMissingRoles } from '@/features/change-requests/approvals'
import { ApprovalTimeline } from './ApprovalTimeline'

const mocks = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }))
vi.mock('@/services/api', () => ({ api: { get: mocks.get, post: mocks.post } }))

const NO_IMPACT = { impact_level_at_decision: null, acknowledged_report_revision: null }

function chain(canDecide: boolean, overrides: Partial<ApprovalChain> = {}): ApprovalChain {
  return {
    change_request_id: 5,
    change_request_status: 'UNDER_REVIEW',
    current_step_order: 2,
    impact_level: 'MODERATE',
    impact_level_confirmed: true,
    report_revision: null,
    requires_report: false,
    requires_acknowledgement: false,
    requires_comment: false,
    steps: [
      { id: 1, step_order: 1, required_role: 'BA', status: 'APPROVED', approver_id: 3, approver_name: 'An', comment: 'OK', decided_at: '2026-10-01T08:00:00Z', can_decide: false, ...NO_IMPACT },
      { id: 2, step_order: 2, required_role: 'PO', status: 'PENDING', approver_id: null, approver_name: null, comment: null, decided_at: null, can_decide: canDecide, ...NO_IMPACT },
      { id: 3, step_order: 3, required_role: 'PM', status: 'PENDING', approver_id: null, approver_name: null, comment: null, decided_at: null, can_decide: false, ...NO_IMPACT },
    ],
    ...overrides,
  }
}

/** CR mức Lớn: cần báo cáo, xác nhận đã đọc và nhận xét khi duyệt. */
function majorChain(reportRevision: number | null): ApprovalChain {
  return chain(true, {
    impact_level: 'MAJOR',
    report_revision: reportRevision,
    requires_report: true,
    requires_acknowledgement: true,
    requires_comment: true,
  })
}

function renderTimeline() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale="en" messages={en} timeZone="UTC">
        <ApprovalTimeline changeRequestId={5} />
      </NextIntlClientProvider>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  mocks.get.mockReset()
  mocks.post.mockReset()
})

describe('ApprovalTimeline', () => {
  it('ẩn nút khi người dùng không có quyền quyết định', async () => {
    mocks.get.mockResolvedValue({ data: chain(false) })
    renderTimeline()
    expect(await screen.findByText(/Step 2: Product Owner/)).toBeInTheDocument()
    expect(screen.getAllByText(en.approvals.status.APPROVED).length).toBeGreaterThan(0)
    expect(screen.getByText(/By An/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: en.approvals.approve })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: en.approvals.reject })).not.toBeInTheDocument()
  })

  it('duyệt cập nhật giao diện từ response, không tải lại', async () => {
    mocks.get.mockResolvedValue({ data: chain(true) })
    const after = chain(false)
    after.current_step_order = 3
    after.steps[1] = { ...after.steps[1], status: 'APPROVED', approver_name: 'Binh', comment: 'Looks good', decided_at: '2026-10-02T08:00:00Z' }
    mocks.post.mockResolvedValue({ data: after })
    renderTimeline()
    await userEvent.click(await screen.findByRole('button', { name: en.approvals.approve }))
    await userEvent.type(screen.getByLabelText(en.approvals.commentOptional), 'Looks good')
    await userEvent.click(screen.getByRole('button', { name: en.approvals.confirmApprove }))
    expect(mocks.post).toHaveBeenCalledWith('/change-requests/5/approvals/2/approve', {
      comment: 'Looks good',
      acknowledged_report_revision: null,
    })
    expect(await screen.findByText(/By Binh/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: en.approvals.approve })).not.toBeInTheDocument()
    expect(mocks.get).toHaveBeenCalledTimes(1)
  })

  it('từ chối bắt buộc nhập lý do', async () => {
    mocks.get.mockResolvedValue({ data: chain(true) })
    mocks.post.mockResolvedValue({ data: chain(false) })
    renderTimeline()
    await userEvent.click(await screen.findByRole('button', { name: en.approvals.reject }))
    await userEvent.click(screen.getByRole('button', { name: en.approvals.confirmReject }))
    expect(screen.getByRole('alert')).toHaveTextContent(en.approvals.reasonMissing)
    expect(mocks.post).not.toHaveBeenCalled()
    await userEvent.type(screen.getByLabelText(en.approvals.reasonRequired), 'Out of scope')
    await userEvent.click(screen.getByRole('button', { name: en.approvals.confirmReject }))
    await waitFor(() =>
      expect(mocks.post).toHaveBeenCalledWith('/change-requests/5/approvals/2/reject', { reason: 'Out of scope' }),
    )
  })

  it('lỗi 409 hiển thị thông báo thân thiện', async () => {
    mocks.get.mockResolvedValue({ data: chain(true) })
    mocks.post.mockRejectedValue({ response: { status: 409, data: { detail: 'conflict' } } })
    renderTimeline()
    await userEvent.click(await screen.findByRole('button', { name: en.approvals.approve }))
    await userEvent.click(screen.getByRole('button', { name: en.approvals.confirmApprove }))
    expect(await screen.findByText(en.approvals.errorConflict)).toBeInTheDocument()
  })
})

describe('ApprovalTimeline — kiểm soát mức tác động', () => {
  it('CR mức Lớn bắt buộc xác nhận đã đọc và nhận xét, gửi đúng revision báo cáo', async () => {
    mocks.get.mockResolvedValue({ data: majorChain(2) })
    mocks.post.mockResolvedValue({ data: majorChain(2) })
    renderTimeline()
    await userEvent.click(await screen.findByRole('button', { name: en.approvals.approve }))
    expect(screen.getByText(en.impactControl.majorApproveNotice)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: en.approvals.confirmApprove }))
    expect(screen.getByText(en.impactControl.ackMissing)).toBeInTheDocument()
    expect(screen.getByText(en.impactControl.commentMissing)).toBeInTheDocument()
    expect(mocks.post).not.toHaveBeenCalled()
    await userEvent.click(screen.getByLabelText('I have read the impact report (revision 2)'))
    await userEvent.type(screen.getByLabelText(en.impactControl.commentRequired), 'Read the report')
    await userEvent.click(screen.getByRole('button', { name: en.approvals.confirmApprove }))
    await waitFor(() =>
      expect(mocks.post).toHaveBeenCalledWith('/change-requests/5/approvals/2/approve', {
        comment: 'Read the report',
        acknowledged_report_revision: 2,
      }),
    )
  })

  it('CR mức Lớn chưa có báo cáo thì không cho xác nhận duyệt', async () => {
    mocks.get.mockResolvedValue({ data: majorChain(null) })
    renderTimeline()
    await userEvent.click(await screen.findByRole('button', { name: en.approvals.approve }))
    expect(screen.getByText(en.impactControl.majorNeedsReport)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: en.approvals.confirmApprove })).toBeDisabled()
  })

  it('PM chưa chốt mức thì ẩn nút quyết định và giải thích lý do', async () => {
    mocks.get.mockResolvedValue({ data: chain(true, { impact_level_confirmed: false }) })
    renderTimeline()
    expect(await screen.findByText(en.impactControl.waitingConfirmation)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: en.approvals.approve })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: en.approvals.reject })).not.toBeInTheDocument()
  })

  it('lỗi 422 mã nghiệp vụ hiển thị thông điệp riêng', async () => {
    mocks.get.mockResolvedValue({ data: chain(true) })
    mocks.post.mockRejectedValue({ response: { status: 422, data: { detail: 'impact_report_changed' } } })
    renderTimeline()
    await userEvent.click(await screen.findByRole('button', { name: en.approvals.approve }))
    await userEvent.click(screen.getByRole('button', { name: en.approvals.confirmApprove }))
    expect(await screen.findByText(en.impactControl.errors.impact_report_changed)).toBeInTheDocument()
  })

  it('bước đã quyết định hiển thị mức và revision báo cáo đã xác nhận', async () => {
    const data = majorChain(2)
    data.steps[0] = { ...data.steps[0], impact_level_at_decision: 'MAJOR', acknowledged_report_revision: 2 }
    mocks.get.mockResolvedValue({ data })
    renderTimeline()
    expect(await screen.findByText(/Decided at level Major/)).toBeInTheDocument()
    expect(screen.getByText(/Confirmed reading report revision 2/)).toBeInTheDocument()
  })
})

describe('parseMissingRoles', () => {
  it('đọc danh sách vai trò thiếu từ lỗi 422 khi submit', () => {
    expect(parseMissingRoles({ response: { status: 422, data: { detail: 'missing_roles: BA, PO' } } })).toEqual(['BA', 'PO'])
    expect(parseMissingRoles({ response: { status: 409, data: { detail: 'x' } } })).toBeNull()
  })
})
