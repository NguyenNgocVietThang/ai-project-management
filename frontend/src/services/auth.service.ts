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
   * Endpoint `/auth/login` ở backend là OAuth2PasswordRequestForm — nó mong đợi
   * application/x-www-form-urlencoded với trường `username` (là email) và `password`,
   * không phải JSON.
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

  /** Đổi lấy mã dùng một lần mà OAuth redirect mang về. Backend không còn đặt
   * token trong URL callback nữa — xem backend app/core/oauth_exchange.py. */
  async exchangeOAuthCode(code: string): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>('/auth/oauth/exchange', { code })
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

  /** Gửi refresh token để server có thể thu hồi nó — nếu không có bước này,
   * logout chỉ là việc bỏ token phía client và một refresh token bị đánh cắp vẫn
   * hoạt động trong suốt vòng đời 7 ngày của nó. */
  async logout(refreshToken: string | null): Promise<void> {
    await api.post('/auth/logout', { refresh_token: refreshToken })
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
