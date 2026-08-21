'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { connectWebSocket } from '@/lib/ws-client'
import { WS_BASE_URL } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { notificationService } from '../services/notification.service'
import type { UnreadCountResponse } from '../types/notification.types'

export const NOTIFICATION_KEYS = {
  list: (params?: object) => ['notifications', params] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
}

/** Unread badge count. Real-time push (useNotificationSocket) is the primary
 * update path; this poll is now just a safety net for reconnect gaps and
 * backgrounded tabs, so the interval is much longer than the old 30s. */
export function useUnreadCount() {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount,
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 120_000,
    staleTime: 60_000,
  })
}

/** Opens one WebSocket for the current user's notification channel and keeps
 * the unread-count cache + notification list in sync as pushes arrive. Mount
 * once at the dashboard shell level (see (dashboard)/layout.tsx), not per-page. */
export function useNotificationSocket() {
  const qc = useQueryClient()

  useEffect(() => {
    const token = useAuthStore.getState().accessToken
    if (!token) return

    const url = `${WS_BASE_URL}/ws/notifications?token=${encodeURIComponent(token)}`
    const client = connectWebSocket({
      url,
      onMessage: () => {
        qc.setQueryData<UnreadCountResponse>(NOTIFICATION_KEYS.unreadCount, (old) => ({
          unread_count: (old?.unread_count ?? 0) + 1,
        }))
        qc.invalidateQueries({ queryKey: ['notifications'] })
      },
    })

    return () => client.close()
  }, [qc])
}

/** Paginated notification list */
export function useNotifications(params?: {
  unread_only?: boolean
  page?: number
  page_size?: number
}) {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(params),
    queryFn: () => notificationService.list(params),
    staleTime: 15_000,
  })
}

/** Mark single notification as read */
export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/** Mark all as read */
export function useMarkAllRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/** Delete notification */
export function useDeleteNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: notificationService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
