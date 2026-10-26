'use client'

import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { startAuthSession, useAuthStore } from '@/store/authStore'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'
import type {
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
} from '@/types/auth.types'

/**
 * Điểm vào luồng auth cho các component: login, register, logout, và hồ sơ người dùng hiện tại.
 * Việc lưu trữ/refresh token nằm ở `store/authStore.ts` + `services/api.ts`.
 */
export function useAuth() {
  const getApiErrorMessage = useApiErrorMessage()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { accessToken, user, sessionId, tokenVersion, setUser, clear, isAuthenticated } = useAuthStore()

  const meQuery = useQuery({
    queryKey: ['auth', 'me', sessionId, tokenVersion],
    queryFn: async () => {
      const me = await authService.me()
      const current = useAuthStore.getState()
      if (!current.accessToken || current.sessionId !== sessionId || current.tokenVersion !== tokenVersion) {
        throw new Error('Session changed while loading profile')
      }
      return me
    },
    enabled: Boolean(accessToken) && !user,
    retry: false,
  })

  useEffect(() => {
    const current = useAuthStore.getState()
    if (current.sessionId !== sessionId || current.tokenVersion !== tokenVersion) return
    queryClient.removeQueries({
      queryKey: ['auth', 'me'],
      predicate: query => query.queryKey[2] !== sessionId || query.queryKey[3] !== tokenVersion,
    })
    if (accessToken && meQuery.data && !meQuery.isError) setUser(meQuery.data)
  }, [accessToken, sessionId, tokenVersion, meQuery.data, meQuery.isError, queryClient, setUser])

  const sessionIsCurrent = (expected: number) => {
    const current = useAuthStore.getState()
    return Boolean(current.accessToken) && current.sessionId === expected
  }

  const loadCurrentProfile = async (expected: number) => {
    if (!sessionIsCurrent(expected)) return false
    const me = await authService.me()
    if (!sessionIsCurrent(expected)) return false
    setUser(me)
    const current = useAuthStore.getState()
    queryClient.setQueryData(['auth', 'me', current.sessionId, current.tokenVersion], me)
    return true
  }

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onMutate: () => ({ sessionId: useAuthStore.getState().sessionId }),
    onSuccess: async (tokens, _credentials, context) => {
      if (useAuthStore.getState().sessionId !== context?.sessionId) return
      const nextSession = startAuthSession(tokens)
      if (await loadCurrentProfile(nextSession)) router.replace('/dashboard')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authService.register(credentials),
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  })

  const resetPasswordMutation = useMutation({
    mutationFn: (credentials: ResetPasswordRequest) => authService.resetPassword(credentials),
    onSuccess: () => {
      router.replace('/login?reset=success')
    },
  })

  const resendEmailVerificationMutation = useMutation({
    mutationFn: authService.resendEmailVerification,
    onMutate: () => ({ sessionId: useAuthStore.getState().sessionId }),
    onSuccess: async (_message, _variables, context) => {
      if (context) await loadCurrentProfile(context.sessionId)
    },
  })

  const register = async (credentials: RegisterCredentials) => {
    const previousSession = useAuthStore.getState().sessionId
    await registerMutation.mutateAsync(credentials)
    if (useAuthStore.getState().sessionId !== previousSession) return
    const tokens = await authService.login({
      email: credentials.email,
      password: credentials.password,
    })
    if (useAuthStore.getState().sessionId !== previousSession) return
    const nextSession = startAuthSession(tokens)
    if (await loadCurrentProfile(nextSession)) router.replace('/dashboard')
  }

  const logout = async () => {
    const request = authService.logout()
    clear()
    const clearedSession = useAuthStore.getState().sessionId
    queryClient.clear()
    try {
      // Không truyền token: server đọc cookie httpOnly và thu hồi cả hai đầu.
      await request
    } catch {
      // Cố gắng hết sức — việc xóa token phía client bên dưới mới là điều thực sự quan trọng.
    } finally {
      if (useAuthStore.getState().sessionId === clearedSession) router.replace('/login')
    }
  }

  return {
    user: accessToken ? user : null,
    isAuthenticated: isAuthenticated(),
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error ? getApiErrorMessage(loginMutation.error) : null,
    register,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error ? getApiErrorMessage(registerMutation.error) : null,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isRequestingPasswordReset: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error
      ? getApiErrorMessage(forgotPasswordMutation.error)
      : null,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error
      ? getApiErrorMessage(resetPasswordMutation.error)
      : null,
    resendEmailVerification: resendEmailVerificationMutation.mutateAsync,
    isResendingEmailVerification: resendEmailVerificationMutation.isPending,
    resendEmailVerificationMessage: resendEmailVerificationMutation.data?.message ?? null,
    resendEmailVerificationError: resendEmailVerificationMutation.error
      ? getApiErrorMessage(resendEmailVerificationMutation.error)
      : null,
    logout,
  }
}
