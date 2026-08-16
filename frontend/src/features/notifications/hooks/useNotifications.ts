import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '../services/notification.service'

export const NOTIFICATION_KEYS = {
  list: (params?: object) => ['notifications', params] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
}

/** Unread badge count – polled every 30 s */
export function useUnreadCount() {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount,
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 30_000,
    staleTime: 20_000,
  })
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
