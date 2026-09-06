// Helper WebSocket tự kết nối lại, dùng chung bởi các hook real-time của chat và
// notification (features/chat/hooks/useChatSocket.ts,
// features/notifications/hooks/useNotifications.ts).
//
// Ba điểm khác biệt so với một wrapper reconnect ngây thơ, mỗi điểm sửa một lỗi thật:
//
//   * URL được dựng lại trước MỖI lần kết nối, không phải một lần lúc mount. Handshake
//     cần một vé dùng một lần (xem backend app/core/ws_tickets.py) và vé cũ đã chết.
//     Bản trước giữ nguyên URL đầu tiên, nên khi access token hết hạn, mọi lần thử
//     lại đều bị từ chối và client quay vòng mãi mãi.
//   * Backoff có jitter. Không có nó, mọi tab của mọi người dùng thức dậy cùng lúc
//     sau một sự cố và cùng đập vào server (thundering herd).
//   * Số lần thử có giới hạn. Bản trước thử lại vô hạn, kể cả khi server từ chối
//     bằng 4401 — biến một lỗi xác thực thành bão request 4 lần/phút vĩnh viễn.

export interface WSClientOptions {
  /** Được gọi trước mỗi lần kết nối. Trả về null để bỏ cuộc (vd không còn phiên). */
  buildUrl: () => Promise<string | null>
  onMessage: (data: unknown) => void
  onOpen?: () => void
  onClose?: () => void
  /** Được gọi khi client bỏ cuộc hoàn toàn, để giao diện có thể mời thử lại thủ công. */
  onGiveUp?: () => void
}

export interface WSClient {
  send: (data: unknown) => void
  close: () => void
}

const MAX_RECONNECT_DELAY_MS = 15_000
const MAX_RECONNECT_ATTEMPTS = 8
/** Code đóng do server đặt khi kết nối không còn được phép. Thử lại là vô ích. */
const UNAUTHORIZED_CLOSE_CODE = 4401

export function connectWebSocket({
  buildUrl,
  onMessage,
  onOpen,
  onClose,
  onGiveUp,
}: WSClientOptions): WSClient {
  let socket: WebSocket | null = null
  let closedByCaller = false
  let attempt = 0
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null

  function scheduleReconnect() {
    if (closedByCaller) return
    if (attempt >= MAX_RECONNECT_ATTEMPTS) {
      onGiveUp?.()
      return
    }
    const ceiling = Math.min(1000 * 2 ** attempt, MAX_RECONNECT_DELAY_MS)
    // Jitter toàn phần: rải các lần thử ra thay vì đồng bộ hoá chúng.
    const delay = Math.random() * ceiling
    attempt += 1
    reconnectTimer = setTimeout(() => void connect(), delay)
  }

  async function connect() {
    if (closedByCaller) return
    let url: string | null
    try {
      url = await buildUrl()
    } catch {
      scheduleReconnect()
      return
    }
    if (!url || closedByCaller) {
      if (!url) onGiveUp?.()
      return
    }

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
    socket.onclose = (event) => {
      onClose?.()
      if (event.code === UNAUTHORIZED_CLOSE_CODE) {
        // Server đã nói rõ là không được phép. Thử lại chỉ tạo ra tiếng ồn.
        onGiveUp?.()
        return
      }
      scheduleReconnect()
    }
    socket.onerror = () => {
      socket?.close()
    }
  }

  void connect()

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
