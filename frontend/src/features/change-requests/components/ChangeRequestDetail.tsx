'use client'

import { useEffect, useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { ErrorState } from '@/components/common/PageState'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton, SkeletonRegion, SkeletonText } from '@/components/ui/Skeleton'
import { formatDate, formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/types/api.types'
import {
  useChangeRequest,
  useImpactAnalysisJob,
  useRunImpactAnalysis,
  useSubmitChangeRequest,
} from '@/features/change-requests/hooks/useChangeRequests'
import { ApprovalTimeline } from '@/features/change-requests/components/ApprovalTimeline'
import { ChangeRequestStatusBadge, RiskLevelBadge } from '@/features/change-requests/components/ChangeRequestStatusBadge'
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
  const query = useChangeRequest(changeRequestId)
  const runAnalysis = useRunImpactAnalysis()
  const submitMutation = useSubmitChangeRequest()
  const job = useImpactAnalysisJob(jobId)
  const t = useTranslations('approvals')
  const tc = useTranslations('common')

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
      <SkeletonRegion label="Loading change request…" className={LAYOUT_CLASSES[variant]}>
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
  const report = isImpactReport(job.data?.result) ? job.data.result : null
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
                Submit
              </Button>
            )}
          </CardHeader>

          {submitMutation.isError && (
            <Alert className="mb-4">
              {(() => {
                // 422 missing_roles: nêu rõ vai trò còn thiếu trong dự án.
                const roles = parseMissingRoles(submitMutation.error)
                return roles ? t('missingRoles', { roles: roles.join(', ') }) : getApiErrorMessage(submitMutation.error)
              })()}
            </Alert>
          )}

          <div className="space-y-6">
            <p className="max-w-prose-ui whitespace-pre-line break-words text-body-sm text-foreground sm:text-body">
              {changeRequest.description}
            </p>

            {changeRequest.reason && (
              <div>
                <h4 className="text-overline uppercase text-muted-foreground">Reason</h4>
                <p className="mt-2 max-w-prose-ui break-words text-body-sm text-foreground">{changeRequest.reason}</p>
              </div>
            )}

            {changeRequest.impact_description && (
              <div>
                <h4 className="text-overline uppercase text-muted-foreground">Impact (as reported)</h4>
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
                AI impact analysis
              </CardTitle>
              <CardDescription>Estimate schedule, cost and risk impact of this change before it is approved.</CardDescription>
            </div>
            <Button
              type="button"
              fullWidth={false}
              className="w-full sm:w-auto"
              onClick={runImpactAnalysis}
              isLoading={runAnalysis.isPending}
            >
              {!runAnalysis.isPending && <Sparkles className="h-4 w-4" aria-hidden="true" />}
              Run impact analysis
            </Button>
          </CardHeader>

          <div className="space-y-4">
            {runAnalysis.isError && <Alert>{getApiErrorMessage(runAnalysis.error)}</Alert>}

            {jobId && job.isError && <Alert>{getApiErrorMessage(job.error)}</Alert>}

            {isAnalyzing && (
              // Khung xương có hình dạng của báo cáo tác động trong lúc job AI chạy.
              <div role="status" className="space-y-4 rounded-lg border border-dashed p-4">
                <p className="text-body-sm text-muted-foreground">Analyzing impact…</p>
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

            {jobId && job.data?.status === 'FAILED' && <Alert>{job.data.error ?? 'Impact analysis failed.'}</Alert>}

            {report && (
              <div className="space-y-4 rounded-lg border bg-muted/30 p-4 animate-fade-up">
                <div className="flex flex-wrap items-center gap-3">
                  <RiskLevelBadge level={report.risk_level} />
                  <span className="text-body-sm text-muted-foreground">Risk score: {report.risk_score.toFixed(1)} / 10</span>
                </div>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border bg-card p-3">
                    <dt className="text-overline uppercase text-muted-foreground">Schedule impact</dt>
                    <dd className="mt-1 text-h4 tabular-nums text-foreground">
                      {report.schedule_impact_days > 0 ? '+' : ''}
                      {report.schedule_impact_days} days
                    </dd>
                  </div>
                  <div className="rounded-lg border bg-card p-3">
                    <dt className="text-overline uppercase text-muted-foreground">Cost impact</dt>
                    <dd className="mt-1 text-h4 tabular-nums text-foreground">{formatMoney(report.cost_impact)}</dd>
                  </div>
                </dl>
                {report.summary && (
                  <div>
                    <p className="text-overline uppercase text-muted-foreground">Summary</p>
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
          <CardTitle as={variant === 'page' ? 'h3' : 'h4'} className="mb-4">Details</CardTitle>
          <dl className="divide-y">
            <MetaRow label="Reference">
              <span className="tabular-nums">CR #{changeRequest.id}</span>
            </MetaRow>
            <MetaRow label="Created">{formatDate(changeRequest.created_at)}</MetaRow>
            {changeRequest.applied_at && <MetaRow label="Applied">{formatDate(changeRequest.applied_at)}</MetaRow>}
          </dl>
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
    </div>
  )
}
