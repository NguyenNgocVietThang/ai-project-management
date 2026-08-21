'use client'

import { useEffect, useRef, useState } from 'react'
import { connectWebSocket, type WSClient } from '@/lib/ws-client'
import { WS_BASE_URL } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import type { ChatMessage } from '../types/chat.types'

/** Opens a live WebSocket for a project's chat channel. `onMessage` fires for
 * every message broadcast on the channel, including ones this client sent
 * itself (the server doesn't echo directly — see backend api/ws/chat.py). */
export function useChatSocket(projectId: number, onMessage: (message: ChatMessage) => void) {
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage
  const clientRef = useRef<WSClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token = useAuthStore.getState().accessToken
    if (!token || !projectId) return

    const url = `${WS_BASE_URL}/ws/chat/${projectId}?token=${encodeURIComponent(token)}`
    const client = connectWebSocket({
      url,
      onMessage: (data) => onMessageRef.current(data as ChatMessage),
      onOpen: () => setIsConnected(true),
      onClose: () => setIsConnected(false),
    })
    clientRef.current = client

    return () => {
      client.close()
      clientRef.current = null
      setIsConnected(false)
    }
  }, [projectId])

  function sendMessage(content: string): boolean {
    if (!isConnected) return false
    clientRef.current?.send({ type: 'message', content })
    return true
  }

  return { sendMessage, isConnected }
}
