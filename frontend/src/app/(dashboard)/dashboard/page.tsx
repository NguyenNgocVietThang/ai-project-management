'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { ErrorState } from '@/components/common/PageState'
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

  if (isLoading) return <div role="status" aria-label={t('loading')} className="space-y-8"><div className="h-24 animate-pulse rounded-2xl bg-muted" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map(i => <div key={i} className="h-36 animate-pulse rounded-2xl bg-muted" />)}</div><div className="h-72 animate-pulse rounded-2xl bg-muted" /><span className="sr-only">{t('loading')}</span></div>
  if (isError || !data) return <div className="space-y-4"><ErrorState message={getApiErrorMessage(error)} /><button type="button" onClick={() => void refetch()} className="rounded-lg border bg-card px-4 py-2">{tc('retry')}</button></div>

  return <div className="space-y-9">
    <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
      <div><p className="eyebrow mb-3">{t('eyebrow')}</p><h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{t('greeting', { greeting: t(hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'), name: user?.full_name?.split(' ').filter(Boolean).at(-1) ?? '' })}<span className="text-primary">.</span></h1><p className="mt-3 text-sm text-muted-foreground">{t('subtitle')}</p></div>
      <div className="flex flex-wrap items-center gap-3"><span className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="h-4 w-4" aria-hidden="true" />{format.dateTime(now, { day: 'numeric', month: 'short', year: 'numeric' })}</span><Link href="/portfolios" className="inline-flex min-h-11 items-center gap-2 rounded-xl border bg-card px-4 text-xs font-semibold transition-colors hover:bg-accent">{t('viewPortfolios')}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></div>
    </div>
    <StatsRow stats={data.stats} />
    <section aria-labelledby="active-projects-title"><div className="mb-5 flex items-start justify-between gap-4"><div><h2 id="active-projects-title" className="text-lg font-semibold tracking-tight">{t('projects')}</h2><p className="mt-1 text-xs text-muted-foreground">{t('projectSubtitle')}</p></div><Link href="/projects" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-xs font-semibold text-primary hover:underline">{t('viewProjects')}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div><ActiveProjectsGrid projects={data.active_projects} /></section>
    <div className="grid items-start gap-6 xl:grid-cols-[1.15fr_1fr]"><MyTasksList tasks={data.my_tasks} /><RecentActivityFeed items={data.recent_activity} /></div>
  </div>
}
