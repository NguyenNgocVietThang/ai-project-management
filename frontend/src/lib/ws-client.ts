// Helper WebSocket tự kết nối lại tối giản, dùng chung bởi các hook real-time
// của chat và notification (features/chat/hooks/useChatSocket.ts,
// features/notifications/hooks/useNotifications.ts). Không phải thư viện đa dụng
// — chỉ đủ để mở một socket, retry với backoff khi rớt kết nối, và trả các
// message JSON đã parse về cho phía gọi.

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
        // Bỏ qua payload sai định dạng thay vì làm sập handler của socket.
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
