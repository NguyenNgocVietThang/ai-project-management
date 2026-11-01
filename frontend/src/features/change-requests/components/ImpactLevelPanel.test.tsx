import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import en from '../../../../messages/en.json'
import type { ChangeRequest, ImpactReport } from '@/types/change-request.types'
import { ImpactLevelPanel } from './ImpactLevelPanel'
import { ManualImpactReportModal } from './ManualImpactReportModal'

const mocks = vi.hoisted(() => ({ post: vi.fn(), put: vi.fn() }))
vi.mock('@/services/api', () => ({ api: { post: mocks.post, put: mocks.put, get: vi.fn() } }))

function cr(overrides: Partial<ChangeRequest> = {}): ChangeRequest {
  return {
    id: 9, project_id: 1, requested_by_id: 2, title: 'Add SSO', description: 'Y', reason: null,
    impact_description: null, status: 'SUBMITTED', impact_level: 'MAJOR', impact_level_confirmed: true,
    impact_level_confirmed_by_id: 4, impact_level_confirmed_at: '2026-11-01T08:00:00Z',
    impact_level_change_reason: null, applied_at: null, created_at: '2026-11-01T07:00:00Z',
    ...overrides,
  }
}

const REPORT: ImpactReport = {
  id: 1, change_request_id: 9, risk_level: 'HIGH', risk_score: 7, schedule_impact_days: 12, cost_impact: 0,
  affected_tasks_json: [], summary: 'Big', revision: 2, source: 'AI', suggested_impact_level: 'MAJOR',
  impact_level_rationale: 'Delays the milestone by 12 days', created_by_id: 2, advisory: true,
  created_at: '2026-11-01T08:00:00Z',
}

function wrap(node: React.ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale="en" messages={en} timeZone="UTC">{node}</NextIntlClientProvider>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  mocks.post.mockReset()
  mocks.put.mockReset()
})

describe('ImpactLevelPanel', () => {
  it('người không phải PM chỉ xem mức và gợi ý AI, không có ô chốt mức', () => {
    wrap(<ImpactLevelPanel changeRequest={cr()} report={REPORT} canManage={false} />)
    expect(screen.getByText('Impact: Major')).toBeInTheDocument()
    expect(screen.getByText('AI suggests: Major')).toBeInTheDocument()
    expect(screen.getByText('Delays the milestone by 12 days')).toBeInTheDocument()
    expect(screen.getByText(en.impactControl.aiSuggestionNote)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: en.impactControl.confirmButton })).not.toBeInTheDocument()
  })

  it('gợi ý từ đánh giá thủ công ghi rõ là PM đề xuất, không phải AI', () => {
    wrap(<ImpactLevelPanel changeRequest={cr()} report={{ ...REPORT, source: 'MANUAL' }} canManage={false} />)
    expect(screen.getByText('PM suggests (manual assessment): Major')).toBeInTheDocument()
    expect(screen.queryByText('AI suggests: Major')).not.toBeInTheDocument()
  })

  it('CR chưa chốt hiển thị cảnh báo chờ PM', () => {
    wrap(<ImpactLevelPanel changeRequest={cr({ impact_level_confirmed: false, impact_level_confirmed_at: null, impact_level_confirmed_by_id: null })} report={null} canManage={false} />)
    expect(screen.getByText(en.impactControl.notConfirmedNotice)).toBeInTheDocument()
    expect(screen.getByText(en.impactControl.unconfirmedBadge)).toBeInTheDocument()
  })

  it('PM hạ từ mức Lớn phải nhập lý do rồi mới gửi', async () => {
    mocks.post.mockResolvedValue({ data: cr({ impact_level: 'MINOR', impact_level_change_reason: 'Label only' }) })
    wrap(<ImpactLevelPanel changeRequest={cr()} report={REPORT} canManage />)
    await userEvent.selectOptions(screen.getByLabelText(en.impactControl.selectLevel), 'MINOR')
    await userEvent.click(screen.getByRole('button', { name: en.impactControl.confirmButton }))
    expect(screen.getByRole('alert')).toHaveTextContent(en.impactControl.reasonMissing)
    expect(mocks.post).not.toHaveBeenCalled()
    await userEvent.type(screen.getByLabelText(en.impactControl.reasonLabel), 'Label only')
    await userEvent.click(screen.getByRole('button', { name: en.impactControl.confirmButton }))
    await waitFor(() =>
      expect(mocks.post).toHaveBeenCalledWith('/change-requests/9/impact-level', { level: 'MINOR', reason: 'Label only' }),
    )
  })

  it('nâng mức khi đang duyệt thì cảnh báo sẽ mở lại các bước', async () => {
    wrap(<ImpactLevelPanel changeRequest={cr({ impact_level: 'MODERATE', status: 'UNDER_REVIEW' })} report={null} canManage />)
    await userEvent.selectOptions(screen.getByLabelText(en.impactControl.selectLevel), 'MAJOR')
    expect(screen.getByText(en.impactControl.raiseWarning)).toBeInTheDocument()
  })

  it('CR đã kết thúc thì PM cũng không đổi được mức', () => {
    wrap(<ImpactLevelPanel changeRequest={cr({ status: 'APPROVED' })} report={null} canManage />)
    expect(screen.queryByRole('button', { name: en.impactControl.confirmButton })).not.toBeInTheDocument()
  })
})

describe('ManualImpactReportModal', () => {
  it('bắt buộc tóm tắt và gửi đánh giá thủ công', async () => {
    mocks.put.mockResolvedValue({ data: { ...REPORT, source: 'MANUAL', revision: 1 } })
    const onClose = vi.fn()
    wrap(<ManualImpactReportModal changeRequestId={9} open onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: en.impactControl.save }))
    expect(screen.getByText(en.impactControl.summaryMissing)).toBeInTheDocument()
    expect(mocks.put).not.toHaveBeenCalled()
    await userEvent.selectOptions(screen.getByLabelText(en.impactControl.riskLevel), 'HIGH')
    await userEvent.clear(screen.getByLabelText(en.impactControl.scheduleDays))
    await userEvent.type(screen.getByLabelText(en.impactControl.scheduleDays), '14')
    await userEvent.type(screen.getByLabelText(en.impactControl.summary), 'AI quota exhausted')
    await userEvent.selectOptions(screen.getByLabelText(en.impactControl.suggestedLevel), 'MAJOR')
    await userEvent.click(screen.getByRole('button', { name: en.impactControl.save }))
    await waitFor(() =>
      expect(mocks.put).toHaveBeenCalledWith('/change-requests/9/impact-report/manual', {
        risk_level: 'HIGH', schedule_impact_days: 14, cost_impact: 0, summary: 'AI quota exhausted',
        suggested_impact_level: 'MAJOR',
      }),
    )
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('đã có báo cáo AI thì hiển thị lỗi ai_report_exists', async () => {
    mocks.put.mockRejectedValue({ response: { status: 409, data: { detail: 'ai_report_exists' } } })
    wrap(<ManualImpactReportModal changeRequestId={9} open onClose={vi.fn()} />)
    await userEvent.type(screen.getByLabelText(en.impactControl.summary), 'x')
    await userEvent.click(screen.getByRole('button', { name: en.impactControl.save }))
    expect(await screen.findByText(en.impactControl.errors.ai_report_exists)).toBeInTheDocument()
  })
})
