import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it } from 'vitest'
import messages from '../../../../messages/vi.json'
import type { Metrics } from '../types/investor.types'
import { InvestorKpiRow } from './InvestorKpiRow'

const totals: Metrics = {
  bac: 4000, ac: 3400, ev: 2000, pv: 2000, cpi: 0.588, spi: 1, eac: 6800, vac: -2800,
  expected_benefit: 2700, roi: 0.5, roi_basis: 'mixed', health: 'off_track',
}

describe('hàng KPI nhà đầu tư', () => {
  it('ghi rõ cơ sở ROI và hiện ô thiếu dữ liệu', () => {
    render(
      <NextIntlClientProvider locale="vi" messages={messages}>
        <InvestorKpiRow totals={{ ...totals, eac: null }} currency="VND" />
      </NextIntlClientProvider>,
    )
    expect(screen.getByText('cơ sở kết hợp')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('Chưa đủ dữ liệu')).toBeInTheDocument()
  })
})
