import { api } from '@/services/api'
import type {
  MarkReadResponse,
  NotificationItem,
  NotificationListResponse,
  UnreadCountResponse,
} from '../types/notification.types'

export const notificationService = {
  list: (params?: { unread_only?: boolean; page?: number; page_size?: number }) =>
    api
      .get<NotificationListResponse>('/notifications/', { params })
      .then((r) => r.data),

  getUnreadCount: () =>
    api.get<UnreadCountResponse>('/notifications/unread-count').then((r) => r.data),

  markRead: (id: number) =>
    api
      .patch<NotificationItem>(`/notifications/${id}/read`)
      .then((r) => r.data),

  markAllRead: () =>
    api.patch<MarkReadResponse>('/notifications/read-all').then((r) => r.data),

  delete: (id: number) => api.delete(`/notifications/${id}`),
}
