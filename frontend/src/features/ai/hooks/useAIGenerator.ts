'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { aiService } from '@/services/ai.service'
import { useJobPollingOptions, useCancelPausedJobQuery } from '@/features/jobs/hooks/jobPolling'
import { durableJobKeys } from '@/features/jobs/hooks/useJobs'

export const aiJobKeys = {
  job: (jobId: string) => ['ai', 'jobs', jobId] as const,
}

export function useGenerateProject() {
  const client = useQueryClient()
  return useMutation({ mutationFn: (prompt: string) => aiService.generateProject(prompt),
    onSuccess: () => { void client.invalidateQueries({ queryKey: durableJobKeys.all }) },
  })
}

export function useAIJob(jobId: string | null) {
  const { ownerId, ...options } = useJobPollingOptions(jobId !== null)
  const queryKey = [...aiJobKeys.job(jobId ?? ''), ownerId]
  useCancelPausedJobQuery(queryKey, options.enabled)
  return useQuery({
    ...options,
    queryKey,
    queryFn: ({ signal }) => aiService.getJob(jobId!, signal),
  })
}
