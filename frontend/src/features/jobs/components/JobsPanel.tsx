'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { ChevronDown, ListChecks, RefreshCw } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { useAIJob } from '@/features/ai/hooks/useAIGenerator'
import { isAccessError } from '@/features/jobs/hooks/jobPolling'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { useAuthStore } from '@/store/authStore'
import type { DurableJob } from '@/types/job.types'

const KIND_LABEL: Record<string, string> = {
  'ai.project_generate': 'generation', 'ai.impact_analysis': 'impact',
  'ai.schedule_optimize': 'optimization', 'ai.resource_recommend': 'resources',
  'ai.risk_analysis': 'risk', 'scheduling.cpm': 'schedule',
  'document.generate': 'document', 'report.xlsx': 'report',
}

const FAILURE_LABEL: Record<string, string> = {
  ai_quota_exceeded: 'quotaExceeded',
  ai_budget_exceeded: 'quotaExceeded',
  resource_limit_exceeded: 'resourceLimitExceeded',
  external_outcome_unknown: 'outcomeUnknown',
}

function featureLink(job: DurableJob): string | null {
  if (!job.project_id) return job.kind === 'ai.project_generate' ? '/projects' : null
  const base = `/projects/${job.project_id}`
  if (job.kind === 'ai.impact_analysis') return `${base}/change-requests`
  if (job.kind === 'scheduling.cpm') return `${base}/tasks`
  if (job.kind === 'document.generate') return `${base}/documents`
  if (job.kind === 'report.xlsx') return `${base}/overview`
  return job.kind.startsWith('ai.') ? `${base}/ai-insights` : `${base}/overview`
}

function ResultValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null || value === undefined) return <span>—</span>
  if (typeof value !== 'object') return <span className="whitespace-pre-wrap break-words">{String(value)}</span>
  if (depth > 6) return null
  if (Array.isArray(value)) return <ol className="list-inside list-decimal space-y-2">{value.slice(0, 50).map((item, index) => <li key={index}><ResultValue value={item} depth={depth + 1} /></li>)}</ol>
  return <dl className="space-y-2">{Object.entries(value).slice(0, 50).map(([key, item]) => <div key={key} className="border-l pl-3"><dt className="text-caption font-medium capitalize text-muted-foreground">{key.replace(/_/g, ' ')}</dt><dd className="mt-1"><ResultValue value={item} depth={depth + 1} /></dd></div>)}</dl>
}

// Tông Badge theo trạng thái job (token ngữ nghĩa, không hard-code màu).
const STATUS_TONE: Record<DurableJob['status'], BadgeTone> = {
  queued: 'neutral',
  running: 'info',
  succeeded: 'success',
  failed: 'danger',
}

function AIJobOutput({ requestId }: { requestId: number }) {
  const t = useTranslations('jobs')
  const job = useAIJob(String(requestId))
  if (job.isError) return <p role="status" className="text-body-sm text-muted-foreground">{t(isAccessError(job.error) ? 'unavailable' : 'connection')}</p>
  if (!job.data) return <p role="status" className="text-body-sm text-muted-foreground">{t('loading')}</p>
  if (job.data.status === 'FAILED') return <p className="text-body-sm text-destructive">{t('failedMessage')}</p>
  if (job.data.status !== 'COMPLETED') return <p role="status" className="text-body-sm text-muted-foreground">{t('pendingResult')}</p>
  return <div className="space-y-3 text-body-sm">
    {job.data.project_id && <Link className="font-medium text-primary underline-offset-4 hover:underline" href={`/projects/${job.data.project_id}/overview`}>{t('openProject')}</Link>}
    {job.data.result && <ResultValue value={job.data.result} />}
  </div>
}

function JobRow({ job }: { job: DurableJob }) {
  const t = useTranslations('jobs')
  const locale = useLocale()
  const [expanded, setExpanded] = useState(false)
  const aiRequestId = job.result?.ai_request_id
  const href = featureLink(job)
  const label = KIND_LABEL[job.kind] ?? (job.kind.startsWith('email.') ? 'email' : 'background')
  return <li className="space-y-2 border-t py-3 first:border-t-0">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="min-w-0">
        <p className="text-body-sm font-medium text-foreground">{t(label)} <span className="text-caption font-normal text-muted-foreground">#{job.id}</span></p>
        <time className="text-caption text-muted-foreground" dateTime={job.created_at}>{new Date(job.created_at).toLocaleString(locale)}</time>
      </div>
      <Badge tone={STATUS_TONE[job.status] ?? 'neutral'} dot>{t(job.status)}</Badge>
    </div>
    {job.status === 'failed' && <p className="text-caption text-destructive">{t('failedMessage')}</p>}
    {job.status === 'failed' && job.error_code && <p className="text-caption text-destructive">{FAILURE_LABEL[job.error_code] ? t(FAILURE_LABEL[job.error_code]) : t('errorCode', { code: job.error_code })}</p>}
    <div className="flex flex-wrap items-center gap-4 text-caption">
      {href && <Link href={href} className="inline-flex min-h-9 items-center font-medium text-primary underline-offset-4 hover:underline">{t('openFeature')}</Link>}
      {typeof aiRequestId === 'number' && <button type="button" aria-expanded={expanded} onClick={() => setExpanded(value => !value)} className="min-h-9 font-medium text-primary underline-offset-4 hover:underline">{t(expanded ? 'hideResult' : 'viewResult')}</button>}
    </div>
    {expanded && typeof aiRequestId === 'number' && <div className="max-h-80 overflow-auto rounded-lg border bg-background p-3"><AIJobOutput requestId={aiRequestId} /></div>}
  </li>
}

function JobsPanelContent() {
  const t = useTranslations('jobs')
  const jobs = useJobs()
  const active = jobs.data?.filter(job => ['queued', 'running'].includes(job.status)).length ?? 0
  // Khung giống Card (bo 12px, viền mảnh, bóng mềm); <details> giữ hành vi thu gọn gốc.
  return <details className="group mb-6 rounded-xl border border-border/80 bg-card px-4 py-3 text-card-foreground shadow-soft">
    <summary className="flex min-h-9 cursor-pointer list-none items-center gap-2 rounded-lg text-body-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent"><ListChecks className="h-4 w-4 text-accent-foreground" aria-hidden="true" /></span>
      {t('title')}
      {active > 0 && <Badge tone="primary" size="sm">{t('active', { count: active })}</Badge>}
      <span className="ml-auto text-caption font-normal text-muted-foreground">{t('recent')}</span>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out-soft group-open:rotate-180" aria-hidden="true" />
    </summary>
    <div className="mt-3 border-t pt-3">
      <p className="mb-3 max-w-prose-ui text-caption text-muted-foreground">{t('description')}</p>
      {jobs.isError && <p role="status" className="mb-3 rounded-lg border border-warning/25 bg-warning-soft px-3 py-2 text-body-sm text-warning">{t(isAccessError(jobs.error) ? 'unavailable' : 'connection')}</p>}
      {jobs.isPending && <SkeletonRegion label={t('loading')} className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></SkeletonRegion>}
      {jobs.data?.length === 0 && <p className="text-body-sm text-muted-foreground">{t('empty')}</p>}
      {jobs.data && <ul className="max-h-96 overflow-auto">{jobs.data.map(job => <JobRow key={job.id} job={job} />)}</ul>}
      <Button type="button" variant="ghost" size="sm" fullWidth={false} onClick={() => void jobs.refetch()} disabled={jobs.isFetching} className="mt-3 text-primary"><RefreshCw className="h-4 w-4" aria-hidden="true" />{t('refresh')}</Button>
    </div>
  </details>
}

export function JobsPanel() {
  const ownerId = useAuthStore(state => state.user?.id ?? null)
  if (ownerId === null) return null
  return <JobsPanelContent key={ownerId} />
}
