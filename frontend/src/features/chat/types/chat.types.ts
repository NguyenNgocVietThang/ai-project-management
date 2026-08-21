// Chat types – mirrors backend schemas/chat.py

export interface ChatMessage {
  id: number
  project_id: number
  user_id: number
  user_name: string
  user_avatar_url: string | null
  content: string
  created_at: string
}

export interface ChatHistoryResponse {
  items: ChatMessage[]
  next_before_id: number | null
  has_more: boolean
}

export interface ChatUnreadResponse {
  unread_count: number
  last_read_message_id: number | null
}
