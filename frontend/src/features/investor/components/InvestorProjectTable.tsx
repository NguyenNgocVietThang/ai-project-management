'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { InvestorProjectRow } from '../types/investor.types'
import { HEALTH_TEXT_CLASS, formatPercent, formatRatio } from './metricFormat'

/** Bảng dự án: tự cuộn ngang trong khung để trang 390px không bị tràn. */
export function InvestorProjectTable({ projects }: { projects: InvestorProjectRow[] }) {
  const t = useTranslations('investor')
  const locale = useLocale()
  const missing = <span className="text-muted-foreground" title={t('notEnoughDataHint')}>{t('notEnoughData')}</span>
  return (
    <Card flush className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-body-sm">
          <thead className="bg-muted/50 text-left text-caption uppercase text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">{t('table.project')}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t('table.progress')}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t('kpi.cpi')}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t('kpi.spi')}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t('kpi.roi')}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t('table.health')}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t('table.risk')}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t('table.overdue')}</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t">
                <th scope="row" className="px-4 py-3 text-left font-medium">
                  {project.name}
                  {project.exclusion_reason && (
                    <span className="ml-2 rounded bg-muted px-2 py-0.5 text-caption font-normal text-muted-foreground" title={t('excludedHint')}>
                      {t(`exclusion.${project.exclusion_reason}`)}
                    </span>
                  )}
                </th>
                <td className="px-4 py-3 tabular-nums">{Math.round(project.progress)}%</td>
                <td className="px-4 py-3 tabular-nums">{project.metrics.cpi === null ? missing : formatRatio(project.metrics.cpi, locale)}</td>
                <td className="px-4 py-3 tabular-nums">{project.metrics.spi === null ? missing : formatRatio(project.metrics.spi, locale)}</td>
                <td className="px-4 py-3 tabular-nums">{project.metrics.roi === null ? missing : formatPercent(project.metrics.roi, locale)}</td>
                <td className={cn('px-4 py-3 font-medium', HEALTH_TEXT_CLASS[project.metrics.health])}>{t(`health.${project.metrics.health}`)}</td>
                <td className="px-4 py-3">{project.risk_level ? t(`riskLevel.${project.risk_level}`) : '—'}</td>
                <td className="px-4 py-3 tabular-nums">{project.overdue_tasks > 0 ? <span className="font-medium text-destructive">{project.overdue_tasks}</span> : '0'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
