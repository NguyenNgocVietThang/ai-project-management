import { render, screen, within } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it } from 'vitest'
import messages from '../../../../messages/vi.json'
import type { InvestorProjectRow, Metrics } from '../types/investor.types'
import { InvestorProjectTable } from './InvestorProjectTable'

const metrics = (overrides: Partial<Metrics> = {}): Metrics => ({
  bac: 1000, ac: 400, ev: 500, pv: 500, cpi: 1.25, spi: 1, eac: 800, vac: 200,
  expected_benefit: 1200, roi: 0.5, roi_basis: 'eac', health: 'on_track', ...overrides,
})

const row = (overrides: Partial<InvestorProjectRow> = {}): InvestorProjectRow => ({
  id: 1, name: 'Alpha', status: 'ACTIVE', start_date: null, end_date: null, progress: 40,
  currency: 'VND', metrics: metrics(), risk_level: 'HIGH', risk_score: 8, overdue_tasks: 2,
  excluded_from_totals: false, exclusion_reason: null, ...overrides,
})

function setup(projects: InvestorProjectRow[]) {
  return render(
    <NextIntlClientProvider locale="vi" messages={messages}>
      <InvestorProjectTable projects={projects} />
    </NextIntlClientProvider>,
  )
}

describe('bảng dự án nhà đầu tư', () => {
  it('hiện chỉ số, nhãn health và ROI theo phần trăm', () => {
    setup([row()])
    const line = screen.getByRole('row', { name: /Alpha/ })
    expect(within(line).getByText('1,25')).toBeInTheDocument()
    expect(within(line).getByText('Đúng kế hoạch')).toBeInTheDocument()
    expect(within(line).getByText('40%')).toBeInTheDocument()
    expect(within(line).getByText('50%')).toBeInTheDocument()
  })

  it('ô thiếu dữ liệu hiện "Chưa đủ dữ liệu" và dự án bị loại có nhãn lý do', () => {
    setup([row({ id: 2, name: 'Seed', metrics: metrics({ cpi: null, spi: null, roi: null, roi_basis: null, health: 'unknown' }), excluded_from_totals: true, exclusion_reason: 'no_budget' })])
    const line = screen.getByRole('row', { name: /Seed/ })
    expect(within(line).getAllByText('Chưa đủ dữ liệu').length).toBeGreaterThan(0)
    expect(within(line).getByText('Chưa có ngân sách')).toBeInTheDocument()
  })
})
