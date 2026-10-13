'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { ListChecks, RefreshCw } from 'lucide-react'
import { useAIJob } from '@/features/ai/hooks/useAIGenerator'
import { isAccessError } from '@/features/jobs/hooks/jobPolling'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { useAuthStore } from '@/store/authStore'
import type { DurableJob } from '@/types/job.types'

const KIND_LABEL: Record<string, string> = {
  'ai.project_generate': 'generation', 'ai.impact_analysis': 'impact',
  'ai.schedule_optimize': 'optimization', 'ai.resource_recommend': 'resources',
  'ai.risk_analysis': 'risk', 'scheduling.cpm': 'schedule',
  'document.generate': 'document',
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
  return job.kind.startsWith('ai.') ? `${base}/ai-insights` : `${base}/overview`
}

function ResultValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null || value === undefined) return <span>—</span>
  if (typeof value !== 'object') return <span className="whitespace-pre-wrap break-words">{String(value)}</span>
  if (depth > 6) return null
  if (Array.isArray(value)) return <ol className="list-inside list-decimal space-y-2">{value.slice(0, 50).map((item, index) => <li key={index}><ResultValue value={item} depth={depth + 1} /></li>)}</ol>
  return <dl className="space-y-2">{Object.entries(value).slice(0, 50).map(([key, item]) => <div key={key} className="border-l pl-3"><dt className="text-xs font-medium capitalize text-muted-foreground">{key.replace(/_/g, ' ')}</dt><dd className="mt-1"><ResultValue value={item} depth={depth + 1} /></dd></div>)}</dl>
}

function AIJobOutput({ requestId }: { requestId: number }) {
  const t = useTranslations('jobs')
  const job = useAIJob(String(requestId))
  if (job.isError) return <p role="status" className="text-sm text-muted-foreground">{t(isAccessError(job.error) ? 'unavailable' : 'connection')}</p>
  if (!job.data) return <p role="status" className="text-sm text-muted-foreground">{t('loading')}</p>
  if (job.data.status === 'FAILED') return <p className="text-sm text-destructive">{t('failedMessage')}</p>
  if (job.data.status !== 'COMPLETED') return <p role="status" className="text-sm text-muted-foreground">{t('pendingResult')}</p>
  return <div className="space-y-3 text-sm">
    {job.data.project_id && <Link className="font-medium text-primary underline" href={`/projects/${job.data.project_id}/overview`}>{t('openProject')}</Link>}
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
      <div><p className="text-sm font-medium">{t(label)} <span className="text-xs font-normal text-muted-foreground">#{job.id}</span></p><time className="text-xs text-muted-foreground" dateTime={job.created_at}>{new Date(job.created_at).toLocaleString(locale)}</time></div>
      <span className={`rounded-md px-2 py-1 text-xs ${job.status === 'failed' ? 'bg-destructive/10 text-destructive' : job.status === 'succeeded' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{t(job.status)}</span>
    </div>
    {job.status === 'failed' && <p className="text-xs text-destructive">{t('failedMessage')}</p>}
    {job.status === 'failed' && job.error_code && <p className="text-xs text-destructive">{FAILURE_LABEL[job.error_code] ? t(FAILURE_LABEL[job.error_code]) : t('errorCode', { code: job.error_code })}</p>}
    <div className="flex flex-wrap items-center gap-4 text-xs">
      {href && <Link href={href} className="inline-flex min-h-9 items-center font-medium text-primary underline">{t('openFeature')}</Link>}
      {typeof aiRequestId === 'number' && <button type="button" aria-expanded={expanded} onClick={() => setExpanded(value => !value)} className="min-h-9 font-medium text-primary underline">{t(expanded ? 'hideResult' : 'viewResult')}</button>}
    </div>
    {expanded && typeof aiRequestId === 'number' && <div className="max-h-80 overflow-auto rounded-md border bg-background p-3"><AIJobOutput requestId={aiRequestId} /></div>}
  </li>
}

function JobsPanelContent() {
  const t = useTranslations('jobs')
  const jobs = useJobs()
  const active = jobs.data?.filter(job => ['queued', 'running'].includes(job.status)).length ?? 0
  return <details className="mb-6 rounded-xl border bg-card px-4 py-3">
    <summary className="flex min-h-9 cursor-pointer list-none items-center gap-2 text-sm font-semibold"><ListChecks className="h-4 w-4 text-primary" aria-hidden="true" />{t('title')}{active > 0 && <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">{t('active', { count: active })}</span>}<span className="ml-auto text-xs font-normal text-muted-foreground">{t('recent')}</span></summary>
    <div className="mt-3 border-t pt-3">
      <p className="mb-3 text-xs text-muted-foreground">{t('description')}</p>
      {jobs.isError && <p role="status" className="mb-3 text-sm text-muted-foreground">{t(isAccessError(jobs.error) ? 'unavailable' : 'connection')}</p>}
      {jobs.isPending && <p role="status" className="text-sm text-muted-foreground">{t('loading')}</p>}
      {jobs.data?.length === 0 && <p className="text-sm text-muted-foreground">{t('empty')}</p>}
      {jobs.data && <ul className="max-h-96 overflow-auto">{jobs.data.map(job => <JobRow key={job.id} job={job} />)}</ul>}
      <button type="button" onClick={() => void jobs.refetch()} disabled={jobs.isFetching} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-xs font-medium text-primary hover:bg-accent disabled:opacity-50"><RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />{t('refresh')}</button>
    </div>
  </details>
}

export function JobsPanel() {
  const ownerId = useAuthStore(state => state.user?.id ?? null)
  if (ownerId === null) return null
  return <JobsPanelContent key={ownerId} />
}
