'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { durableJobKeys } from '@/features/jobs/hooks/useJobs'
import { isTerminalJob } from '@/features/jobs/hooks/jobPolling'
import { processService } from '@/features/process/process'
import type { ProcessLanguage } from '@/features/process/types'
import { jobsService } from '@/services/jobs.service'

export const processKeys = {
  all: ['process-model'] as const,
  latest: (projectId: number) => ['process-model', projectId, 'latest'] as const,
  job: (jobId: number) => ['process-model', 'job', jobId] as const,
}

/** Lỗi 404 nghĩa là dự án chưa có quy trình: không thử lại. */
export function isNotFound(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'response' in error
    && (error as { response?: { status?: number } }).response?.status === 404
}

export function useProcessModel(projectId: number) {
  return useQuery({
    queryKey: processKeys.latest(projectId),
    queryFn: () => processService.latest(projectId),
    enabled: Number.isFinite(projectId),
    retry: (count, error) => !isNotFound(error) && count < 2,
  })
}

export function useGenerateProcess(projectId: number) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: { language: ProcessLanguage }) => processService.generate(projectId, body),
    onSuccess: () => {
      // JobsPanel nhận job mới.
      void client.invalidateQueries({ queryKey: durableJobKeys.all })
    },
  })
}

/** Poll job sinh quy trình tới khi kết thúc; xong thì tải lại quy trình mới nhất. */
export function useProcessJob(projectId: number, jobId: number | null) {
  const client = useQueryClient()
  return useQuery({
    queryKey: processKeys.job(jobId ?? 0),
    queryFn: async ({ signal }) => {
      const job = await jobsService.get(jobId as number, signal)
      if (job.status === 'succeeded') void client.invalidateQueries({ queryKey: processKeys.latest(projectId) })
      return job
    },
    enabled: jobId !== null,
    refetchInterval: (query) => (isTerminalJob(query.state.data?.status) ? false : 3000),
  })
}
