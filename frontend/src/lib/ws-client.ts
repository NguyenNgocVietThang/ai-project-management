// Minimal reconnecting-WebSocket helper shared by the chat and notification
// real-time hooks (features/chat/hooks/useChatSocket.ts,
// features/notifications/hooks/useNotifications.ts). Not a general-purpose
// library — just enough to open one socket, retry with backoff on drop, and
// hand parsed JSON messages back to the caller.

export interface WSClientOptions {
  url: string
  onMessage: (data: unknown) => void
  onOpen?: () => void
  onClose?: () => void
}

export interface WSClient {
  send: (data: unknown) => void
  close: () => void
}

const MAX_RECONNECT_DELAY_MS = 15_000

export function connectWebSocket({ url, onMessage, onOpen, onClose }: WSClientOptions): WSClient {
  let socket: WebSocket | null = null
  let closedByCaller = false
  let attempt = 0
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null

  function scheduleReconnect() {
    if (closedByCaller) return
    const delay = Math.min(1000 * 2 ** attempt, MAX_RECONNECT_DELAY_MS)
    attempt += 1
    reconnectTimer = setTimeout(connect, delay)
  }

  function connect() {
    socket = new WebSocket(url)
    socket.onopen = () => {
      attempt = 0
      onOpen?.()
    }
    socket.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data))
      } catch {
        // Ignore malformed payloads rather than crashing the socket handler.
      }
    }
    socket.onclose = () => {
      onClose?.()
      scheduleReconnect()
    }
    socket.onerror = () => {
      socket?.close()
    }
  }

  connect()

  return {
    send: (data: unknown) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data))
      }
    },
    close: () => {
      closedByCaller = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      socket?.close()
    },
  }
}
