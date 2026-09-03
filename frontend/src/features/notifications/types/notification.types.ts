// Kiểu dữ liệu Notification – phản chiếu backend schemas/notification.py

export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'TASK_DUE_SOON'
  | 'TASK_OVERDUE'
  | 'CR_SUBMITTED'
  | 'CR_APPROVED'
  | 'CR_REJECTED'
  | 'CR_NEEDS_REVIEW'
  | 'CRITICAL_PATH_CHANGED'
  | 'RESOURCE_OVERLOADED'
  | 'AI_JOB_COMPLETED'
  | 'RISK_HIGH'
  | 'MENTION'
  | 'SYSTEM'

export interface NotificationItem {
  id: number
  title: string
  message: string
  notification_type: NotificationType
  is_read: boolean
  read_at: string | null
  link: string | null
  related_entity_type: string | null
  related_entity_id: number | null
  created_at: string
}

export interface NotificationListResponse {
  items: NotificationItem[]
  total: number
  unread_count: number
  page: number
  page_size: number
  total_pages: number
}

export interface UnreadCountResponse {
  unread_count: number
}

export interface MarkReadResponse {
  updated: number
  unread_count: number
}
