'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { AIGeneratorModal } from '@/features/ai/components/AIGeneratorModal'
import { saveActiveBriefId } from '@/features/ai/hooks/useRequirementBrief'
import { BRIEF_ITEM_KEYS, type BriefItemKey } from '@/features/ai/types/requirementBrief.types'
import { useDownloadDocument, useGenerateDocument, useProjectDocuments } from '@/features/documents/hooks/useDocuments'
import type { DocumentLanguage, DocumentStatus, DocumentType, GeneratedDocument } from '@/features/documents/types'
import { useNumericParam } from '@/hooks/useNumericParam'
import { getApiErrorMessage } from '@/types/api.types'

const KNOWN_ERRORS = ['document_generation_pending', 'ai_quota_exceeded', 'document_not_ready'] as const
const STATUS_STYLE: Record<DocumentStatus, string> = {
  queued: 'bg-muted text-muted-foreground',
  generating: 'bg-primary/10 text-primary',
  needs_clarification: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  ready: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  failed: 'bg-destructive/10 text-destructive',
}

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

export default function DocumentsPage() {
  const projectId = useNumericParam()
  const t = useTranslations('documents')
  const tc = useTranslations('clarifier')
  const documents = useProjectDocuments(projectId)
  const generate = useGenerateDocument(projectId)
  const download = useDownloadDocument(projectId)
  const [language, setLanguage] = useState<DocumentLanguage>('vi')
  const [clarifyOpen, setClarifyOpen] = useState(false)

  // Mã lỗi đã biết -> câu dịch; 403/404 -> không có quyền; còn lại dùng thông điệp API.
  const errorText = (error: unknown, fallback: string) => {
    const { status, detail } = apiDetail(error)
    if (typeof detail === 'string' && (KNOWN_ERRORS as readonly string[]).includes(detail)) return t(`errors.${detail as (typeof KNOWN_ERRORS)[number]}`)
    if (status === 403 || status === 404) return t('errors.forbidden')
    return getApiErrorMessage(error, fallback)
  }

  const itemLabel = (key: string) =>
    (BRIEF_ITEM_KEYS as readonly string[]).includes(key) ? tc(`items.${key as BriefItemKey}`) : key

  const openClarifier = (doc: GeneratedDocument) => {
    // Đặt hồ sơ của dự án làm hồ sơ đang mở để luồng hỏi làm rõ khôi phục đúng hồ sơ.
    if (doc.brief_id) saveActiveBriefId(doc.brief_id)
    setClarifyOpen(true)
  }

  const requestDoc = (docType: DocumentType) => generate.mutate({ doc_type: docType, language })

  if (documents.isLoading) return <LoadingState label={t('loading')} />
  if (documents.isError) return <ErrorState message={errorText(documents.error, t('loadError'))} />
  const list = documents.data ?? []

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </header>

      <section className="space-y-3 rounded-xl border bg-card p-4" aria-labelledby="documents-generate">
        <h3 id="documents-generate" className="text-base font-semibold">{t('generateTitle')}</h3>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">{t('language')}</span>
            <select
              className="min-h-11 rounded-md border bg-background px-3"
              value={language}
              onChange={(event) => setLanguage(event.target.value as DocumentLanguage)}
            >
              <option value="vi">{t('languages.vi')}</option>
              <option value="en">{t('languages.en')}</option>
            </select>
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="sm:w-auto" onClick={() => requestDoc('SRS')} isLoading={generate.isPending && generate.variables?.doc_type === 'SRS'} disabled={generate.isPending}>{t('generateSrs')}</Button>
            <Button className="sm:w-auto" variant="outline" onClick={() => requestDoc('BRD')} isLoading={generate.isPending && generate.variables?.doc_type === 'BRD'} disabled={generate.isPending}>{t('generateBrd')}</Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{t('jobsHint')}</p>
        {generate.isError && <p role="alert" className="text-sm text-destructive">{errorText(generate.error, t('generateError'))}</p>}
        {generate.data?.job_id && <p role="status" className="text-sm text-muted-foreground">{t('queuedNotice', { id: generate.data.job_id })}</p>}
      </section>

      {download.isError && <p role="alert" className="text-sm text-destructive">{errorText(download.error, t('downloadError'))}</p>}

      {list.length === 0 ? (
        <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />
      ) : (
        <ul className="space-y-3" aria-label={t('listTitle')}>
          {list.map((doc) => (
            <li key={doc.id} className="space-y-3 rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {t('docTitle', { type: doc.doc_type, version: doc.version })}
                    <span className="text-xs font-normal text-muted-foreground">{t(`languages.${doc.language}`)}</span>
                  </p>
                  <time className="text-xs text-muted-foreground" dateTime={doc.created_at}>{formatDateTime(doc.created_at)}</time>
                </div>
                <span className={`rounded-md px-2 py-1 text-xs font-medium ${STATUS_STYLE[doc.status] ?? 'bg-muted'}`}>{t(`status.${doc.status}`)}</span>
              </div>

              {doc.progress.total_groups > 0 && doc.status !== 'needs_clarification' && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t('progress', { done: doc.progress.completed_groups, total: doc.progress.total_groups })}</p>
                  <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={doc.progress.total_groups} aria-valuenow={doc.progress.completed_groups} aria-label={t('progressLabel')}>
                    <div className="h-full bg-primary" style={{ width: `${Math.round((doc.progress.completed_groups / doc.progress.total_groups) * 100)}%` }} />
                  </div>
                </div>
              )}

              {doc.status === 'failed' && (
                <p className="text-sm text-destructive">{doc.error_code ? t('failedWithCode', { code: doc.error_code }) : t('failed')}</p>
              )}

              {doc.status === 'needs_clarification' && (
                <div className="space-y-2 rounded-md border border-amber-500/40 p-3 text-sm">
                  {doc.missing_items.includes('no_brief') ? (
                    <p>{t('noBrief')}</p>
                  ) : (
                    <>
                      <p className="font-medium">{t('missingTitle')}</p>
                      <ul className="list-inside list-disc">{doc.missing_items.map(key => <li key={key}>{itemLabel(key)}</li>)}</ul>
                      <p className="text-xs text-muted-foreground">{t('clarifyHint')}</p>
                      <Button className="sm:w-auto" variant="outline" onClick={() => openClarifier(doc)}>{t('openClarifier')}</Button>
                    </>
                  )}
                </div>
              )}

              {doc.warnings.length > 0 && (
                <details className="text-sm">
                  <summary className="min-h-9 cursor-pointer text-amber-700 dark:text-amber-400">{t('warnings', { count: doc.warnings.length })}</summary>
                  <ul className="mt-2 list-inside list-disc space-y-1 break-words text-xs text-muted-foreground">{doc.warnings.map((warning, index) => <li key={index}>{String(warning)}</li>)}</ul>
                </details>
              )}

              {doc.status === 'ready' && (
                <Button
                  className="sm:w-auto"
                  variant="outline"
                  onClick={() => download.mutate(doc)}
                  isLoading={download.isPending && download.variables?.id === doc.id}
                  aria-label={t('downloadFor', { type: doc.doc_type, version: doc.version })}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />{t('download')}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      <AIGeneratorModal open={clarifyOpen} onClose={() => { setClarifyOpen(false); void documents.refetch() }} />
    </div>
  )
}
