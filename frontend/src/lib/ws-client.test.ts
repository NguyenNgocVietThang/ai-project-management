import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { connectWebSocket } from './ws-client'

/**
 * Client WebSocket từng thử lại vô hạn với một URL được tính đúng một lần lúc
 * mount. Khi access token hết hạn, mọi lần thử đều bị từ chối và vòng lặp chạy
 * mãi mãi — 4 request mỗi phút, vĩnh viễn, cho mỗi tab đang mở.
 */

class FakeSocket {
  static instances: FakeSocket[] = []
  onopen: (() => void) | null = null
  onclose: ((event: { code: number }) => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  onerror: (() => void) | null = null
  readyState = 1
  sent: string[] = []

  constructor(public url: string) {
    FakeSocket.instances.push(this)
  }

  send(data: string) {
    this.sent.push(data)
  }

  close() {
    this.onclose?.({ code: 1000 })
  }
}

beforeEach(() => {
  FakeSocket.instances = []
  vi.stubGlobal('WebSocket', FakeSocket as unknown as typeof WebSocket)
  vi.useFakeTimers()
  // Backoff có jitter ngẫu nhiên; cố định để test tất định.
  vi.spyOn(Math, 'random').mockReturnValue(1)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

async function flush() {
  await vi.advanceTimersByTimeAsync(0)
}

describe('connectWebSocket', () => {
  it('dựng URL mới cho mỗi lần kết nối', async () => {
    let ticket = 0
    const client = connectWebSocket({
      buildUrl: async () => `ws://test/socket?ticket=${++ticket}`,
      onMessage: () => {},
    })
    await flush()
    expect(FakeSocket.instances[0].url).toBe('ws://test/socket?ticket=1')

    FakeSocket.instances[0].onclose?.({ code: 1006 })
    await vi.advanceTimersByTimeAsync(2000)

    // Vé chỉ dùng được một lần; kết nối lại bằng URL cũ sẽ luôn bị từ chối.
    expect(FakeSocket.instances[1].url).toBe('ws://test/socket?ticket=2')
    client.close()
  })

  it('không thử lại khi server nói không được phép', async () => {
    const onGiveUp = vi.fn()
    connectWebSocket({
      buildUrl: async () => 'ws://test/socket',
      onMessage: () => {},
      onGiveUp,
    })
    await flush()

    FakeSocket.instances[0].onclose?.({ code: 4401 })
    await vi.advanceTimersByTimeAsync(60_000)

    expect(FakeSocket.instances).toHaveLength(1)
    expect(onGiveUp).toHaveBeenCalled()
  })

  it('bỏ cuộc sau một số lần thử có giới hạn', async () => {
    const onGiveUp = vi.fn()
    connectWebSocket({
      buildUrl: async () => 'ws://test/socket',
      onMessage: () => {},
      onGiveUp,
    })
    await flush()

    for (let i = 0; i < 20; i += 1) {
      FakeSocket.instances[FakeSocket.instances.length - 1]?.onclose?.({ code: 1006 })
      await vi.advanceTimersByTimeAsync(30_000)
    }

    expect(onGiveUp).toHaveBeenCalled()
    expect(FakeSocket.instances.length).toBeLessThanOrEqual(9)
  })

  it('dừng hẳn khi phía gọi đóng socket', async () => {
    const client = connectWebSocket({
      buildUrl: async () => 'ws://test/socket',
      onMessage: () => {},
    })
    await flush()
    client.close()

    FakeSocket.instances[0].onclose?.({ code: 1006 })
    await vi.advanceTimersByTimeAsync(60_000)

    expect(FakeSocket.instances).toHaveLength(1)
  })

  it('bỏ qua payload sai định dạng thay vì làm sập handler', async () => {
    const onMessage = vi.fn()
    connectWebSocket({ buildUrl: async () => 'ws://test/socket', onMessage })
    await flush()

    expect(() => FakeSocket.instances[0].onmessage?.({ data: 'not json' })).not.toThrow()
    FakeSocket.instances[0].onmessage?.({ data: '{"ok":true}' })

    expect(onMessage).toHaveBeenCalledTimes(1)
    expect(onMessage).toHaveBeenCalledWith({ ok: true })
  })

  it('không kết nối khi không dựng được URL', async () => {
    const onGiveUp = vi.fn()
    connectWebSocket({ buildUrl: async () => null, onMessage: () => {}, onGiveUp })
    await flush()

    expect(FakeSocket.instances).toHaveLength(0)
    expect(onGiveUp).toHaveBeenCalled()
  })
})
