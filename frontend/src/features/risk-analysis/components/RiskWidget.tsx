'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'
import { JobConnectionNotice } from '@/features/jobs/components/JobConnectionNotice'
import {
  asRiskFactorList,
  asStringList,
  type RiskLevel,
} from '@/types/risk-report.types'
import { useRequestRiskAnalysis, useRiskAnalysisJob } from '@/features/risk-analysis/hooks/useRiskAnalysis'

// Mức rủi ro -> tông Badge theo token ngữ nghĩa; HIGH/CRITICAL phân biệt bằng chữ.
const RISK_TONE: Record<RiskLevel, BadgeTone> = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'danger',
  CRITICAL: 'danger',
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
  const t = useTranslations('insightsUi')
  const locale = useLocale()
  const getApiErrorMessage = useApiErrorMessage()
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
  const isRunning = jobId !== null && status !== 'COMPLETED' && status !== 'FAILED'
  const parsed = status === 'COMPLETED' ? parseRiskResult(job.data?.result ?? null) : null

  return (
    <Card as="section" aria-labelledby="risk-widget-title" className="min-w-0">
      <CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent" aria-hidden="true">
            <ShieldAlert className="h-5 w-5 text-accent-foreground" />
          </span>
          <div className="min-w-0">
            <CardTitle as="h3" id="risk-widget-title">{t('riskTitle')}</CardTitle>
            <CardDescription>{t('riskDescription')}</CardDescription>
          </div>
        </div>
        <Button
          type="button"
          fullWidth={false}
          className="w-full sm:w-auto"
          isLoading={requestMutation.isPending}
          disabled={isRunning}
          onClick={() => void runScan()}
        >
          {!requestMutation.isPending && <Sparkles className="h-4 w-4" aria-hidden="true" />}
          {t('scanRisk')}
        </Button>
      </CardHeader>

      <div className="space-y-4">
        {requestMutation.isError && <Alert>{getApiErrorMessage(requestMutation.error)}</Alert>}

        {jobId && job.isError && (
          <div className="space-y-3">
            <JobConnectionNotice error={job.error} />
            <Button type="button" variant="outline" fullWidth={false} className="w-full sm:w-auto" onClick={() => void job.refetch()} isLoading={job.isFetching}>
              {t('checkAgain')}
            </Button>
          </div>
        )}

        {isRunning && !job.isError && (
          // Khung xương có hình dạng kết quả (badge mức rủi ro, tóm tắt, danh sách yếu tố).
          <div role="status" className="space-y-4">
            <p className="text-body-sm text-muted-foreground">{t(status === 'PROCESSING' ? 'riskProcessing' : 'riskQueued')}</p>
            <div aria-hidden="true" className="space-y-3">
              <div className="flex gap-3"><Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-6 w-16" /></div>
              <SkeletonText lines={2} />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        )}

        {jobId && status === 'FAILED' && <Alert>{getApiErrorMessage({ message: job.data?.error }, t('riskFailed'))}</Alert>}

        {!jobId && !requestMutation.isError && (
          <p className="rounded-lg border border-dashed bg-muted/30 p-4 text-center text-body-sm text-muted-foreground">
            {t('riskEmpty')}
          </p>
        )}

        {parsed && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone={RISK_TONE[parsed.riskLevel]} dot>{t(`riskLevel.${parsed.riskLevel}`)}</Badge>
              {parsed.riskScore !== null && (
                <span className="text-h4 tabular-nums text-foreground">
                  {new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(parsed.riskScore)}
                  <span className="text-body-sm font-normal text-muted-foreground"> / 10</span>
                </span>
              )}
            </div>

            {parsed.summary && <p className="max-w-prose-ui text-body-sm text-muted-foreground">{parsed.summary}</p>}

            {parsed.factors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-overline uppercase text-muted-foreground">{t('riskFactors')}</h4>
                <ul className="space-y-2">
                  {parsed.factors.map((factor, index) => {
                    const severity = isRiskLevel(factor.severity) ? factor.severity : 'MEDIUM'
                    return (
                      <li key={`${factor.factor}-${index}`} className="rounded-lg border p-3 text-body-sm">
                        <div className="mb-1 flex items-start gap-2">
                          <span className="flex h-5 shrink-0 items-center" aria-hidden="true">
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                          </span>
                          <span className="min-w-0 flex-1 break-words font-medium text-foreground">{factor.factor}</span>
                          <Badge tone={RISK_TONE[severity]} size="sm">{t(`riskLevel.${severity}`)}</Badge>
                        </div>
                        <p className="pl-6 text-muted-foreground">{factor.explanation}</p>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {parsed.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-overline uppercase text-muted-foreground">{t('mitigation')}</h4>
                <ul className="list-disc space-y-1 pl-6 text-body-sm text-foreground">
                  {parsed.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
