'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { useBreadcrumbLabel } from '@/components/layout/Breadcrumbs'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { BudgetVsEacChart } from '@/features/investor/components/BudgetVsEacChart'
import { HealthDonut } from '@/features/investor/components/HealthDonut'
import { InvestorKpiRow } from '@/features/investor/components/InvestorKpiRow'
import { InvestorProjectTable } from '@/features/investor/components/InvestorProjectTable'
import { useInvestorPortfolio } from '@/features/investor/hooks/useInvestor'
import { useNumericParam } from '@/hooks/useNumericParam'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'

export default function InvestorPortfolioPage() {
  const getApiErrorMessage = useApiErrorMessage()
  const id = useNumericParam()
  const router = useRouter()
  const t = useTranslations('investor')
  const query = useInvestorPortfolio(id)
  const status = (query.error as { response?: { status?: number } } | null)?.response?.status
  useBreadcrumbLabel(`/investor/portfolios/${id}`, query.data?.portfolio.name)

  // Bị thu hồi quyền trong lúc đang xem: quay về danh sách kèm thông báo.
  useEffect(() => {
    if (status === 403) {
      toast.error(t('noAccess'))
      router.replace('/investor')
    }
  }, [status, router, t])

  if (query.isLoading) return <LoadingState variant="page" label={t('loading')} />
  if (query.isError || !query.data) return <ErrorState message={getApiErrorMessage(query.error, t('loadError'))} onRetry={() => void query.refetch()} />
  const { portfolio, totals, projects, health_distribution, overdue_projects } = query.data
  return (
    <div className="space-y-8">
      <Link href="/investor" className="-mb-4 inline-flex min-h-11 items-center gap-2 text-body-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{t('backToList')}</Link>
      <PageHeader title={portfolio.name} description={portfolio.description ?? undefined} meta={<span className="text-caption text-muted-foreground">{t('overdueProjects')}: {overdue_projects}</span>} />
      <InvestorKpiRow totals={totals} currency={portfolio.currency} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card as="section" aria-labelledby="investor-health"><CardHeader className="mb-4"><CardTitle id="investor-health">{t('healthChart')}</CardTitle></CardHeader><HealthDonut distribution={health_distribution} /></Card>
        <Card as="section" aria-labelledby="investor-budget"><CardHeader className="mb-4"><CardTitle id="investor-budget">{t('budgetChart')}</CardTitle></CardHeader><BudgetVsEacChart projects={projects} currency={portfolio.currency} /></Card>
      </div>
      <InvestorProjectTable projects={projects} />
    </div>
  )
}
