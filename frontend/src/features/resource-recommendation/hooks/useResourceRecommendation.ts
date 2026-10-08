'use client'

/** SOP-AI-004 / SOP-RM-001: mutation kich hoat job goi y nhan su + query poll
 * ket qua, phong theo pattern useAIJob trong features/ai/hooks/useAIGenerator.ts. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { resourceRecommendationService } from '@/services/resource-recommendation.service'
import { useJobPollingOptions, useCancelPausedJobQuery } from '@/features/jobs/hooks/jobPolling'
import { durableJobKeys } from '@/features/jobs/hooks/useJobs'

export const resourceRecommendationJobKeys = {
  job: (jobId: string) => ['resource-recommendation', 'jobs', jobId] as const,
}

export function useRequestResourceRecommendation() {
  const client = useQueryClient()
  return useMutation({
    onSuccess: () => { void client.invalidateQueries({ queryKey: durableJobKeys.all }) },
    mutationFn: (taskId: number) => resourceRecommendationService.requestResourceRecommendation(taskId),
  })
}

export function useResourceRecommendationJob(jobId: string | null) {
  const { ownerId, ...options } = useJobPollingOptions(jobId !== null)
  const queryKey = [...resourceRecommendationJobKeys.job(jobId ?? ''), ownerId]
  useCancelPausedJobQuery(queryKey, options.enabled)
  return useQuery({
    ...options,
    queryKey,
    queryFn: ({ signal }) => resourceRecommendationService.getJob(jobId!, signal),
  })
}
