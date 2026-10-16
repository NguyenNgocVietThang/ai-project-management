'use client'

import { LineChart } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatRatio, HEALTH_TEXT_CLASS } from '@/features/investor/components/metricFormat'
import { useInvestorPortfolios } from '@/features/investor/hooks/useInvestor'
import { formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/types/api.types'

export default function InvestorHomePage() {
  const t = useTranslations('investor')
  const locale = useLocale()
  const query = useInvestorPortfolios()
  if (query.isLoading) return <LoadingState variant="page" label={t('loading')} />
  if (query.isError || !query.data) return <ErrorState message={getApiErrorMessage(query.error, t('loadError'))} onRetry={() => void query.refetch()} />
  const items = query.data.items
  return (
    <div className="space-y-8">
      <PageHeader title={t('title')} description={t('description')} />
      {items.length === 0
        ? <EmptyState icon={LineChart} title={t('empty')} description={t('description')} />
        : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} as="article" interactive className="group">
                <h2 className="text-h4">
                  <Link href={`/investor/portfolios/${item.id}`} className="after:absolute after:inset-0 after:rounded-xl group-hover:text-primary focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring">{item.name}</Link>
                </h2>
                <p className="mt-1 text-caption text-muted-foreground">{t('projects', { count: item.project_count })}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-body-sm">
                  <div><dt className="text-muted-foreground">{t('kpi.bac')}</dt><dd className="tabular-nums">{item.total_bac === null ? t('notEnoughData') : formatMoney(item.total_bac, item.currency)}</dd></div>
                  <div><dt className="text-muted-foreground">{t('kpi.ac')}</dt><dd className="tabular-nums">{formatMoney(item.total_ac, item.currency)}</dd></div>
                  <div><dt className="text-muted-foreground">{t('kpi.cpi')}</dt><dd className="tabular-nums">{item.cpi === null ? t('notEnoughData') : formatRatio(item.cpi, locale)}</dd></div>
                  <div><dt className="text-muted-foreground">{t('kpi.spi')}</dt><dd className="tabular-nums">{item.spi === null ? t('notEnoughData') : formatRatio(item.spi, locale)}</dd></div>
                </dl>
                <p className={cn('mt-4 text-body-sm font-medium', HEALTH_TEXT_CLASS[item.health])}>{t(`health.${item.health}`)}</p>
              </Card>
            ))}
          </div>}
    </div>
  )
}
