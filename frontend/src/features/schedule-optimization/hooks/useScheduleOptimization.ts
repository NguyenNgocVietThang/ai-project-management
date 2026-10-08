'use client'

// SOP-AI-003: poll job chạy nền bằng refetchInterval, cùng mẫu với
// features/ai/hooks/useAIGenerator.ts.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { scheduleOptimizationService } from '@/services/schedule-optimization.service'
import { useJobPollingOptions, useCancelPausedJobQuery } from '@/features/jobs/hooks/jobPolling'
import { durableJobKeys } from '@/features/jobs/hooks/useJobs'

export const scheduleOptimizationJobKeys = {
  job: (jobId: string) => ['schedule-optimization', 'jobs', jobId] as const,
}

export function useOptimizeSchedule() {
  const client = useQueryClient()
  return useMutation({
    onSuccess: () => { void client.invalidateQueries({ queryKey: durableJobKeys.all }) },
    mutationFn: ({ projectId, constraints }: { projectId: number; constraints?: Record<string, unknown> }) =>
      scheduleOptimizationService.requestScheduleOptimization(projectId, constraints),
  })
}

export function useScheduleOptimizationJob(jobId: string | null) {
  const { ownerId, ...options } = useJobPollingOptions(jobId !== null)
  const queryKey = [...scheduleOptimizationJobKeys.job(jobId ?? ''), ownerId]
  useCancelPausedJobQuery(queryKey, options.enabled)
  return useQuery({
    ...options,
    queryKey,
    queryFn: ({ signal }) => scheduleOptimizationService.getJob(jobId!, signal),
  })
}
