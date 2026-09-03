// Các type Notification – Phase 3.3
// Phản chiếu backend/app/schemas/notification.py và app/models/notification.py

export type NotificationType =
  | 'task_assigned'
  | 'task_status_changed'
  | 'task_overdue'
  | 'task_comment'
  | 'project_member_invited'
  | 'project_member_removed'
  | 'milestone_completed'
  | 'milestone_overdue'
  | 'sprint_started'
  | 'sprint_completed'
  | 'worklog_submitted'
  | 'mention'
  | 'system'

export interface NotificationResponse {
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
  items: NotificationResponse[]
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

export interface NotificationListParams {
  unread_only?: boolean
  page?: number
  page_size?: number
}
