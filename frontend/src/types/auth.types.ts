/** Phản chiếu backend app/schemas/auth.py + app/schemas/user.py */

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  username: string
  full_name: string
  password: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface RefreshRequest {
  refresh_token: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
}

export interface AuthMessageResponse {
  message: string
}

export interface RoleSummary {
  id: number
  name: string
  description: string | null
}

export interface User {
  id: number
  email: string
  username: string
  full_name: string
  is_active: boolean
  is_superuser: boolean
  email_verified: boolean
  avatar_url: string | null
  phone: string | null
  position: string | null
  department: string | null
  hourly_rate: number | null
  has_password: boolean
  google_connected: boolean
  facebook_connected: boolean
  roles: RoleSummary[]
  last_login: string | null
}

export interface UpdateProfileRequest {
  full_name?: string
  username?: string
  phone?: string | null
  position?: string | null
  department?: string | null
}

export interface ChangePasswordRequest {
  current_password?: string
  new_password: string
}

export interface DeleteAccountRequest {
  username: string
}

export type OAuthProvider = 'google' | 'facebook'

export interface OAuthConnectResponse {
  authorization_url: string
}
