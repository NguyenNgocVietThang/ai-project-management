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

function chain(canDecide: boolean): ApprovalChain {
  return {
    change_request_id: 5,
    change_request_status: 'UNDER_REVIEW',
    current_step_order: 2,
    steps: [
      { id: 1, step_order: 1, required_role: 'BA', status: 'APPROVED', approver_id: 3, approver_name: 'An', comment: 'OK', decided_at: '2026-10-01T08:00:00Z', can_decide: false },
      { id: 2, step_order: 2, required_role: 'PO', status: 'PENDING', approver_id: null, approver_name: null, comment: null, decided_at: null, can_decide: canDecide },
      { id: 3, step_order: 3, required_role: 'PM', status: 'PENDING', approver_id: null, approver_name: null, comment: null, decided_at: null, can_decide: false },
    ],
  }
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
    expect(mocks.post).toHaveBeenCalledWith('/change-requests/5/approvals/2/approve', { comment: 'Looks good' })
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

describe('parseMissingRoles', () => {
  it('đọc danh sách vai trò thiếu từ lỗi 422 khi submit', () => {
    expect(parseMissingRoles({ response: { status: 422, data: { detail: 'missing_roles: BA, PO' } } })).toEqual(['BA', 'PO'])
    expect(parseMissingRoles({ response: { status: 409, data: { detail: 'x' } } })).toBeNull()
  })
})
