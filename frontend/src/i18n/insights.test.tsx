import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import { RiskWidget } from '@/features/risk-analysis/components/RiskWidget'
import { SchedulePanel } from '@/features/schedule-optimization/components/SchedulePanel'
import { ResourceRecommendationPanel } from '@/features/resource-recommendation/components/ResourceRecommendationPanel'
import en from '../../messages/en.json'
import vn from '../../messages/vi.json'

vi.mock('@/i18n/useApiErrorMessage', () => ({ useApiErrorMessage: () => (_error: unknown, fallback: string) => fallback }))
vi.mock('@/features/risk-analysis/hooks/useRiskAnalysis', () => ({
  useRequestRiskAnalysis: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useRiskAnalysisJob: () => ({ data: { status: 'COMPLETED', result: {
    risk_level: 'HIGH', risk_score: 7.5, summary: 'Project-specific AI content',
    risk_factors: [{ factor: 'Dependency', explanation: 'A dependency needs attention', severity: 'CRITICAL' }],
  } } }),
}))
vi.mock('@/features/schedule-optimization/hooks/useScheduleOptimization', () => ({
  useOptimizeSchedule: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useScheduleOptimizationJob: () => ({}),
}))
vi.mock('@/features/resource-recommendation/hooks/useResourceRecommendation', () => ({
  useRequestResourceRecommendation: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useResourceRecommendationJob: () => ({ data: { status: 'COMPLETED', result: {
    recommendations: [{ user_id: 1, rank: 1, full_name: 'Alex', skills: [], on_leave: true,
      fit_score: 95, current_workload_hours: 8, hourly_rate: 1250000 }],
  } } }),
}))

function Insights({ locale }: { locale: 'vi' | 'en' }) {
  return <NextIntlClientProvider locale={locale} messages={locale === 'vi' ? vn : en}>
    <RiskWidget projectId={1} />
    <SchedulePanel projectId={1} />
    <ResourceRecommendationPanel taskId={1} />
  </NextIntlClientProvider>
}

describe('AI insights live language changes', () => {
  it('updates labels, severity, constraints and recommendation units without remounting or clearing input', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Insights locale="vi" />)
    expect(screen.getByRole('heading', { name: 'Phân tích rủi ro dự án' })).toBeInTheDocument()
    expect(screen.getByText('Nghiêm trọng')).toBeInTheDocument()
    expect(screen.getByText('Đang nghỉ phép')).toBeInTheDocument()
    expect(screen.getByText('Khối lượng công việc: 8 giờ')).toBeInTheDocument()
    await user.type(screen.getByRole('textbox', { name: 'Ràng buộc bổ sung (tuỳ chọn)' }), 'Keep QA phase')

    rerender(<Insights locale="en" />)
    expect(screen.getByRole('heading', { name: 'Project risk analysis' })).toBeInTheDocument()
    expect(screen.getByText('Critical')).toBeInTheDocument()
    expect(screen.queryByText('Nghiêm trọng')).not.toBeInTheDocument()
    expect(screen.getByText('On leave')).toBeInTheDocument()
    expect(screen.getByText('Workload: 8h')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Additional constraints (optional)' })).toHaveValue('Keep QA phase')
    expect(screen.getByText('Project-specific AI content')).toBeInTheDocument()

    rerender(<Insights locale="vi" />)
    expect(screen.getByRole('button', { name: 'Quét rủi ro' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Ràng buộc bổ sung (tuỳ chọn)' })).toHaveValue('Keep QA phase')
  })
})
