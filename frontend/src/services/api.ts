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
const REQUEST_TIMEOUT_MS = 20_000

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  // Backend đặt cookie httpOnly (ràng buộc luồng OAuth, và refresh token) mà
  // trình duyệt sẽ bỏ qua trên request cross-origin nếu không có cờ này —
  // frontend và API nằm ở origin khác nhau cả khi phát triển lẫn khi triển khai.
  withCredentials: true,
})

/** Client trần cho chính lời gọi refresh — không bao giờ được đi qua các interceptor bên dưới. */
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: REQUEST_TIMEOUT_MS,
})

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
  // Không có body: refresh token nằm trong cookie httpOnly mà trình duyệt tự
  // đính kèm (withCredentials ở trên). Frontend không bao giờ nhìn thấy nó.
  const { data } = await refreshClient.post<AccessTokenResponse>('/auth/refresh')
  authStore.getState().setTokens(data)
  return data.access_token
}

/** Đổi cookie phiên lấy một access token mới lúc khởi động ứng dụng.
 *
 * Access token chỉ sống trong bộ nhớ, nên sau mỗi lần tải lại trang nó biến mất và
 * phải được lấy lại từ cookie refresh trước khi render bất cứ thứ gì cần xác thực.
 * Trả về false khi không có phiên hợp lệ — nơi gọi sẽ đưa người dùng tới trang đăng nhập. */
export async function bootstrapSession(): Promise<boolean> {
  try {
    await refreshAccessToken()
    return true
  } catch {
    authStore.getState().clear()
    return false
  }
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
          // Điều hướng thẳng thay vì router.replace: phiên đã chết, nên tải lại
          // hoàn toàn là điều mong muốn — nó dọn sạch mọi state còn sót trong bộ
          // nhớ. Giữ lại đường dẫn hiện tại để quay về sau khi đăng nhập lại.
          const from = encodeURIComponent(window.location.pathname + window.location.search)
          window.location.href = `/login?from=${from}`
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
