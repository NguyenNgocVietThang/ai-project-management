import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { authStore } from '@/store/authStore'
import type { TokenResponse } from '@/types/auth.types'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

/** Origin trần (vd "ws://localhost:8000") — các route WS được gắn ở gốc ứng dụng
 * dưới /ws, không phải dưới /api/v1, nên phía gọi tự nối thêm "/ws/...". */
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000'

/** API client chính được mọi service dùng. Tự động đính kèm access token. */
export const api = axios.create({
  baseURL: API_BASE_URL,
})

/** Client trần cho chính lời gọi refresh — không bao giờ được đi qua các interceptor bên dưới. */
const refreshClient = axios.create({ baseURL: API_BASE_URL })

api.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

// Nhiều request có thể cùng bị 401 một lúc (vd một trang bắn nhiều query sau khi access
// token hết hạn). Chỉ request đầu tiên kích hoạt refresh; các request còn lại chờ trên promise dùng chung này.
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = authStore.getState().refreshToken
  if (!refreshToken) throw new Error('No refresh token available')

  const { data } = await refreshClient.post<TokenResponse>('/auth/refresh', {
    refresh_token: refreshToken,
  })
  authStore.getState().setTokens(data)
  return data.access_token
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/refresh')

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null
        })
        const newAccessToken = await refreshPromise
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        authStore.getState().clear()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
