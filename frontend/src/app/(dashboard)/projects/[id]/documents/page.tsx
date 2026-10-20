'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { AlertTriangle, Download, FileText, Sparkles } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Label } from '@/components/common/Label'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { AIGeneratorModal } from '@/features/ai/components/AIGeneratorModal'
import { saveActiveBriefId } from '@/features/ai/hooks/useRequirementBrief'
import { BRIEF_ITEM_KEYS, type BriefItemKey } from '@/features/ai/types/requirementBrief.types'
import { useDownloadDocument, useGenerateDocument, useProjectDocuments } from '@/features/documents/hooks/useDocuments'
import type { DocumentLanguage, DocumentStatus, DocumentType, GeneratedDocument } from '@/features/documents/types'
import { useNumericParam } from '@/hooks/useNumericParam'
import { getApiErrorMessage } from '@/types/api.types'

const KNOWN_ERRORS = ['document_generation_pending', 'ai_quota_exceeded', 'document_not_ready'] as const
// Trạng thái tài liệu -> tông Badge theo token ngữ nghĩa.
const STATUS_TONE: Record<DocumentStatus, BadgeTone> = {
  queued: 'neutral',
  generating: 'info',
  needs_clarification: 'warning',
  ready: 'success',
  failed: 'danger',
}

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

export default function DocumentsPage() {
  const locale = useLocale()
  const projectId = useNumericParam()
  const t = useTranslations('documents')
  const tc = useTranslations('clarifier')
  const tcommon = useTranslations('common')
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
  // Loại tài liệu đang gửi yêu cầu (để chỉ nút tương ứng hiện spinner).
  const pendingType = generate.isPending ? generate.variables?.doc_type : undefined

  const header = <SectionHeader title={t('title')} description={t('subtitle')} />

  if (documents.isLoading) {
    return (
      <div className="space-y-6">
        {header}
        <LoadingState variant="cards" label={t('loading')} />
      </div>
    )
  }
  if (documents.isError) {
    return (
      <div className="space-y-6">
        {header}
        <ErrorState message={errorText(documents.error, t('loadError'))} onRetry={() => void documents.refetch()} retryLabel={tcommon('retry')} />
      </div>
    )
  }
  const list = documents.data ?? []

  return (
    <div className="space-y-6">
      {header}

      {/* ===== Khối sinh tài liệu: SRS là CTA chính, BRD là nút phụ ===== */}
      <Card as="section" aria-labelledby="documents-generate">
        <CardHeader>
          <div className="min-w-0">
            <CardTitle as="h3" id="documents-generate">{t('generateTitle')}</CardTitle>
            <CardDescription>{t('jobsHint')}</CardDescription>
          </div>
        </CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="sm:w-56">
            <Label htmlFor="documents-language">{t('language')}</Label>
            <Select id="documents-language" value={language} onChange={(event) => setLanguage(event.target.value as DocumentLanguage)}>
              <option value="vi">{t('languages.vi')}</option>
              <option value="en">{t('languages.en')}</option>
            </Select>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button fullWidth={false} className="w-full sm:w-auto" onClick={() => requestDoc('SRS')} isLoading={pendingType === 'SRS'} disabled={generate.isPending}>
              {pendingType !== 'SRS' && <Sparkles className="h-4 w-4" aria-hidden="true" />}
              {t('generateSrs')}
            </Button>
            <Button fullWidth={false} className="w-full sm:w-auto" variant="outline" onClick={() => requestDoc('BRD')} isLoading={pendingType === 'BRD'} disabled={generate.isPending}>
              {pendingType !== 'BRD' && <Sparkles className="h-4 w-4" aria-hidden="true" />}
              {t('generateBrd')}
            </Button>
          </div>
        </div>
        {generate.isError && <p role="alert" className="mt-4 text-body-sm text-destructive">{errorText(generate.error, t('generateError'))}</p>}
        {generate.data?.job_id && <p role="status" className="mt-4 text-body-sm text-muted-foreground">{t('queuedNotice', { id: generate.data.job_id })}</p>}
      </Card>

      {download.isError && <p role="alert" className="text-body-sm text-destructive">{errorText(download.error, t('downloadError'))}</p>}

      {list.length === 0 ? (
        <EmptyState icon={FileText} title={t('emptyTitle')} description={t('emptyDescription')} />
      ) : (
        <section className="space-y-4" aria-labelledby="documents-list">
          <h3 id="documents-list" className="text-h4 text-foreground">{t('listTitle')}</h3>
          <ul className="grid gap-4 md:grid-cols-2" aria-label={t('listTitle')}>
            {list.map((doc) => {
              const percent = doc.progress.total_groups > 0 ? Math.round((doc.progress.completed_groups / doc.progress.total_groups) * 100) : 0
              const downloading = download.isPending && download.variables?.id === doc.id
              return (
                <li key={doc.id} className="flex min-w-0 flex-col gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-soft sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent" aria-hidden="true">
                        <FileText className="h-5 w-5 text-accent-foreground" />
                      </span>
                      <div className="min-w-0">
                        <p className="break-words text-body font-semibold text-foreground">{t('docTitle', { type: doc.doc_type, version: doc.version })}</p>
                        <p className="text-caption text-muted-foreground">
                          {t(`languages.${doc.language}`)} · <time dateTime={doc.created_at}>{formatDateTime(doc.created_at, locale)}</time>
                        </p>
                      </div>
                    </div>
                    <Badge tone={STATUS_TONE[doc.status] ?? 'neutral'} dot>{t(`status.${doc.status}`)}</Badge>
                  </div>

                  {doc.progress.total_groups > 0 && doc.status !== 'needs_clarification' && (
                    <div className="space-y-2">
                      <p className="text-caption text-muted-foreground">{t('progress', { done: doc.progress.completed_groups, total: doc.progress.total_groups })}</p>
                      <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={doc.progress.total_groups} aria-valuenow={doc.progress.completed_groups} aria-label={t('progressLabel')}>
                        <div className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out-soft" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  )}

                  {doc.status === 'failed' && (
                    <p className="text-body-sm text-destructive">{doc.error_code ? t('failedWithCode', { code: doc.error_code }) : t('failed')}</p>
                  )}

                  {doc.status === 'needs_clarification' && (
                    <div className="space-y-2 rounded-lg border border-warning/25 bg-warning-soft p-3 text-body-sm text-foreground">
                      {doc.missing_items.includes('no_brief') ? (
                        <p>{t('noBrief')}</p>
                      ) : (
                        <>
                          <p className="font-medium">{t('missingTitle')}</p>
                          <ul className="list-inside list-disc">{doc.missing_items.map(key => <li key={key}>{itemLabel(key)}</li>)}</ul>
                          <p className="text-caption text-muted-foreground">{t('clarifyHint')}</p>
                          <Button variant="outline" fullWidth={false} className="w-full sm:w-auto" onClick={() => openClarifier(doc)}>{t('openClarifier')}</Button>
                        </>
                      )}
                    </div>
                  )}

                  {doc.warnings.length > 0 && (
                    <details className="text-body-sm">
                      <summary className="flex min-h-11 cursor-pointer items-center gap-2 rounded font-medium text-warning focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {t('warnings', { count: doc.warnings.length })}
                      </summary>
                      <ul className="mt-2 list-inside list-disc space-y-1 break-words text-caption text-muted-foreground">{doc.warnings.map((warning, index) => <li key={index}>{String(warning)}</li>)}</ul>
                    </details>
                  )}

                  {doc.status === 'ready' && (
                    <div className="mt-auto border-t pt-4">
                      <Button
                        variant="outline"
                        fullWidth={false}
                        className="w-full sm:w-auto"
                        onClick={() => download.mutate(doc)}
                        isLoading={downloading}
                        aria-label={t('downloadFor', { type: doc.doc_type, version: doc.version })}
                      >
                        {!downloading && <Download className="h-4 w-4" aria-hidden="true" />}
                        {t('download')}
                      </Button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <AIGeneratorModal open={clarifyOpen} onClose={() => { setClarifyOpen(false); void documents.refetch() }} />
    </div>
  )
}
