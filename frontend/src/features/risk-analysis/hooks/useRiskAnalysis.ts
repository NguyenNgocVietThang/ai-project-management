'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { riskReportService, type RiskAnalysisJobStatus } from '@/services/risk-report.service'

const IN_PROGRESS: RiskAnalysisJobStatus[] = ['PENDING', 'PROCESSING']

export const riskAnalysisJobKeys = {
  job: (jobId: string) => ['risk-analysis', 'jobs', jobId] as const,
}

/** Xếp hàng một lượt quét rủi ro (SOP-AI-005) cho project hiện tại. */
export function useRequestRiskAnalysis() {
  return useMutation({
    mutationFn: (projectId: number) => riskReportService.requestRiskAnalysis(projectId),
  })
}

/** Poll trạng thái job cho tới khi có kết quả cuối cùng — cùng pattern với
 * `useAIJob` (features/ai/hooks/useAIGenerator.ts): job AI chạy nền qua Celery
 * nên frontend không có cách nào khác để biết khi nào xong ngoài polling. */
export function useRiskAnalysisJob(jobId: string | null) {
  return useQuery({
    queryKey: riskAnalysisJobKeys.job(jobId ?? ''),
    queryFn: () => riskReportService.getJob(jobId!),
    enabled: jobId !== null,
    refetchInterval: (query) =>
      query.state.status === 'error'
        ? false
        : !query.state.data || IN_PROGRESS.includes(query.state.data.status)
          ? 2_000
          : false,
  })
}
