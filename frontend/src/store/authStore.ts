import { create } from 'zustand'
import Cookies from 'js-cookie'
import type { AccessTokenResponse, User } from '@/types/auth.types'

interface AuthState {
  /** Chỉ nằm trong bộ nhớ. Xem ghi chú về lưu trữ bên dưới. */
  accessToken: string | null
  user: User | null
  /** True khi lần bootstrap phiên lúc khởi động đã chạy xong (thành hay bại). */
  hasHydrated: boolean
  isAuthenticated: () => boolean
  setTokens: (tokens: AccessTokenResponse) => void
  setUser: (user: User) => void
  clear: () => void
  setHasHydrated: (value: boolean) => void
}

/** Cờ do server đặt, KHÔNG chứa bí mật — chỉ cho biết có phiên hay không.
 *  Next.js Edge Middleware đọc nó để quyết định hiển thị trang đăng nhập. */
const SESSION_FLAG_COOKIE = 'has-session'

/**
 * Auth store toàn cục. Được expose như một vanilla store (qua `authStore.getState()`) để
 * Axios interceptor trong `services/api.ts` có thể đọc/ghi token bên ngoài React.
 *
 * Lưu trữ: KHÔNG có gì được ghi xuống đĩa. Trước đây cả access lẫn refresh token
 * đều nằm trong `localStorage` (qua zustand `persist`) và access token còn được sao
 * vào một cookie mà JavaScript đọc được — nghĩa là bất kỳ lỗ hổng XSS nào cũng lấy
 * được một credential dùng được nhiều ngày. Giờ refresh token nằm trong cookie
 * httpOnly do backend đặt (app/core/auth_cookies.py) và access token chỉ sống trong
 * bộ nhớ; sau khi tải lại trang, `bootstrapSession()` đổi cookie đó lấy một access
 * token mới.
 */
export const useAuthStore = create<AuthState>()((set, get) => ({
  accessToken: null,
  user: null,
  hasHydrated: false,
  isAuthenticated: () => Boolean(get().accessToken),
  setTokens: (tokens) => set({ accessToken: tokens?.access_token ?? null }),
  setUser: (user) => set({ user }),
  clear: () => {
    // Cookie thật là httpOnly và chỉ server xoá được (qua /auth/logout). Cờ này
    // thì không, nên dọn nó ở đây để middleware không giữ người dùng ở trạng thái
    // "đã đăng nhập" sau một lần đăng xuất mà request tới server bị lỗi.
    Cookies.remove(SESSION_FLAG_COOKIE, { path: '/' })
    set({ accessToken: null, user: null })
  },
  setHasHydrated: (value) => set({ hasHydrated: value }),
}))

export const authStore = useAuthStore

export function hasSessionCookie(): boolean {
  return Cookies.get(SESSION_FLAG_COOKIE) === '1'
}
