'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { LoadingState } from '@/components/common/PageState'
import { Spinner } from '@/components/common/Spinner'
import { formatDate, formatMoney, formatStatus } from '@/lib/format'
import { getApiErrorMessage } from '@/types/api.types'
import {
  useChangeRequest,
  useImpactAnalysisJob,
  useRunImpactAnalysis,
  useSubmitChangeRequest,
} from '@/features/change-requests/hooks/useChangeRequests'
import type { ImpactReport, RiskLevel } from '@/types/change-request.types'

const RISK_CLASSES: Record<RiskLevel, string> = {
  LOW: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  MEDIUM: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  HIGH: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
  CRITICAL: 'bg-destructive/10 text-destructive',
}

function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${RISK_CLASSES[level]}`}
    >
      {level}
    </span>
  )
}

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

export function ChangeRequestDetail({ changeRequestId }: { changeRequestId: number }) {
  const [jobId, setJobId] = useState<string | null>(null)
  const query = useChangeRequest(changeRequestId)
  const runAnalysis = useRunImpactAnalysis()
  const submitMutation = useSubmitChangeRequest()
  const job = useImpactAnalysisJob(jobId)

  // Chuyển sang xem change request khác thì job đang theo dõi (nếu có) không
  // còn liên quan tới nó nữa.
  useEffect(() => {
    setJobId(null)
    runAnalysis.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeRequestId])

  if (query.isLoading) return <LoadingState label="Loading change request…" />
  if (query.isError || !query.data) return <Alert>{getApiErrorMessage(query.error)}</Alert>

  const changeRequest = query.data
  const report = isImpactReport(job.data?.result) ? job.data.result : null

  const runImpactAnalysis = async () => {
    try {
      const response = await runAnalysis.mutateAsync(changeRequestId)
      setJobId(response.job_id)
    } catch {
      // Trạng thái lỗi của mutation được render ở dưới.
    }
  }

  return (
    <section className="space-y-4 rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{changeRequest.title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatStatus(changeRequest.status)} · Created {formatDate(changeRequest.created_at)}
          </p>
        </div>
        {changeRequest.status === 'DRAFT' && (
          <Button
            type="button"
            variant="outline"
            className="sm:w-auto"
            isLoading={submitMutation.isPending}
            onClick={() => submitMutation.mutate(changeRequest.id)}
          >
            Submit
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{changeRequest.description}</p>

      {changeRequest.reason && (
        <div>
          <h3 className="text-sm font-medium">Reason</h3>
          <p className="mt-1 text-sm text-muted-foreground">{changeRequest.reason}</p>
        </div>
      )}

      {changeRequest.impact_description && (
        <div>
          <h3 className="text-sm font-medium">Impact (as reported)</h3>
          <p className="mt-1 text-sm text-muted-foreground">{changeRequest.impact_description}</p>
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold">AI impact analysis</h3>
          <Button
            type="button"
            className="sm:w-auto"
            onClick={runImpactAnalysis}
            isLoading={runAnalysis.isPending}
          >
            <Sparkles className="h-4 w-4" />
            Run impact analysis
          </Button>
        </div>

        {runAnalysis.isError && <Alert className="mt-3">{getApiErrorMessage(runAnalysis.error)}</Alert>}

        {jobId && job.isError && <Alert className="mt-3">{getApiErrorMessage(job.error)}</Alert>}

        {jobId && !job.isError && job.data?.status !== 'COMPLETED' && job.data?.status !== 'FAILED' && (
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <Spinner className="h-4 w-4" />
            Analyzing impact…
          </div>
        )}

        {jobId && job.data?.status === 'FAILED' && (
          <Alert className="mt-3">{job.data.error ?? 'Impact analysis failed.'}</Alert>
        )}

        {report && (
          <div className="mt-4 space-y-3 rounded-lg border p-4">
            <div className="flex flex-wrap items-center gap-3">
              <RiskBadge level={report.risk_level} />
              <span className="text-sm text-muted-foreground">
                Risk score: {report.risk_score.toFixed(1)} / 10
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Schedule impact</p>
                <p className="text-sm font-medium">
                  {report.schedule_impact_days > 0 ? '+' : ''}
                  {report.schedule_impact_days} days
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Cost impact</p>
                <p className="text-sm font-medium">{formatMoney(report.cost_impact)}</p>
              </div>
            </div>
            {report.summary && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Summary</p>
                <p className="mt-1 text-sm text-muted-foreground">{report.summary}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
