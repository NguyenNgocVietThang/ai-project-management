'use client'

import { useTranslations } from 'next-intl'
import { DonutChart } from '@/components/charts/DonutChart'
import type { HealthKey } from '../types/investor.types'
import { HEALTH_COLORS } from './metricFormat'

const ORDER: HealthKey[] = ['on_track', 'at_risk', 'off_track', 'unknown']

/** Phân bố sức khỏe dự án trong portfolio. */
export function HealthDonut({ distribution }: { distribution: Record<HealthKey, number> }) {
  const t = useTranslations('investor')
  const data = ORDER.map((key) => ({ name: t(`health.${key}`), value: distribution[key] ?? 0, color: HEALTH_COLORS[key] }))
  const total = data.reduce((sum, slice) => sum + slice.value, 0)
  return <DonutChart data={data} centerValue={total} summaryLabel={t('healthChart')} emptyLabel={t('empty')} />
}
