'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { riskReportService } from '@/services/risk-report.service'
import { useJobPollingOptions, useCancelPausedJobQuery } from '@/features/jobs/hooks/jobPolling'
import { durableJobKeys } from '@/features/jobs/hooks/useJobs'

export const riskAnalysisJobKeys = {
  job: (jobId: string) => ['risk-analysis', 'jobs', jobId] as const,
}

/** Xếp hàng một lượt quét rủi ro (SOP-AI-005) cho project hiện tại. */
export function useRequestRiskAnalysis() {
  const client = useQueryClient()
  return useMutation({
    onSuccess: () => { void client.invalidateQueries({ queryKey: durableJobKeys.all }) },
    mutationFn: (projectId: number) => riskReportService.requestRiskAnalysis(projectId),
  })
}

/** Poll trạng thái job cho tới khi có kết quả cuối cùng — cùng pattern với
 * `useAIJob` (features/ai/hooks/useAIGenerator.ts): job AI chạy nền qua Celery
 * nên frontend không có cách nào khác để biết khi nào xong ngoài polling. */
export function useRiskAnalysisJob(jobId: string | null) {
  const { ownerId, ...options } = useJobPollingOptions(jobId !== null)
  const queryKey = [...riskAnalysisJobKeys.job(jobId ?? ''), ownerId]
  useCancelPausedJobQuery(queryKey, options.enabled)
  return useQuery({
    ...options,
    queryKey,
    queryFn: ({ signal }) => riskReportService.getJob(jobId!, signal),
  })
}
