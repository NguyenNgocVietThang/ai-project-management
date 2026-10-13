'use client'

import { ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { ButtonLink } from '@/components/common/Button'
import { ErrorState } from '@/components/common/PageState'
import { RevealText } from '@/components/motion/RevealText'
import { SectionHeader } from '@/components/ui/PageHeader'
import { SkeletonCard, SkeletonPageHeader, SkeletonRegion, SkeletonStatGrid } from '@/components/ui/Skeleton'
import { ActiveProjectsGrid } from '@/features/dashboard/components/ActiveProjectsGrid'
import { MyTasksList } from '@/features/dashboard/components/MyTasksList'
import { RecentActivityFeed } from '@/features/dashboard/components/RecentActivityFeed'
import { StatsRow } from '@/features/dashboard/components/StatsRow'
import { useDashboardSummary } from '@/features/dashboard/hooks/useDashboard'
import { useAuth } from '@/hooks/useAuth'
import { getApiErrorMessage } from '@/types/api.types'

export default function DashboardPage() {
  const { user } = useAuth()
  const { data, isLoading, isError, error, refetch } = useDashboardSummary()
  const t = useTranslations('home')
  const tc = useTranslations('common')
  const format = useFormatter()
  const now = new Date()
  const hour = now.getHours()

  // Khung xương có cùng bố cục với trang thật: đầu trang, 4 chỉ số, lưới dự án.
  if (isLoading) {
    return (
      <SkeletonRegion label={t('loading')} className="space-y-8">
        <SkeletonPageHeader />
        <SkeletonStatGrid />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
        </div>
      </SkeletonRegion>
    )
  }

  if (isError || !data) {
    return <ErrorState message={getApiErrorMessage(error)} onRetry={() => void refetch()} retryLabel={tc('retry')} />
  }

  const greeting = t('greeting', {
    greeting: t(hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'),
    name: user?.full_name?.split(' ').filter(Boolean).at(-1) ?? '',
  })

  return (
    <div className="space-y-10">
      {/* Đầu trang theo mẫu PageHeader, riêng H1 có dấu chấm màu nhấn làm hậu tố */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow mb-2">{t('eyebrow')}</p>
          <RevealText text={greeting} className="text-h2 sm:text-h1" suffix={<span className="text-primary">.</span>} />
          <p className="mt-2 max-w-prose-ui text-body-sm text-muted-foreground sm:text-body">{t('subtitle')}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-body-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {format.dateTime(now, { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <ButtonLink href="/portfolios" variant="outline">
            {t('viewPortfolios')}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </header>

      <StatsRow stats={data.stats} />

      <section aria-labelledby="active-projects-title">
        <SectionHeader
          id="active-projects-title"
          title={t('projects')}
          description={t('projectSubtitle')}
          action={
            <ButtonLink href="/projects" variant="ghost" className="text-primary">
              {t('viewProjects')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          }
        />
        <ActiveProjectsGrid projects={data.active_projects} />
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <MyTasksList tasks={data.my_tasks} />
        <RecentActivityFeed items={data.recent_activity} />
      </div>
    </div>
  )
}
