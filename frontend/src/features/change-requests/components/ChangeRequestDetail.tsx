'use client'

import { useEffect, useState } from 'react'
import { ClipboardEdit, Send, Sparkles } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { ErrorState } from '@/components/common/PageState'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton, SkeletonRegion, SkeletonText } from '@/components/ui/Skeleton'
import { formatDate, formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'
import {
  useChangeRequest,
  useImpactAnalysisJob,
  useImpactReport,
  useRefreshImpactData,
  useRunImpactAnalysis,
  useSubmitChangeRequest,
} from '@/features/change-requests/hooks/useChangeRequests'
import { ApprovalTimeline } from '@/features/change-requests/components/ApprovalTimeline'
import {
  ChangeRequestStatusBadge,
  ImpactLevelBadge,
  RiskLevelBadge,
} from '@/features/change-requests/components/ChangeRequestStatusBadge'
import { ImpactLevelPanel, OPEN_CR_STATUSES } from '@/features/change-requests/components/ImpactLevelPanel'
import { ManualImpactReportModal } from '@/features/change-requests/components/ManualImpactReportModal'
import { useProjectDetail } from '@/features/projects/hooks/useProjects'
import { parseMissingRoles } from '@/features/change-requests/approvals'
import type { ImpactReport } from '@/types/change-request.types'

/** AIResultResponse.result là Record<string, unknown> lỏng lẻo ở tầng API — thu
 * hẹp kiểu bằng tay ở đây trước khi đọc các trường risk_*. */
function isImpactReport(value: unknown): value is ImpactReport {
  return (
    typeof value === 'object' &&
    value !== null &&
    'risk_level' in value &&
    'risk_score' in value &&
    'schedule_impact_days' in value
  )
}

// Bố cục 2 cột: trang chi tiết dùng từ lg; khi nhúng cạnh danh sách thì cột hẹp
// hơn nên chỉ tách 2 cột từ 2xl (chuỗi class viết đầy đủ để Tailwind quét được).
const LAYOUT_CLASSES = {
  page: 'grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]',
  embedded: 'grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]',
} as const

/** Một cặp nhãn - giá trị trong khối thông tin bên phải. */
function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <dt className="text-body-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-body-sm font-medium text-foreground">{children}</dd>
    </div>
  )
}

export function ChangeRequestDetail({
  changeRequestId,
  variant = 'page',
}: {
  changeRequestId: number
  /** `embedded`: hiển thị cạnh danh sách CR (tiêu đề cấp H3, 2 cột từ 2xl). */
  variant?: 'page' | 'embedded'
}) {
  const [jobId, setJobId] = useState<string | null>(null)
  const getApiErrorMessage = useApiErrorMessage()
  const tw = useTranslations('workflowUi')
  const locale = useLocale()
  const query = useChangeRequest(changeRequestId)
  const runAnalysis = useRunImpactAnalysis()
  const submitMutation = useSubmitChangeRequest()
  const job = useImpactAnalysisJob(jobId)
  const savedReport = useImpactReport(changeRequestId)
  const refreshImpactData = useRefreshImpactData(changeRequestId)
  const project = useProjectDetail(query.data?.project_id ?? Number.NaN)
  const [manualOpen, setManualOpen] = useState(false)
  const t = useTranslations('approvals')
  const ti = useTranslations('impactControl')
  const tc = useTranslations('common')
  const jobStatus = job.data?.status

  // Job phân tích xong: tải lại báo cáo đã lưu và chuỗi duyệt (revision báo cáo đã tăng).
  useEffect(() => {
    if (jobId !== null && jobStatus === 'COMPLETED') refreshImpactData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, jobStatus])

  // Chuyển sang xem change request khác thì job đang theo dõi (nếu có) không
  // còn liên quan tới nó nữa.
  useEffect(() => {
    setJobId(null)
    runAnalysis.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeRequestId])

  if (query.isLoading) {
    // Khung xương cùng bố cục 2 cột với nội dung thật để tránh nhảy trang.
    return (
      <SkeletonRegion label={tw('loadingChangeRequest')} className={LAYOUT_CLASSES[variant]}>
        <div className="min-w-0 space-y-6">
          <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6 shadow-soft">
            <Skeleton className="h-6 w-2/3" />
            <SkeletonText lines={4} />
          </div>
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      </SkeletonRegion>
    )
  }
  if (query.isError || !query.data) {
    return <ErrorState message={getApiErrorMessage(query.error)} onRetry={() => void query.refetch()} retryLabel={tc('retry')} />
  }

  const changeRequest = query.data
  // Ưu tiên báo cáo đã lưu (không mất khi tải lại trang); kết quả job chỉ dùng tạm khi chưa tải lại.
  const jobReport = isImpactReport(job.data?.result) ? job.data.result : null
  const report = savedReport.data ?? jobReport
  // Chỉ PM của dự án được chốt mức và nhập đánh giá thủ công (admin hệ thống thì không).
  const canManageImpact = project.data?.current_user_role === 'PM'
  const isOpen = OPEN_CR_STATUSES.includes(changeRequest.status)
  const canEnterManual = canManageImpact && isOpen && savedReport.data?.source !== 'AI'
  const isAnalyzing = jobId !== null && !job.isError && job.data?.status !== 'COMPLETED' && job.data?.status !== 'FAILED'
  const TitleTag = variant === 'page' ? 'h2' : 'h3'

  const runImpactAnalysis = async () => {
    try {
      const response = await runAnalysis.mutateAsync(changeRequestId)
      setJobId(response.job_id)
    } catch {
      // Trạng thái lỗi của mutation được render ở dưới.
    }
  }

  return (
    <div className={LAYOUT_CLASSES[variant]}>
      {/* ===== Cột chính: nội dung CR và phân tích tác động AI ===== */}
      <div className="min-w-0 space-y-6">
        <Card as="article" aria-labelledby={`cr-title-${changeRequest.id}`}>
          <CardHeader>
            <div className="min-w-0 flex-1">
              <TitleTag id={`cr-title-${changeRequest.id}`} className="break-words text-h4 text-foreground sm:text-h3">
                {changeRequest.title}
              </TitleTag>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <ChangeRequestStatusBadge status={changeRequest.status} />
                <ImpactLevelBadge level={changeRequest.impact_level} confirmed={changeRequest.impact_level_confirmed} />
              </div>
            </div>
            {changeRequest.status === 'DRAFT' && (
              <Button
                type="button"
                variant="outline"
                fullWidth={false}
                className="w-full sm:w-auto"
                isLoading={submitMutation.isPending}
                onClick={() => submitMutation.mutate(changeRequest.id)}
              >
                {!submitMutation.isPending && <Send className="h-4 w-4" aria-hidden="true" />}
                {tw('submit')}
              </Button>
            )}
          </CardHeader>

          {submitMutation.isError && (
            <Alert className="mb-4">
              {(() => {
                // 422 missing_roles: nêu rõ vai trò còn thiếu trong dự án.
                const roles = parseMissingRoles(submitMutation.error)
                return roles ? t('missingRoles', { roles: roles.map((role) => t(`role.${role}`)).join(', ') }) : getApiErrorMessage(submitMutation.error)
              })()}
            </Alert>
          )}

          <div className="space-y-6">
            <p className="max-w-prose-ui whitespace-pre-line break-words text-body-sm text-foreground sm:text-body">
              {changeRequest.description}
            </p>

            {changeRequest.reason && (
              <div>
                <h4 className="text-overline uppercase text-muted-foreground">{tw('reason')}</h4>
                <p className="mt-2 max-w-prose-ui break-words text-body-sm text-foreground">{changeRequest.reason}</p>
              </div>
            )}

            {changeRequest.impact_description && (
              <div>
                <h4 className="text-overline uppercase text-muted-foreground">{tw('reportedImpact')}</h4>
                <p className="mt-2 max-w-prose-ui break-words text-body-sm text-foreground">{changeRequest.impact_description}</p>
              </div>
            )}
          </div>
        </Card>

        <Card as="section" aria-labelledby={`cr-impact-${changeRequest.id}`}>
          <CardHeader>
            <div className="min-w-0">
              <CardTitle as={variant === 'page' ? 'h3' : 'h4'} id={`cr-impact-${changeRequest.id}`} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                {tw('impactAnalysis')}
              </CardTitle>
              <CardDescription>{tw('impactAnalysisDescription')}</CardDescription>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              {canEnterManual && (
                <Button type="button" variant="outline" fullWidth={false} className="w-full sm:w-auto" onClick={() => setManualOpen(true)}>
                  <ClipboardEdit className="h-4 w-4" aria-hidden="true" />
                  {ti('manualOpen')}
                </Button>
              )}
              <Button
                type="button"
                fullWidth={false}
                className="w-full sm:w-auto"
                onClick={runImpactAnalysis}
                isLoading={runAnalysis.isPending}
              >
                {!runAnalysis.isPending && <Sparkles className="h-4 w-4" aria-hidden="true" />}
                {tw('runImpactAnalysis')}
              </Button>
            </div>
          </CardHeader>

          <div className="space-y-4">
            {runAnalysis.isError && <Alert>{getApiErrorMessage(runAnalysis.error)}</Alert>}

            {jobId && job.isError && <Alert>{getApiErrorMessage(job.error)}</Alert>}

            {isAnalyzing && (
              // Khung xương có hình dạng của báo cáo tác động trong lúc job AI chạy.
              <div role="status" className="space-y-4 rounded-lg border border-dashed p-4">
                <p className="text-body-sm text-muted-foreground">{tw('analyzingImpact')}</p>
                <div aria-hidden="true" className="space-y-3">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                  </div>
                  <SkeletonText lines={2} />
                </div>
              </div>
            )}

            {jobId && job.data?.status === 'FAILED' && <Alert>{getApiErrorMessage(new Error(job.data.error ?? ''), tw('impactAnalysisFailed'))}</Alert>}

            {!report && !isAnalyzing && savedReport.isSuccess && (
              <p className="text-body-sm text-muted-foreground">{ti('noReport')}</p>
            )}

            {report && (
              <div className="space-y-4 rounded-lg border bg-muted/30 p-4 animate-fade-up">
                {/* Báo cáo chỉ là khuyến nghị: con người quyết định từng bước duyệt. */}
                <p className="text-overline uppercase text-warning">{ti('advisoryLabel')}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <RiskLevelBadge level={report.risk_level} />
                  <span className="text-body-sm text-muted-foreground">{tw('riskScore', { score: new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(report.risk_score) })}</span>
                  {report.revision !== undefined && (
                    <span className="text-caption text-muted-foreground">
                      {report.source === 'MANUAL' ? ti('sourceManual') : ti('sourceAI')} · {ti('revision', { revision: report.revision })}
                    </span>
                  )}
                </div>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border bg-card p-3">
                    <dt className="text-overline uppercase text-muted-foreground">{tw('scheduleImpact')}</dt>
                    <dd className="mt-1 text-h4 tabular-nums text-foreground">
                      {report.schedule_impact_days > 0 ? '+' : ''}
                      {tw('daysValue', { days: report.schedule_impact_days })}
                    </dd>
                  </div>
                  <div className="rounded-lg border bg-card p-3">
                    <dt className="text-overline uppercase text-muted-foreground">{tw('costImpact')}</dt>
                    <dd className="mt-1 text-h4 tabular-nums text-foreground">{formatMoney(report.cost_impact, undefined, locale)}</dd>
                  </div>
                </dl>
                {report.summary && (
                  <div>
                    <p className="text-overline uppercase text-muted-foreground">{tw('summary')}</p>
                    <p className="mt-1 max-w-prose-ui text-body-sm text-muted-foreground">{report.summary}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ===== Cột phụ: thông tin meta và chuỗi phê duyệt ===== */}
      <aside className="min-w-0 space-y-6">
        <Card>
          <CardTitle as={variant === 'page' ? 'h3' : 'h4'} className="mb-4">{tw('details')}</CardTitle>
          <dl className="divide-y">
            <MetaRow label={tw('reference')}>
              <span className="tabular-nums">CR #{changeRequest.id}</span>
            </MetaRow>
            <MetaRow label={tw('created')}>{formatDate(changeRequest.created_at, locale)}</MetaRow>
            {changeRequest.applied_at && <MetaRow label={tw('applied')}>{formatDate(changeRequest.applied_at, locale)}</MetaRow>}
          </dl>
        </Card>

        <Card>
          <ImpactLevelPanel
            changeRequest={changeRequest}
            report={savedReport.data ?? null}
            canManage={canManageImpact}
            headingAs={variant === 'page' ? 'h3' : 'h4'}
          />
        </Card>

        <Card className={cn(changeRequest.status === 'DRAFT' && 'border-dashed shadow-none')}>
          {changeRequest.status !== 'DRAFT' ? (
            <ApprovalTimeline changeRequestId={changeRequest.id} />
          ) : (
            <>
              <CardTitle as={variant === 'page' ? 'h3' : 'h4'}>{t('title')}</CardTitle>
              <CardDescription className="mt-2">{t('empty')}</CardDescription>
            </>
          )}
        </Card>
      </aside>

      {canEnterManual && (
        <ManualImpactReportModal changeRequestId={changeRequest.id} open={manualOpen} onClose={() => setManualOpen(false)} />
      )}
    </div>
  )
}
