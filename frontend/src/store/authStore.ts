import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import type { TokenResponse, User } from '@/types/auth.types'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  /** True khi state đã lưu được đọc từ localStorage ở phía client. */
  hasHydrated: boolean
  isAuthenticated: () => boolean
  setTokens: (tokens: TokenResponse) => void
  setUser: (user: User) => void
  clear: () => void
  setHasHydrated: (value: boolean) => void
}

const AUTH_COOKIE_KEY = 'auth-token'

/** Các thuộc tính cookie dùng chung cho mọi lần ghi cookie auth.
 *
 * `secure` được suy ra từ scheme hiện tại thay vì hardcode để cookie vẫn được
 * set qua http://localhost thuần trong lúc phát triển, nhưng không bao giờ rời
 * trình duyệt ở dạng cleartext khi ứng dụng chạy qua HTTPS. Nó cố ý vẫn đọc được
 * bằng JS — Next.js Edge Middleware đọc nó cho route guard và các request
 * <img src> tới endpoint avatar phụ thuộc vào nó. */
function authCookieOptions() {
  return {
    expires: 7,
    path: '/',
    sameSite: 'lax' as const,
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
  }
}

/**
 * Auth store toàn cục. Được expose như một vanilla store (qua `authStore.getState()`) để
 * Axios interceptor trong `services/api.ts` có thể đọc/ghi token bên ngoài React.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hasHydrated: false,
      isAuthenticated: () => Boolean(get().accessToken),
      setTokens: (tokens) => {
        if (tokens?.access_token) {
          Cookies.set(AUTH_COOKIE_KEY, tokens.access_token, authCookieOptions())
        }
        set({
          accessToken: tokens?.access_token ?? null,
          refreshToken: tokens?.refresh_token ?? null,
        })
      },
      setUser: (user) => set({ user }),
      clear: () => {
        Cookies.remove(AUTH_COOKIE_KEY, { path: '/' })
        Cookies.remove(AUTH_COOKIE_KEY)
        set({ accessToken: null, refreshToken: null, user: null })
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          Cookies.set(AUTH_COOKIE_KEY, state.accessToken, authCookieOptions())
        } else {
          Cookies.remove(AUTH_COOKIE_KEY, { path: '/' })
          Cookies.remove(AUTH_COOKIE_KEY)
        }
        useAuthStore.setState({ hasHydrated: true })
      },
    }
  )
)

export const authStore = useAuthStore
