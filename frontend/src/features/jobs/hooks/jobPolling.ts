'use client'

import { useEffect, useState } from 'react'
import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'

interface PollState {
  data?: { status: string }
  error?: unknown
  errorUpdateCount?: number
}

export function isTerminalJob(status?: string): boolean {
  return ['COMPLETED', 'FAILED', 'succeeded', 'failed'].includes(status ?? '')
}

export function isAccessError(error: unknown): boolean {
  const status = (error as { response?: { status?: number } } | null)?.response?.status
  return status !== undefined && [401, 403, 404].includes(status)
}

export function jobPollingInterval(state: PollState): number | false {
  if (isAccessError(state.error)) return false
  if (state.error) return Math.min(30000, 5000 * 2 ** Math.min(Math.max((state.errorUpdateCount ?? 1) - 1, 0), 3))
  if (isTerminalJob(state.data?.status)) return false
  return 5000
}

function pageActive() {
  return typeof document !== 'undefined' && document.visibilityState === 'visible' && navigator.onLine
}

/** Disabling an observer stops its timer but does not cancel a running fetch. */
export function useCancelPausedJobQuery(queryKey: QueryKey, enabled: boolean) {
  const client = useQueryClient()
  const keyHash = JSON.stringify(queryKey)
  useEffect(() => {
    const key: QueryKey = JSON.parse(keyHash)
    if (!enabled) void client.cancelQueries({ queryKey: key, exact: true })
  }, [client, keyHash, enabled])
}

export function useJobPollingOptions(requested: boolean) {
  const ownerId = useAuthStore((state) => state.user?.id ?? null)
  const authenticated = useAuthStore((state) => Boolean(state.accessToken) && state.hasHydrated)
  const [active, setActive] = useState(pageActive)
  useEffect(() => {
    const update = () => setActive(pageActive())
    document.addEventListener('visibilitychange', update)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    update()
    return () => {
      document.removeEventListener('visibilitychange', update)
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])
  return {
    ownerId,
    enabled: requested && ownerId !== null && authenticated && active,
    retry: false as const,
    staleTime: 0,
    refetchIntervalInBackground: false,
    refetchInterval: (query: { state: PollState }) => active ? jobPollingInterval(query.state) : false,
    refetchOnWindowFocus: (query: { state: PollState }) => !isTerminalJob(query.state.data?.status) && !isAccessError(query.state.error),
    refetchOnReconnect: (query: { state: PollState }) => !isTerminalJob(query.state.data?.status) && !isAccessError(query.state.error),
  }
}
