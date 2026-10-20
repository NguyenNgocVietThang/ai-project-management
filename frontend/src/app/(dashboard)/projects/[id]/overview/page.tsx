'use client'

import { differenceInCalendarDays, parseISO } from 'date-fns'
import { useState } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import { ButtonLink } from '@/components/common/Button'
import { ErrorState } from '@/components/common/PageState'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { useNumericParam } from '@/hooks/useNumericParam'
import { useProjectStats } from '@/features/dashboard/hooks/useDashboard'
import { useProjectActivity, useProjectDetail } from '@/features/projects/hooks/useProjects'
import { XlsxExportButton } from '@/features/reports/components/XlsxExportButton'
import { ProjectOverviewCharts } from './charts'

export default function ProjectOverviewPage() {
  const id = useNumericParam()
  const projectQuery = useProjectDetail(id)
  const activityQuery = useProjectActivity(id)
  const statsQuery = useProjectStats(id)
  const [chartsOpen, setChartsOpen] = useState(false)
  const t = useTranslations('projectOverview')
  const tw = useTranslations('wbs')
  const f = useFormatter()
  const date = (value: string | null) => value ? f.dateTime(new Date(value), { dateStyle: 'medium', timeZone: 'UTC' }) : tw('dateNotSet')
  const money = (value: number | null, currency: string) => value === null ? t('notSet') : f.number(value, { style: 'currency', currency, maximumFractionDigits: currency === 'VND' ? 0 : 2 })
  if (projectQuery.isLoading) return <SkeletonRegion label={t('loading')} className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-48 w-full" /></SkeletonRegion>
  if (projectQuery.isError || !projectQuery.data) return <ErrorState message={t('loadError')} retryLabel={t('retry')} onRetry={() => void projectQuery.refetch()} />
  const project = projectQuery.data
  const stats = statsQuery.data
  const days = project.end_date ? differenceInCalendarDays(parseISO(project.end_date), new Date()) : null
  const blocked = stats?.task_distribution.find(item => item.status === 'BLOCKED')?.count ?? 0
  const status = (value: string) => tw.has(`statuses.${value}`) ? tw(`statuses.${value}`) : value

  return <div className="min-w-0 space-y-4">
    <Card as="section" className="min-w-0 p-4 sm:p-5" aria-labelledby="overview-attention">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="overview-attention" className="text-lg font-semibold">{t('attention')}</h2><ButtonLink href={`/projects/${id}/tasks`}>{t('reviewTasks')}</ButtonLink></div>
      {statsQuery.isLoading && <SkeletonRegion label={t('loadingAttention')}><Skeleton className="mt-3 h-12 w-full" /></SkeletonRegion>}
      {statsQuery.isError && <div className="mt-3"><ErrorState message={t('attentionError')} retryLabel={t('retry')} onRetry={() => void statsQuery.refetch()} /></div>}
      {stats && <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div><dt className="text-sm text-muted-foreground">{t('overdue')}</dt><dd className={stats.overdue_tasks > 0 ? 'text-xl font-semibold text-destructive' : 'text-xl font-semibold'}>{stats.overdue_tasks}</dd></div>
        <div><dt className="text-sm text-muted-foreground">{t('blocked')}</dt><dd className="text-xl font-semibold">{blocked}</dd></div>
        <div><dt className="text-sm text-muted-foreground">{t('critical')}</dt><dd className="text-xl font-semibold">{stats.critical_tasks}</dd></div>
      </dl>}
    </Card>
    <section aria-label={t('summary')} className="grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-4">
      {[{ label: t('tasksCompleted'), value: `${project.completed_task_count} / ${project.task_count}` }, { label: t('members'), value: String(project.member_count) }, { label: days !== null && days < 0 ? t('daysPastEnd') : t('daysRemaining'), value: days === null ? t('notSet') : String(Math.abs(days)) }, { label: t('progress'), value: `${Math.round(project.progress_percent)}%` }].map(item => <Card key={item.label} className="min-w-0 p-3 sm:p-4"><h3 className="text-sm font-medium text-muted-foreground">{item.label}</h3><p className="mt-2 break-words text-xl font-semibold tabular-nums">{item.value}</p></Card>)}
    </section>
    <div className="grid min-w-0 gap-4 lg:grid-cols-2">
      <Card as="section" className="min-w-0 p-4 sm:p-5"><h2 className="mb-3 text-base font-semibold">{t('phases')}</h2>
        {project.phases.length === 0 && <p className="text-sm text-muted-foreground">{t('noPhases')}</p>}
        <ul className="space-y-3">{[...project.phases].sort((a, b) => a.order_index - b.order_index).map(phase => <li key={phase.id} className="min-w-0 border-b pb-3 last:border-0 last:pb-0"><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="min-w-0 flex-1 basis-40 break-words text-sm font-medium [overflow-wrap:anywhere]">{phase.name}</h3><Badge size="sm">{status(phase.status)}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{!phase.start_date && !phase.end_date ? tw('dateNotSet') : `${date(phase.start_date)} – ${date(phase.end_date)}`}</p></li>)}</ul>
        <ButtonLink href={`/projects/${id}/wbs`} variant="link" className="mt-3 min-h-11">{t('openWbs')}</ButtonLink>
      </Card>
      <Card as="section" className="min-w-0 p-4 sm:p-5"><h2 className="mb-3 text-base font-semibold">{t('milestones')}</h2>
        {project.milestones.length === 0 && <p className="text-sm text-muted-foreground">{t('noMilestones')}</p>}
        <ul className="space-y-3">{project.milestones.map(item => <li key={item.id} className="min-w-0 border-b pb-3 last:border-0"><h3 className="break-words text-sm font-medium [overflow-wrap:anywhere]">{item.name}</h3><p className="mt-1 text-xs text-muted-foreground">{date(item.due_date)} · {status(item.status)}</p></li>)}</ul>
      </Card>
    </div>
    <Card as="section" className="min-w-0 p-4 sm:p-5"><h2 className="text-base font-semibold">{t('projectDetails')}</h2><p className="mt-2 text-sm text-muted-foreground">{date(project.start_date)} – {date(project.end_date)}</p><p className="mt-2 break-words text-sm">{t('budgetUsed')}: {money(project.budget_spent, project.currency)} / {money(project.budget, project.currency)}</p><details className="mt-2"><summary className="min-h-11 cursor-pointer py-3 text-sm font-medium">{t('description')}</summary><p className="whitespace-pre-wrap break-words text-sm text-muted-foreground [overflow-wrap:anywhere]">{project.description || t('noDescription')}</p></details></Card>
    <details className="min-w-0 rounded-lg border bg-card p-4" onToggle={event => setChartsOpen(event.currentTarget.open)}><summary className="min-h-11 cursor-pointer py-3 text-base font-semibold">{t('charts')}</summary>{chartsOpen && <div className="mt-3 min-w-0">{statsQuery.isLoading ? <SkeletonRegion label={t('loading')}><Skeleton className="h-48 w-full" /></SkeletonRegion> : statsQuery.isError ? <ErrorState message={t('attentionError')} retryLabel={t('retry')} onRetry={() => void statsQuery.refetch()} /> : stats && <ProjectOverviewCharts stats={stats} />}</div>}</details>
    <details className="min-w-0 rounded-lg border bg-card p-4"><summary className="min-h-11 cursor-pointer py-3 text-base font-semibold">{t('activity')}</summary>
      {activityQuery.isLoading && <SkeletonRegion label={t('loadingActivity')}><Skeleton className="h-24 w-full" /></SkeletonRegion>}
      {activityQuery.isError && <ErrorState message={t('activityError')} retryLabel={t('retry')} onRetry={() => void activityQuery.refetch()} />}
      {activityQuery.data?.length === 0 && <p className="text-sm text-muted-foreground">{t('noActivity')}</p>}
      <ul className="space-y-3">{activityQuery.data?.map(event => <li key={event.id} className="min-w-0 border-b pb-3 last:border-0"><p className="break-words text-sm">{event.description || event.action}</p><p className="mt-1 text-xs text-muted-foreground">{event.actor?.full_name || t('system')} · {date(event.created_at)}</p></li>)}</ul>
    </details>
    <div className="flex justify-end"><XlsxExportButton projectId={id} /></div>
  </div>
}
