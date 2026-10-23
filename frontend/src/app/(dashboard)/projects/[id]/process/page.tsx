'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { AlertTriangle, GitBranch, Sparkles } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Label } from '@/components/common/Label'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/utils'
import { AIGeneratorModal } from '@/features/ai/components/AIGeneratorModal'
import { saveActiveBriefId } from '@/features/ai/hooks/useRequirementBrief'
import { BRIEF_ITEM_KEYS, type BriefItemKey } from '@/features/ai/types/requirementBrief.types'
import { ProcessDiagram } from '@/features/process/components/ProcessDiagram'
import { isNotFound, useGenerateProcess, useProcessJob, useProcessModel } from '@/features/process/hooks/useProcessModel'
import type { ProcessLanguage } from '@/features/process/types'
import { useNumericParam } from '@/hooks/useNumericParam'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'

const KNOWN_ERRORS = ['process_generation_pending', 'ai_quota_exceeded'] as const

function apiDetail(error: unknown): { status?: number; detail?: unknown } {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { status?: number; data?: { detail?: unknown } } }).response
    return { status: response?.status, detail: response?.data?.detail }
  }
  return {}
}

function formatDateTime(value: string, locale: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(locale)
}

export default function ProcessPage() {
  const locale = useLocale()
  const getApiErrorMessage = useApiErrorMessage()
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

  const header = <SectionHeader title={t('title')} description={t('subtitle')} />

  if (process.isLoading) {
    return (
      <div className="space-y-6">
        {header}
        <LoadingState variant="page" label={t('loading')} />
      </div>
    )
  }
  const notFound = process.isError && isNotFound(process.error)
  if (process.isError && !notFound) {
    return (
      <div className="space-y-6">
        {header}
        <ErrorState message={errorText(process.error, t('loadError'))} onRetry={() => void process.refetch()} />
      </div>
    )
  }
  const record = notFound ? undefined : process.data
  const clarification = generate.data?.status === 'needs_clarification' ? generate.data : undefined
  const jobStatus = job.data?.status
  const busy = generate.isPending || jobStatus === 'queued' || jobStatus === 'running'

  return (
    <div className="space-y-6">
      {header}

      {/* ===== Khối sinh quy trình bằng AI (CTA chính) ===== */}
      <Card as="section" aria-labelledby="process-generate">
        <CardHeader>
          <div className="min-w-0">
            <CardTitle as="h3" id="process-generate">{t('generateTitle')}</CardTitle>
            <CardDescription>{t('jobsHint')}</CardDescription>
          </div>
        </CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="sm:w-56">
            <Label htmlFor="process-language">{t('language')}</Label>
            <Select id="process-language" value={language} onChange={(event) => setLanguage(event.target.value as ProcessLanguage)}>
              <option value="vi">{t('languages.vi')}</option>
              <option value="en">{t('languages.en')}</option>
            </Select>
          </div>
          <Button fullWidth={false} className="w-full sm:w-auto" onClick={() => generate.mutate({ language })} isLoading={generate.isPending} disabled={busy}>
            {!generate.isPending && <Sparkles className="h-4 w-4" aria-hidden="true" />}
            {t('generate')}
          </Button>
        </div>
        {generate.isError && <p role="alert" className="mt-4 text-body-sm text-destructive">{errorText(generate.error, t('generateError'))}</p>}
        {jobId !== null && (
          <p role="status" className={cn('mt-4 text-body-sm', jobStatus === 'failed' ? 'text-destructive' : jobStatus === 'succeeded' ? 'text-success' : 'text-muted-foreground')}>
            {jobStatus === 'succeeded' ? t('jobSucceeded') : jobStatus === 'failed' ? t('jobFailed', { code: job.data?.error_code ?? '-' }) : t('jobRunning', { id: jobId })}
          </p>
        )}
        {clarification && (
          <div className="mt-4 space-y-2 rounded-lg border border-warning/25 bg-warning-soft p-3 text-body-sm text-foreground" role="status">
            {clarification.missing_items.includes('no_brief') ? (
              <p>{t('noBrief')}</p>
            ) : (
              <>
                <p className="font-medium">{t('missingTitle')}</p>
                <ul className="list-inside list-disc">{clarification.missing_items.map(key => <li key={key}>{itemLabel(key)}</li>)}</ul>
                {clarification.brief_reopened && <p className="text-caption text-muted-foreground">{t('briefReopened')}</p>}
                <p className="text-caption text-muted-foreground">{t('clarifyHint')}</p>
                <Button variant="outline" fullWidth={false} className="w-full sm:w-auto" onClick={() => { if (record?.brief_id) saveActiveBriefId(record.brief_id); setClarifyOpen(true) }}>{t('openClarifier')}</Button>
              </>
            )}
          </div>
        )}
      </Card>

      {!record ? (
        <EmptyState icon={GitBranch} title={t('emptyTitle')} description={t('emptyDescription')} />
      ) : (
        <Card as="section" aria-labelledby="process-current" className="min-w-0">
          <CardHeader>
            <div className="min-w-0">
              <h3 id="process-current" className="break-words text-h4 text-foreground sm:text-h3">{record.model.name || t('untitled')}</h3>
              <p className="mt-1 text-caption text-muted-foreground">
                {t('meta', { version: record.version, language: t(`languages.${record.language}`) })}{' '}
                <time dateTime={record.created_at}>{formatDateTime(record.created_at, locale)}</time>
              </p>
            </div>
          </CardHeader>
          {record.warnings.length > 0 && (
            <details className="mb-4 rounded-lg border border-warning/25 bg-warning-soft px-3 text-body-sm">
              <summary className="flex min-h-11 cursor-pointer items-center gap-2 font-medium text-warning">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t('warnings', { count: record.warnings.length })}
              </summary>
              <ul className="list-inside list-disc space-y-1 break-words pb-3 text-caption text-muted-foreground">{record.warnings.map((warning, index) => <li key={index}>{String(warning)}</li>)}</ul>
            </details>
          )}
          <ProcessDiagram model={record.model} steps={record.steps} />
        </Card>
      )}

      <AIGeneratorModal open={clarifyOpen} onClose={() => { setClarifyOpen(false); void process.refetch() }} />
    </div>
  )
}
