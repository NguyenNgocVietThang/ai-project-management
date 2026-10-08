import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Interceptor refresh: một trang bắn nhiều query cùng lúc sẽ cùng nhận 401 khi
 * access token hết hạn. Nếu mỗi request tự gọi refresh, refresh token bị xoay
 * vòng nhiều lần song song và cơ chế phát hiện replay ở backend sẽ đăng xuất
 * người dùng — đúng lúc lẽ ra phiên phải được gia hạn êm thấm.
 */
describe('api client', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.resetModules()
  })

  it('gửi cookie kèm request cross-origin', async () => {
    const { api } = await import('./api')
    // Không có cờ này, trình duyệt bỏ qua cookie refresh httpOnly và cookie ràng
    // buộc luồng OAuth — frontend và API nằm ở origin khác nhau.
    expect(api.defaults.withCredentials).toBe(true)
  })

  it('đặt timeout để request không treo vô hạn', async () => {
    const { api } = await import('./api')
    expect(api.defaults.timeout).toBeGreaterThan(0)
  })

  it('đính kèm access token đang có trong bộ nhớ', async () => {
    const { api } = await import('./api')
    const { useAuthStore } = await import('@/store/authStore')
    useAuthStore.getState().setTokens({ access_token: 'abc123', token_type: 'bearer' })

    const handler = (api.interceptors.request as unknown as {
      handlers: { fulfilled: (c: unknown) => { headers: Record<string, string> } }[]
    }).handlers[0]
    const config = handler.fulfilled({ headers: {} })

    expect(config.headers.Authorization).toBe('Bearer abc123')
  })

  it('không đính kèm gì khi chưa đăng nhập', async () => {
    const { api } = await import('./api')
    const { useAuthStore } = await import('@/store/authStore')
    useAuthStore.getState().clear()

    const handler = (api.interceptors.request as unknown as {
      handlers: { fulfilled: (c: unknown) => { headers: Record<string, string> } }[]
    }).handlers[0]
    const config = handler.fulfilled({ headers: {} })

    expect(config.headers.Authorization).toBeUndefined()
  })

  it('gọi refresh mà không gửi refresh token trong body', async () => {
    const axios = (await import('axios')).default
    const create = axios.create.bind(axios)
    const requests: { url?: string; data?: unknown }[] = []
    vi.spyOn(axios, 'create').mockImplementation((config) => {
      const client = create(config)
      client.defaults.adapter = async (request) => {
        requests.push({ url: request.url, data: request.data })
        return { data: { access_token: 'new', token_type: 'bearer' }, status: 200, statusText: 'OK', headers: {}, config: request }
      }
      return client
    })
    const apiModule = await import('./api')
    await apiModule.bootstrapSession()
    expect(requests).toEqual([{ url: '/auth/refresh', data: undefined }])
    const { useAuthStore } = await import('@/store/authStore')
    expect('refreshToken' in useAuthStore.getState()).toBe(false)
  })

  it.each([401, 503])('bootstrap xử lý mã %s đúng với cookie phiên', async (status) => {
    const { default: axios, AxiosError } = await import('axios')
    const create = axios.create.bind(axios)
    vi.spyOn(axios, 'create').mockImplementation((config) => {
      const client = create(config)
      client.defaults.adapter = async (request) => {
        throw new AxiosError('unavailable', 'ERR_BAD_RESPONSE', request, undefined, { data: {}, status, statusText: '', headers: {}, config: request })
      }
      return client
    })
    const apiModule = await import('./api')
    const { useAuthStore } = await import('@/store/authStore')
    useAuthStore.getState().setTokens({ access_token: 'existing', token_type: 'bearer' })
    if (status === 401) {
      expect(await apiModule.bootstrapSession()).toBe(false)
      expect(useAuthStore.getState().accessToken).toBeNull()
    } else {
      await expect(apiModule.bootstrapSession()).rejects.toHaveProperty('response.status', 503)
      expect(useAuthStore.getState().accessToken).toBe('existing')
    }
  })
})
