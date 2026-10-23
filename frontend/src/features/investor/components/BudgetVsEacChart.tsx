'use client'

import { useLocale, useTranslations } from 'next-intl'

/**
 * BudgetVsEacChart – thanh ngang so sánh ngân sách (BAC) với chi phí dự báo (EAC)
 * theo dự án. Chỉ vẽ dự án được tính vào tổng (cùng tiền tệ, có ngân sách); có bảng
 * sr-only để thông tin không chỉ nằm trong hình.
 */
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { animationProps, axisProps, chartColors, gridProps, usePrefersReducedMotion } from '@/components/charts/chartTheme'
import { formatMoney } from '@/lib/format'
import type { InvestorProjectRow } from '../types/investor.types'

export function BudgetVsEacChart({ projects, currency }: { projects: InvestorProjectRow[]; currency: string }) {
  const locale = useLocale()
  const t = useTranslations('investor')
  const reducedMotion = usePrefersReducedMotion()
  const data = projects
    .filter((project) => !project.excluded_from_totals)
    .map((project) => ({ name: project.name, bac: project.metrics.bac ?? 0, eac: project.metrics.eac }))
  if (data.length === 0) return <p className="text-body-sm text-muted-foreground">{t('noComparableProjects')}</p>
  // ChartTooltip truyền giá trị dạng number | string, nên ép về number trước khi định dạng.
  const money = (value: number | string) => formatMoney(Number(value), currency, locale)
  return (
    <>
      <ResponsiveContainer width="100%" height={Math.max(160, data.length * 48)}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid {...gridProps} horizontal={false} />
          <XAxis type="number" {...axisProps} tickFormatter={money} />
          <YAxis type="category" dataKey="name" width={120} {...axisProps} />
          <Tooltip content={<ChartTooltip valueFormatter={money} />} />
          <Legend />
          <Bar dataKey="bac" name={t('kpi.bac')} fill={chartColors.primary} radius={[0, 4, 4, 0]} {...animationProps(reducedMotion)} />
          <Bar dataKey="eac" name={t('kpi.eac')} fill={chartColors.warning} radius={[0, 4, 4, 0]} {...animationProps(reducedMotion)} />
        </BarChart>
      </ResponsiveContainer>
      {/* sr-only đặt trên div bọc: lớp này không thu nhỏ được phần tử table nên bảng làm tràn ngang trang. */}
      <div className="sr-only">
        <table>
          <caption>{t('budgetChart')}</caption>
          <tbody>{data.map((row) => <tr key={row.name}><th scope="row">{row.name}</th><td>{money(row.bac)}</td><td>{row.eac === null ? t('notEnoughData') : money(row.eac)}</td></tr>)}</tbody>
        </table>
      </div>
    </>
  )
}
