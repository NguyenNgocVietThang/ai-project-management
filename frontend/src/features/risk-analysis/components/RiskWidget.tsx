'use client'

import { useState } from 'react'
import { AlertTriangle, ShieldAlert } from 'lucide-react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/types/api.types'
import {
  RISK_LEVEL_COLOR,
  asRiskFactorList,
  asStringList,
  type RiskLevel,
} from '@/types/risk-report.types'
import { useRequestRiskAnalysis, useRiskAnalysisJob } from '@/features/risk-analysis/hooks/useRiskAnalysis'

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Đang xếp hàng chờ quét…',
  PROCESSING: 'AI đang phân tích rủi ro dự án…',
}

function isRiskLevel(value: unknown): value is RiskLevel {
  return value === 'LOW' || value === 'MEDIUM' || value === 'HIGH' || value === 'CRITICAL'
}

/** Kết quả job AI generic (`result: Record<string, unknown>`) không tự mang kiểu
 * RiskReport — parse phòng thủ ở đây thay vì ép kiểu ẩu, vì shape thật phụ thuộc
 * vào endpoint /ai/risk-analysis (nằm ngoài phạm vi component này). Chấp nhận cả
 * hai cách đặt tên field ("risk_factors" thô từ AI lẫn "risk_factors_json" đã
 * lưu DB) để không vỡ theo bất kỳ lựa chọn nào của phía backend. */
function parseRiskResult(result: Record<string, unknown> | null) {
  if (!result) return null
  const riskScoreRaw = result.risk_score
  const riskScore = typeof riskScoreRaw === 'number' ? riskScoreRaw : Number(riskScoreRaw ?? NaN)
  const riskLevelRaw = result.risk_level
  const riskLevel: RiskLevel = isRiskLevel(riskLevelRaw) ? riskLevelRaw : 'MEDIUM'
  const factors = asRiskFactorList(result.risk_factors_json ?? result.risk_factors)
  const suggestions = asStringList(result.mitigation_suggestions_json ?? result.mitigation_suggestions)
  const summary = typeof result.summary === 'string' ? result.summary : null
  return {
    riskScore: Number.isFinite(riskScore) ? riskScore : null,
    riskLevel,
    factors,
    suggestions,
    summary,
  }
}

export function RiskWidget({ projectId }: { projectId: number }) {
  const [jobId, setJobId] = useState<string | null>(null)
  const requestMutation = useRequestRiskAnalysis()
  const job = useRiskAnalysisJob(jobId)

  const runScan = async () => {
    try {
      const response = await requestMutation.mutateAsync(projectId)
      setJobId(response.job_id)
    } catch {
      // Trạng thái lỗi của mutation đã được render bên dưới.
    }
  }

  const status = job.data?.status
  const isRunning = jobId !== null && !job.isError && status !== 'COMPLETED' && status !== 'FAILED'
  const parsed = status === 'COMPLETED' ? parseRiskResult(job.data?.result ?? null) : null

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" aria-hidden="true" />
          <h3 className="text-sm font-semibold">Phân tích rủi ro AI</h3>
        </div>
        <Button
          type="button"
          variant="outline"
          className="sm:w-auto"
          isLoading={requestMutation.isPending}
          disabled={isRunning}
          onClick={() => void runScan()}
        >
          Quét rủi ro
        </Button>
      </div>

      {requestMutation.isError && <Alert>{getApiErrorMessage(requestMutation.error)}</Alert>}

      {jobId && job.isError && (
        <div className="space-y-3">
          <Alert>{getApiErrorMessage(job.error)}</Alert>
          <Button type="button" variant="outline" onClick={() => void job.refetch()} isLoading={job.isFetching}>
            Thử kiểm tra lại
          </Button>
        </div>
      )}

      {isRunning && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <Spinner className="h-6 w-6 text-primary" />
          <p className="text-sm text-muted-foreground">{STATUS_LABEL[status ?? 'PENDING']}</p>
        </div>
      )}

      {jobId && status === 'FAILED' && (
        <Alert>{job.data?.error ?? 'Phân tích rủi ro thất bại.'}</Alert>
      )}

      {parsed && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                RISK_LEVEL_COLOR[parsed.riskLevel]
              )}
            >
              {parsed.riskLevel}
            </span>
            {parsed.riskScore !== null && (
              <span className="text-sm font-medium">{parsed.riskScore.toFixed(1)} / 10</span>
            )}
          </div>

          {parsed.summary && <p className="text-sm text-muted-foreground">{parsed.summary}</p>}

          {parsed.factors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground">Yếu tố rủi ro</h4>
              <ul className="space-y-2">
                {parsed.factors.map((factor, index) => (
                  <li key={`${factor.factor}-${index}`} className="rounded-md border p-2.5 text-sm">
                    <div className="mb-1 flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <span className="font-medium">{factor.factor}</span>
                      <span
                        className={cn(
                          'ml-auto inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium',
                          RISK_LEVEL_COLOR[isRiskLevel(factor.severity) ? factor.severity : 'MEDIUM']
                        )}
                      >
                        {factor.severity}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{factor.explanation}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {parsed.suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground">Gợi ý giảm thiểu</h4>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {parsed.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
