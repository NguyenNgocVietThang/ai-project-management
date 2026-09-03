// Service API Notification – Phase 3.3
import { api } from './api'
import type {
  MarkReadResponse,
  NotificationListParams,
  NotificationListResponse,
  NotificationResponse,
  UnreadCountResponse,
} from '@/types/notification.types'

export const notificationService = {
  /** GET /notifications/ – danh sách phân trang */
  getNotifications(params: NotificationListParams = {}): Promise<NotificationListResponse> {
    return api
      .get<NotificationListResponse>('/notifications/', { params })
      .then((r) => r.data)
  },

  /** GET /notifications/unread-count – chỉ lấy số đếm cho badge */
  getUnreadCount(): Promise<UnreadCountResponse> {
    return api.get<UnreadCountResponse>('/notifications/unread-count').then((r) => r.data)
  },

  /** PATCH /notifications/{id}/read */
  markRead(notificationId: number): Promise<NotificationResponse> {
    return api
      .patch<NotificationResponse>(`/notifications/${notificationId}/read`)
      .then((r) => r.data)
  },

  /** PATCH /notifications/read-all */
  markAllRead(): Promise<MarkReadResponse> {
    return api.patch<MarkReadResponse>('/notifications/read-all').then((r) => r.data)
  },

  /** DELETE /notifications/{id} */
  deleteNotification(notificationId: number): Promise<void> {
    return api.delete(`/notifications/${notificationId}`).then(() => undefined)
  },
}
