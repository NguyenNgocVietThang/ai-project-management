import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import type { TokenResponse, User } from '@/types/auth.types'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  /** True once the persisted state has been read from localStorage on the client. */
  hasHydrated: boolean
  isAuthenticated: () => boolean
  setTokens: (tokens: TokenResponse) => void
  setUser: (user: User) => void
  clear: () => void
  setHasHydrated: (value: boolean) => void
}

const AUTH_COOKIE_KEY = 'auth-token'

/**
 * Global auth store. Exposed as a vanilla store (via `authStore.getState()`) so the
 * Axios interceptor in `services/api.ts` can read/write tokens outside of React.
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
        Cookies.set(AUTH_COOKIE_KEY, tokens.access_token, { expires: 7, path: '/', sameSite: 'lax' })
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        })
      },
      setUser: (user) => set({ user }),
      clear: () => {
        Cookies.remove(AUTH_COOKIE_KEY, { path: '/' })
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
          Cookies.set(AUTH_COOKIE_KEY, state.accessToken, { expires: 7, path: '/', sameSite: 'lax' })
        }
        state?.setHasHydrated(true)
      },
    }
  )
)

export const authStore = useAuthStore
