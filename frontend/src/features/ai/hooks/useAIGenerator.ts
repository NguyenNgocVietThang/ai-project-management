'use client'

import { useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { aiService } from '@/services/ai.service'
import { useJobPollingState, jobPollingOptions, canReadOwnerJob, useCancelPausedJobQuery } from '@/features/jobs/hooks/jobPolling'
import { useAuthStore } from '@/store/authStore'
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
  const polling = useJobPollingState()
  const sessionId = useAuthStore(state => state.sessionId)
  const scope = useRef({ jobId, ownerId: polling.ownerId, sessionId })
  if (scope.current.jobId !== jobId || (scope.current.ownerId === null && polling.ownerId !== null)) {
    scope.current = { jobId, ownerId: polling.ownerId, sessionId }
  }
  const ownsJob = scope.current.ownerId === polling.ownerId && scope.current.sessionId === sessionId
  const { ownerId, ...options } = jobPollingOptions(jobId !== null && ownsJob, polling)
  const queryKey = [...aiJobKeys.job(jobId ?? ''), ownerId, sessionId]
  useCancelPausedJobQuery(queryKey, options.enabled)
  const query = useQuery({
    ...options,
    queryKey,
    queryFn: ({ signal }) => {
      if (!ownsJob || !canReadOwnerJob(ownerId, sessionId)) throw new Error('Job session is no longer active')
      return aiService.getJob(jobId!, signal)
    },
  })
  return {
    ...query,
    data: ownsJob ? query.data : undefined,
    pollingState: ownsJob ? polling.reason : 'session',
    refetch: (...args: Parameters<typeof query.refetch>) => ownsJob && canReadOwnerJob(ownerId, sessionId) && jobId
      ? query.refetch(...args) : Promise.resolve(query),
  }
}
