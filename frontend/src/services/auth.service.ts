import { api } from '@/services/api'
import type {
  AuthMessageResponse,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
  TokenResponse,
  User,
} from '@/types/auth.types'

export const authService = {
  async register(credentials: RegisterCredentials): Promise<User> {
    const { data } = await api.post<User>('/auth/register', credentials)
    return data
  },

  /**
   * Backend `/auth/login` is an OAuth2PasswordRequestForm endpoint — it expects
   * application/x-www-form-urlencoded with a `username` field (the email) and `password`,
   * not JSON.
   */
  async login({ email, password }: LoginCredentials): Promise<TokenResponse> {
    const body = new URLSearchParams()
    body.set('username', email)
    body.set('password', password)

    const { data } = await api.post<TokenResponse>('/auth/login', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return data
  },

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return data
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/auth/me')
    return data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async forgotPassword(email: string): Promise<AuthMessageResponse> {
    const { data } = await api.post<AuthMessageResponse>('/auth/forgot-password', { email })
    return data
  },

  async resetPassword(credentials: ResetPasswordRequest): Promise<AuthMessageResponse> {
    const { data } = await api.post<AuthMessageResponse>('/auth/reset-password', credentials)
    return data
  },

  async verifyEmail(token: string): Promise<AuthMessageResponse> {
    const { data } = await api.get<AuthMessageResponse>('/auth/verify-email', {
      params: { token },
    })
    return data
  },

  async resendEmailVerification(): Promise<AuthMessageResponse> {
    const { data } = await api.post<AuthMessageResponse>('/auth/resend-verification')
    return data
  },
}
