import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { authStore } from '@/store/authStore'
import type { AccessTokenResponse } from '@/types/auth.types'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

/** Origin trần (vd "ws://localhost:8000") — các route WS được gắn ở gốc ứng dụng
 * dưới /ws, không phải dưới /api/v1, nên phía gọi tự nối thêm "/ws/...". */
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000'

/** API client chính được mọi service dùng. Tự động đính kèm access token. */
/** Không request nào được phép treo vô hạn. Nếu không có mốc này, một backend
 *  không phản hồi khiến giao diện kẹt ở spinner mãi mãi — không lỗi, không toast,
 *  không có gì để người dùng làm ngoài việc tải lại trang. */
const REQUEST_TIMEOUT_MS = 90_000 // Render Free cold start can take about a minute.

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  // Cookie httpOnly (OAuth, refresh token) bị trình duyệt bỏ qua ở request cross-origin nếu thiếu
  // cờ này; frontend và API khác origin.
  withCredentials: true,
})

/** Client trần cho chính lời gọi refresh — không bao giờ được đi qua các interceptor bên dưới. */
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: REQUEST_TIMEOUT_MS,
})

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean; _authSessionId?: number }

api.interceptors.request.use((config: RetriableConfig) => {
  const sessionId = authStore.getState().sessionId
  if (config._authSessionId !== undefined && config._authSessionId !== sessionId) {
    throw new Error('Session changed before request')
  }
  config._authSessionId = sessionId
  const token = authStore.getState().accessToken
  // Logout already captured the token whose server session must be revoked.
  if (token && config.headers && config.url !== '/auth/logout') {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Cookie bootstraps and 401 retries share one refresh for the current session.
// A replacement account starts its own refresh even while the previous one settles.
let refreshPromise: { sessionId: number; promise: Promise<string> } | null = null

function refreshAccessToken(): Promise<string> {
  const sessionId = authStore.getState().sessionId
  if (refreshPromise?.sessionId === sessionId) return refreshPromise.promise
  const pending = (async () => {
    // The browser sends the httpOnly refresh cookie; no credential body is needed.
    const { data } = await refreshClient.post<AccessTokenResponse>('/auth/refresh')
    if (authStore.getState().sessionId !== sessionId) throw new Error('Session changed during refresh')
    authStore.getState().setTokens(data)
    return data.access_token
  })().finally(() => {
    if (refreshPromise?.promise === pending) refreshPromise = null
  })
  refreshPromise = { sessionId, promise: pending }
  return pending
}

/** Đổi cookie phiên lấy một access token mới lúc khởi động ứng dụng.
 *
 * Access token chỉ sống trong bộ nhớ, nên sau mỗi lần tải lại trang nó biến mất và
 * phải được lấy lại từ cookie refresh trước khi render bất cứ thứ gì cần xác thực.
 * Trả về false khi không có phiên hợp lệ — nơi gọi sẽ đưa người dùng tới trang đăng nhập. */
export async function bootstrapSession(): Promise<boolean> {
  const sessionId = authStore.getState().sessionId
  try {
    await refreshAccessToken()
    return true
  } catch (error) {
    if (authStore.getState().sessionId !== sessionId) return false
    if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) {
      authStore.getState().clear()
      return false
    }
    // Sleep, network loss and database outages do not invalidate the cookie.
    throw error
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/refresh') || originalRequest?.url?.includes('/auth/logout')

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      const sessionId = authStore.getState().sessionId
      if (originalRequest._authSessionId !== undefined && originalRequest._authSessionId !== sessionId) return Promise.reject(error)
      originalRequest._retry = true
      try {
        const newAccessToken = await refreshAccessToken()
        if (authStore.getState().sessionId !== sessionId) throw new Error('Session changed before retry')
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        if (authStore.getState().sessionId !== sessionId) return Promise.reject(refreshError)
        if (!axios.isAxiosError(refreshError) || ![401, 403].includes(refreshError.response?.status ?? 0)) {
          return Promise.reject(refreshError)
        }
        authStore.getState().clear()
        if (typeof window !== 'undefined') {
          // Điều hướng thẳng thay vì router.replace để tải lại hoàn toàn và dọn state; giữ đường
          // dẫn hiện tại để quay lại sau khi đăng nhập.
          const from = encodeURIComponent(window.location.pathname + window.location.search)
          window.location.href = `/login?from=${from}`
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
