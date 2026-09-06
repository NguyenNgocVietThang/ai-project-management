'use client'

import { useEffect, useRef, useState } from 'react'
import { connectWebSocket, type WSClient } from '@/lib/ws-client'
import { authService } from '@/services/auth.service'
import { WS_BASE_URL } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import type { ChatMessage } from '../types/chat.types'

/** Mở một WebSocket trực tiếp cho kênh chat của một dự án. `onMessage` được gọi
 * cho mọi tin nhắn được broadcast trên kênh, bao gồm cả tin nhắn do chính client
 * này gửi (server không echo trực tiếp — xem backend api/ws/chat.py). */
export function useChatSocket(projectId: number, onMessage: (message: ChatMessage) => void) {
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage
  const clientRef = useRef<WSClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  // Xem ghi chú ở useNotificationSocket: phiên có thể chưa được khôi phục lúc mount.
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    if (!projectId || !accessToken) return

    const client = connectWebSocket({
      // Vé mới cho mỗi lần kết nối. Trước đây URL được tính một lần với access
      // token nhúng sẵn, nên sau khi token hết hạn socket quay vòng vô hạn với
      // một credential đã chết.
      buildUrl: async () => {
        if (!useAuthStore.getState().accessToken) return null
        const ticket = await authService.webSocketTicket()
        return `${WS_BASE_URL}/ws/chat/${projectId}?ticket=${encodeURIComponent(ticket)}`
      },
      onMessage: (data) => onMessageRef.current(data as ChatMessage),
      onOpen: () => setIsConnected(true),
      onClose: () => setIsConnected(false),
      onGiveUp: () => setIsConnected(false),
    })
    clientRef.current = client

    return () => {
      client.close()
      clientRef.current = null
      setIsConnected(false)
    }
  }, [projectId, accessToken])

  function sendMessage(content: string): boolean {
    if (!isConnected) return false
    clientRef.current?.send({ type: 'message', content })
    return true
  }

  return { sendMessage, isConnected }
}
