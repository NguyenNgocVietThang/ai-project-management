'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import { getApiErrorMessage } from '@/types/api.types'
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
  const router = useRouter()
  const queryClient = useQueryClient()
  const { accessToken, refreshToken, user, setTokens, setUser, clear, isAuthenticated } =
    useAuthStore()

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.me,
    enabled: Boolean(accessToken) && !user,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: async (tokens) => {
      setTokens(tokens)
      const me = await authService.me()
      setUser(me)
      router.replace('/dashboard')
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
    onSuccess: async () => {
      const me = await authService.me()
      setUser(me)
      queryClient.setQueryData(['auth', 'me'], me)
    },
  })

  const register = async (credentials: RegisterCredentials) => {
    await registerMutation.mutateAsync(credentials)
    const tokens = await authService.login({
      email: credentials.email,
      password: credentials.password,
    })
    setTokens(tokens)
    const me = await authService.me()
    setUser(me)
    router.replace('/dashboard')
  }

  const logout = async () => {
    try {
      await authService.logout(refreshToken)
    } catch {
      // Cố gắng hết sức — việc xóa token phía client bên dưới mới là điều thực sự quan trọng.
    } finally {
      clear()
      queryClient.clear()
      router.replace('/login')
    }
  }

  return {
    user: user ?? meQuery.data ?? null,
    isAuthenticated: isAuthenticated(),
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error ? getApiErrorMessage(loginMutation.error, 'Invalid email or password.') : null,
    register,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error ? getApiErrorMessage(registerMutation.error, 'Registration failed. Email or username may already be taken.') : null,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isRequestingPasswordReset: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error
      ? getApiErrorMessage(forgotPasswordMutation.error)
      : null,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error
      ? getApiErrorMessage(resetPasswordMutation.error, 'Invalid or expired reset token.')
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
