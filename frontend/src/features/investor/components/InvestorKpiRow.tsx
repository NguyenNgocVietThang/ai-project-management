'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { formatMoney } from '@/lib/format'
import type { Metrics } from '../types/investor.types'
import { formatPercent, formatRatio } from './metricFormat'

/** Sáu chỉ số tổng hợp; ô thiếu dữ liệu hiện chữ thay vì số 0 gây hiểu nhầm. */
export function InvestorKpiRow({ totals, currency }: { totals: Metrics; currency: string }) {
  const t = useTranslations('investor')
  const locale = useLocale()
  const missing = t('notEnoughData')
  const items = [
    { key: 'bac', value: totals.bac === null ? missing : formatMoney(totals.bac, currency, locale) },
    { key: 'ac', value: formatMoney(totals.ac, currency, locale) },
    { key: 'eac', value: totals.eac === null ? missing : formatMoney(totals.eac, currency, locale) },
    { key: 'cpi', value: totals.cpi === null ? missing : formatRatio(totals.cpi, locale) },
    { key: 'spi', value: totals.spi === null ? missing : formatRatio(totals.spi, locale) },
    { key: 'roi', value: totals.roi === null ? missing : formatPercent(totals.roi, locale), hint: totals.roi_basis ? t(`roiBasis.${totals.roi_basis}`) : null },
  ] as const
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-6">
      {items.map((item) => (
        <Card key={item.key} className="p-4">
          <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">{t(`kpi.${item.key}`)}</p>
          <p className="mt-3 break-words text-h4 tabular-nums">{item.value}</p>
          {'hint' in item && item.hint && <p className="mt-1 text-caption text-muted-foreground">{item.hint}</p>}
        </Card>
      ))}
    </div>
  )
}
