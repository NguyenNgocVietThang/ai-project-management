'use client'

import { useQuery } from '@tanstack/react-query'
import { jobsService } from '@/services/jobs.service'
import { isAccessError, jobPollingInterval, useJobPollingOptions, useCancelPausedJobQuery } from './jobPolling'

export const durableJobKeys = {
  all: ['durable-jobs'] as const,
  list: (ownerId: number | null) => ['durable-jobs', ownerId, 'list'] as const,
}

export function useJobs() {
  const { ownerId, ...options } = useJobPollingOptions(true)
  const queryKey = durableJobKeys.list(ownerId)
  useCancelPausedJobQuery(queryKey, options.enabled)
  return useQuery({
    ...options,
    queryKey,
    queryFn: ({ signal }) => jobsService.list(signal),
    // Discover fresh work on mutation invalidation, focus or reconnect. Stop
    // polling once all loaded work is terminal rather than keeping a host awake.
    refetchInterval: (query) => {
      if (!options.enabled || isAccessError(query.state.error)) return false
      if (query.state.error) return jobPollingInterval({ error: query.state.error, errorUpdateCount: query.state.errorUpdateCount })
      return query.state.data?.some(job => ['queued', 'running'].includes(job.status)) ? 5000 : false
    },
    refetchOnWindowFocus: (query) => !isAccessError(query.state.error),
    refetchOnReconnect: (query) => !isAccessError(query.state.error),
  })
}
