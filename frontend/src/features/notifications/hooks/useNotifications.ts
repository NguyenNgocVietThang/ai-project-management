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

/** Số lượng badge chưa đọc. Real-time push (useNotificationSocket) là đường
 * cập nhật chính; poll này giờ chỉ là lưới an toàn cho các khoảng mất kết nối
 * và tab chạy nền, nên interval dài hơn nhiều so với mức 30s cũ. */
export function useUnreadCount() {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount,
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 120_000,
    staleTime: 60_000,
  })
}

/** Mở một WebSocket cho kênh thông báo của người dùng hiện tại và giữ cache
 * số lượng chưa đọc + danh sách thông báo đồng bộ khi có push đến. Mount một
 * lần ở cấp shell của dashboard (xem (dashboard)/layout.tsx), không phải mỗi trang. */
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

/** Danh sách thông báo phân trang */
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

/** Đánh dấu một thông báo là đã đọc */
export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/** Đánh dấu tất cả là đã đọc */
export function useMarkAllRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/** Xóa thông báo */
export function useDeleteNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: notificationService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
