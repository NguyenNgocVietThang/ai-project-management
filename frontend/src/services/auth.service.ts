import { api } from '@/services/api'
import type {
  AuthMessageResponse,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
  AccessTokenResponse,
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
  async login({ email, password }: LoginCredentials): Promise<AccessTokenResponse> {
    const body = new URLSearchParams()
    body.set('username', email)
    body.set('password', password)

    const { data } = await api.post<AccessTokenResponse>('/auth/login', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return data
  },

  /** Đổi lấy mã dùng một lần mà OAuth redirect mang về. Backend không còn đặt
   * token trong URL callback nữa — xem backend app/core/oauth_exchange.py. */
  async exchangeOAuthCode(code: string): Promise<AccessTokenResponse> {
    const { data } = await api.post<AccessTokenResponse>('/auth/oauth/exchange', { code })
    return data
  },

  /** Refresh token tới từ cookie httpOnly, nên lời gọi này không có body. */
  async refresh(): Promise<AccessTokenResponse> {
    const { data } = await api.post<AccessTokenResponse>('/auth/refresh')
    return data
  },

  /** Credential dùng một lần cho WebSocket handshake. Xin lại trước mỗi lần kết
   * nối, kể cả khi kết nối lại — vé chỉ sống 60 giây và dùng được một lần. */
  async webSocketTicket(): Promise<string> {
    const { data } = await api.post<{ ticket: string }>('/auth/ws-ticket')
    return data.ticket
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/auth/me')
    return data
  },

  /** Server đọc refresh token từ cookie httpOnly và thu hồi cả nó lẫn access
   * token đi kèm, rồi xoá cookie phiên. Nếu không có bước này, logout chỉ là việc
   * quên token phía client và một token bị đánh cắp vẫn dùng được tới khi hết hạn. */
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
