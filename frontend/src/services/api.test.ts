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

// The refresh boundary must not restore a cleared or replaced client session.
describe('refresh session races', () => {
  beforeEach(() => { vi.restoreAllMocks(); vi.resetModules() })
  it('restores overlapping cookie bootstraps with one refresh and two successful callers', async () => {
    const axios = (await import('axios')).default
    const create = axios.create.bind(axios)
    const completions: (() => void)[] = []
    vi.spyOn(axios, 'create').mockImplementation(config => {
      const client = create(config)
      client.defaults.adapter = request => new Promise(resolve => {
        completions.push(() => resolve({ data: { access_token: 'fixture-restored', token_type: 'bearer' }, status: 200, statusText: 'OK', headers: {}, config: request }))
      })
      return client
    })
    const { bootstrapSession } = await import('./api')
    const { useAuthStore } = await import('@/store/authStore')
    useAuthStore.getState().clear()
    expect(useAuthStore.getState().user).toBeNull()
    const first = bootstrapSession()
    const second = bootstrapSession()
    await vi.waitFor(() => expect(completions.length).toBeGreaterThan(0))
    completions.forEach(complete => complete())
    expect(await Promise.all([first, second])).toEqual([true, true])
    expect(completions).toHaveLength(1)
    expect(useAuthStore.getState().accessToken).toBe('fixture-restored')
  })

  it.each(['logout', 'account switch'])('rejects both pending bootstraps after %s and gives a replacement its own refresh', async boundary => {
    const axios = (await import('axios')).default
    const create = axios.create.bind(axios)
    const completions: ((token: string) => void)[] = []
    vi.spyOn(axios, 'create').mockImplementation(config => {
      const client = create(config)
      client.defaults.adapter = request => new Promise(resolve => {
        completions.push(token => resolve({ data: { access_token: token, token_type: 'bearer' }, status: 200, statusText: 'OK', headers: {}, config: request }))
      })
      return client
    })
    const { bootstrapSession } = await import('./api')
    const { useAuthStore, startAuthSession } = await import('@/store/authStore')
    useAuthStore.getState().clear()
    const previous = [bootstrapSession(), bootstrapSession()]
    await vi.waitFor(() => expect(completions).toHaveLength(1))
    useAuthStore.getState().clear()
    if (boundary === 'account switch') startAuthSession({ access_token: 'fixture-b', token_type: 'bearer' })
    const replacement = boundary === 'account switch' ? bootstrapSession() : null
    if (replacement) await vi.waitFor(() => expect(completions).toHaveLength(2))
    completions[0]('fixture-late-a')
    expect(await Promise.all(previous)).toEqual([false, false])
    expect(useAuthStore.getState().accessToken).toBe(boundary === 'logout' ? null : 'fixture-b')
    if (replacement) {
      // Settling A must not erase B's pending entry; another B caller joins B.
      const another = bootstrapSession()
      await Promise.resolve()
      expect(completions).toHaveLength(2)
      completions[1]('fixture-rotated-b')
      expect(await Promise.all([replacement, another])).toEqual([true, true])
      expect(useAuthStore.getState().accessToken).toBe('fixture-rotated-b')
    }
  })

  it.each(['logout', 'account switch'])('discards a refresh response after %s', async (boundary) => {
    const axios = (await import('axios')).default
    const create = axios.create.bind(axios)
    let complete!: () => void
    vi.spyOn(axios, 'create').mockImplementation((config) => {
      const client = create(config)
      client.defaults.adapter = request => new Promise(resolve => {
        complete = () => resolve({ data: { access_token: 'fixture-late', token_type: 'bearer' }, status: 200, statusText: 'OK', headers: {}, config: request })
      })
      return client
    })
    const { bootstrapSession } = await import('./api')
    const { useAuthStore } = await import('@/store/authStore')
    useAuthStore.getState().clear()
    const pending = bootstrapSession().catch(() => false)
    await vi.waitFor(() => expect(complete).toBeDefined())
    useAuthStore.getState().clear()
    if (boundary === 'account switch') useAuthStore.getState().setTokens({ access_token: 'fixture-next', token_type: 'bearer' })
    complete()
    expect(await pending).toBe(false)
    expect(useAuthStore.getState().accessToken).toBe(boundary === 'logout' ? null : 'fixture-next')
  })

  it('refreshes concurrent 401s once while retaining the same owner', async () => {
    const { default: axios, AxiosError } = await import('axios')
    const create = axios.create.bind(axios)
    let refreshes = 0
    let completeRefresh!: () => void
    vi.spyOn(axios, 'create').mockImplementation(config => {
      const client = create(config)
      client.defaults.adapter = async request => {
        if (request.url === '/auth/refresh') {
          refreshes += 1
          return new Promise(resolve => { completeRefresh = () => resolve({ data: { access_token: 'fixture-rotated', token_type: 'bearer' }, status: 200, statusText: 'OK', headers: {}, config: request }) })
        }
        if (request.headers.Authorization !== 'Bearer fixture-rotated') {
          throw new AxiosError('expired', 'ERR_BAD_RESPONSE', request, undefined, { data: {}, status: 401, statusText: '', headers: {}, config: request })
        }
        return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config: request }
      }
      return client
    })
    const { api } = await import('./api')
    const { useAuthStore } = await import('@/store/authStore')
    useAuthStore.getState().setTokens({ access_token: 'fixture-original', token_type: 'bearer' })
    const owner = { id: 1 } as import('@/types/auth.types').User
    useAuthStore.getState().setUser(owner)
    const sessionId = useAuthStore.getState().sessionId
    const first = api.get('/fixture/one')
    const second = api.get('/fixture/two')
    await vi.waitFor(() => expect(refreshes).toBe(1))
    completeRefresh()
    const responses = await Promise.all([first, second])
    expect(responses.map(response => response.data)).toEqual([{ ok: true }, { ok: true }])
    expect(refreshes).toBe(1)
    expect(useAuthStore.getState().sessionId).toBe(sessionId)
    expect(useAuthStore.getState().user).toEqual(owner)
  })

  it('shares the same-owner refresh between bootstrap and a 401 retry', async () => {
    const { default: axios, AxiosError } = await import('axios')
    const create = axios.create.bind(axios)
    const completions: (() => void)[] = []
    vi.spyOn(axios, 'create').mockImplementation(config => {
      const client = create(config)
      client.defaults.adapter = async request => {
        if (request.url === '/auth/refresh') return new Promise(resolve => {
          completions.push(() => resolve({ data: { access_token: 'fixture-rotated', token_type: 'bearer' }, status: 200, statusText: 'OK', headers: {}, config: request }))
        })
        if (request.headers.Authorization !== 'Bearer fixture-rotated') {
          throw new AxiosError('expired', 'ERR_BAD_RESPONSE', request, undefined, { data: {}, status: 401, statusText: '', headers: {}, config: request })
        }
        return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config: request }
      }
      return client
    })
    const { api, bootstrapSession } = await import('./api')
    const { useAuthStore } = await import('@/store/authStore')
    useAuthStore.getState().setTokens({ access_token: 'fixture-original', token_type: 'bearer' })
    const owner = { id: 1 } as import('@/types/auth.types').User
    useAuthStore.getState().setUser(owner)
    const sessionId = useAuthStore.getState().sessionId
    const request = api.get('/fixture/job')
    await vi.waitFor(() => expect(completions).toHaveLength(1))
    const bootstrap = bootstrapSession()
    completions.forEach(complete => complete())
    expect(await bootstrap).toBe(true)
    expect((await request).data).toEqual({ ok: true })
    expect(completions).toHaveLength(1)
    expect(useAuthStore.getState().sessionId).toBe(sessionId)
    expect(useAuthStore.getState().user).toEqual(owner)
  })


  it('does not send a queued authenticated retry in a replacement session', async () => {
    const axios = (await import('axios')).default
    const create = axios.create.bind(axios)
    let requests = 0
    vi.spyOn(axios, 'create').mockImplementation(config => {
      const client = create(config)
      client.defaults.adapter = async request => {
        requests += 1
        return { data: {}, status: 200, statusText: 'OK', headers: {}, config: request }
      }
      return client
    })
    const { api } = await import('./api')
    const { useAuthStore, startAuthSession } = await import('@/store/authStore')
    useAuthStore.getState().setTokens({ access_token: 'fixture-original', token_type: 'bearer' })
    const previousSession = useAuthStore.getState().sessionId
    startAuthSession({ access_token: 'fixture-next', token_type: 'bearer' })
    await expect(api.get('/fixture/retry', { _authSessionId: previousSession } as import('axios').AxiosRequestConfig)).rejects.toThrow('Session changed')
    expect(requests).toBe(0)
  })
})
