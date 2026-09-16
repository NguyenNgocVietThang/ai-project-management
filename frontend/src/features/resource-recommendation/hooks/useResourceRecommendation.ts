'use client'

/** SOP-AI-004 / SOP-RM-001: mutation kich hoat job goi y nhan su + query poll
 * ket qua, phong theo pattern useAIJob trong features/ai/hooks/useAIGenerator.ts. */
import { useMutation, useQuery } from '@tanstack/react-query'
import { resourceRecommendationService } from '@/services/resource-recommendation.service'
import type { ResourceRecommendationJobStatus } from '@/types/resource-recommendation.types'

const IN_PROGRESS: ResourceRecommendationJobStatus[] = ['PENDING', 'PROCESSING']

export const resourceRecommendationJobKeys = {
  job: (jobId: string) => ['resource-recommendation', 'jobs', jobId] as const,
}

export function useRequestResourceRecommendation() {
  return useMutation({
    mutationFn: (taskId: number) => resourceRecommendationService.requestResourceRecommendation(taskId),
  })
}

export function useResourceRecommendationJob(jobId: string | null) {
  return useQuery({
    queryKey: resourceRecommendationJobKeys.job(jobId ?? ''),
    queryFn: () => resourceRecommendationService.getJob(jobId!),
    enabled: jobId !== null,
    // Job chay nen qua Celery mat vai giay - poll thay vi bat nguoi dung tu bam
    // refresh, nhung dung ngay khi da co ket qua cuoi cung (COMPLETED/FAILED).
    refetchInterval: (query) =>
      query.state.status === 'error'
        ? false
        : !query.state.data || IN_PROGRESS.includes(query.state.data.status)
          ? 2_000
          : false,
  })
}
