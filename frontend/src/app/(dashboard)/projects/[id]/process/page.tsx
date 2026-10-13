'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { AIGeneratorModal } from '@/features/ai/components/AIGeneratorModal'
import { saveActiveBriefId } from '@/features/ai/hooks/useRequirementBrief'
import { BRIEF_ITEM_KEYS, type BriefItemKey } from '@/features/ai/types/requirementBrief.types'
import { ProcessDiagram } from '@/features/process/components/ProcessDiagram'
import { isNotFound, useGenerateProcess, useProcessJob, useProcessModel } from '@/features/process/hooks/useProcessModel'
import type { ProcessLanguage } from '@/features/process/types'
import { useNumericParam } from '@/hooks/useNumericParam'
import { getApiErrorMessage } from '@/types/api.types'

const KNOWN_ERRORS = ['process_generation_pending', 'ai_quota_exceeded'] as const

function apiDetail(error: unknown): { status?: number; detail?: unknown } {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { status?: number; data?: { detail?: unknown } } }).response
    return { status: response?.status, detail: response?.data?.detail }
  }
  return {}
}

function formatDateTime(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

export default function ProcessPage() {
  const projectId = useNumericParam()
  const t = useTranslations('process')
  const tc = useTranslations('clarifier')
  const process = useProcessModel(projectId)
  const generate = useGenerateProcess(projectId)
  const [language, setLanguage] = useState<ProcessLanguage>('vi')
  const [clarifyOpen, setClarifyOpen] = useState(false)
  const jobId = generate.data?.status === 'queued' ? generate.data.job_id : null
  const job = useProcessJob(projectId, jobId)

  // Mã lỗi đã biết -> câu dịch; 403 -> không có quyền; còn lại dùng thông điệp API.
  const errorText = (error: unknown, fallback: string) => {
    const { status, detail } = apiDetail(error)
    if (typeof detail === 'string' && (KNOWN_ERRORS as readonly string[]).includes(detail)) return t(`errors.${detail as (typeof KNOWN_ERRORS)[number]}`)
    if (status === 403) return t('errors.forbidden')
    return getApiErrorMessage(error, fallback)
  }
  const itemLabel = (key: string) =>
    (BRIEF_ITEM_KEYS as readonly string[]).includes(key) ? tc(`items.${key as BriefItemKey}`) : key

  if (process.isLoading) return <LoadingState label={t('loading')} />
  const notFound = process.isError && isNotFound(process.error)
  if (process.isError && !notFound) return <ErrorState message={errorText(process.error, t('loadError'))} />
  const record = notFound ? undefined : process.data
  const clarification = generate.data?.status === 'needs_clarification' ? generate.data : undefined
  const jobStatus = job.data?.status

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </header>

      <section className="space-y-3 rounded-xl border bg-card p-4" aria-labelledby="process-generate">
        <h3 id="process-generate" className="text-base font-semibold">{t('generateTitle')}</h3>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">{t('language')}</span>
            <select className="min-h-11 rounded-md border bg-background px-3" value={language} onChange={(event) => setLanguage(event.target.value as ProcessLanguage)}>
              <option value="vi">{t('languages.vi')}</option>
              <option value="en">{t('languages.en')}</option>
            </select>
          </label>
          <Button className="sm:w-auto" onClick={() => generate.mutate({ language })} isLoading={generate.isPending} disabled={generate.isPending || jobStatus === 'queued' || jobStatus === 'running'}>
            {t('generate')}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{t('jobsHint')}</p>
        {generate.isError && <p role="alert" className="text-sm text-destructive">{errorText(generate.error, t('generateError'))}</p>}
        {jobId !== null && (
          <p role="status" className={`text-sm ${jobStatus === 'failed' ? 'text-destructive' : 'text-muted-foreground'}`}>
            {jobStatus === 'succeeded' ? t('jobSucceeded') : jobStatus === 'failed' ? t('jobFailed', { code: job.data?.error_code ?? '-' }) : t('jobRunning', { id: jobId })}
          </p>
        )}
        {clarification && (
          <div className="space-y-2 rounded-md border border-amber-500/40 p-3 text-sm" role="status">
            {clarification.missing_items.includes('no_brief') ? (
              <p>{t('noBrief')}</p>
            ) : (
              <>
                <p className="font-medium">{t('missingTitle')}</p>
                <ul className="list-inside list-disc">{clarification.missing_items.map(key => <li key={key}>{itemLabel(key)}</li>)}</ul>
                {clarification.brief_reopened && <p className="text-xs text-muted-foreground">{t('briefReopened')}</p>}
                <p className="text-xs text-muted-foreground">{t('clarifyHint')}</p>
                <Button className="sm:w-auto" variant="outline" onClick={() => { if (record?.brief_id) saveActiveBriefId(record.brief_id); setClarifyOpen(true) }}>{t('openClarifier')}</Button>
              </>
            )}
          </div>
        )}
      </section>

      {!record ? (
        <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />
      ) : (
        <section className="space-y-4" aria-labelledby="process-current">
          <div>
            <h3 id="process-current" className="text-lg font-semibold break-words">{record.model.name || t('untitled')}</h3>
            <p className="text-xs text-muted-foreground">
              {t('meta', { version: record.version, language: t(`languages.${record.language}`) })}{' '}
              <time dateTime={record.created_at}>{formatDateTime(record.created_at)}</time>
            </p>
          </div>
          {record.warnings.length > 0 && (
            <details className="text-sm">
              <summary className="min-h-9 cursor-pointer text-amber-700 dark:text-amber-400">{t('warnings', { count: record.warnings.length })}</summary>
              <ul className="mt-2 list-inside list-disc space-y-1 break-words text-xs text-muted-foreground">{record.warnings.map((warning, index) => <li key={index}>{String(warning)}</li>)}</ul>
            </details>
          )}
          <ProcessDiagram model={record.model} steps={record.steps} />
        </section>
      )}

      <AIGeneratorModal open={clarifyOpen} onClose={() => { setClarifyOpen(false); void process.refetch() }} />
    </div>
  )
}
