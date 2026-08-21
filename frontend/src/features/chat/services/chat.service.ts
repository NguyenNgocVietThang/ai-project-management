import { api } from '@/services/api'
import type { ChatHistoryResponse, ChatMessage, ChatUnreadResponse } from '../types/chat.types'

export const chatService = {
  getHistory: (projectId: number, beforeId?: number) =>
    api
      .get<ChatHistoryResponse>(`/projects/${projectId}/messages`, {
        params: beforeId ? { before_id: beforeId } : undefined,
      })
      .then((r) => r.data),

  postMessage: (projectId: number, content: string) =>
    api
      .post<ChatMessage>(`/projects/${projectId}/messages`, { content })
      .then((r) => r.data),

  getUnreadCount: (projectId: number) =>
    api.get<ChatUnreadResponse>(`/projects/${projectId}/unread-count`).then((r) => r.data),

  markRead: (projectId: number, messageId?: number) =>
    api
      .post<ChatUnreadResponse>(`/projects/${projectId}/read`, { message_id: messageId ?? null })
      .then((r) => r.data),
}
