import { api } from '@/services/api'
import type {
  AuthMessageResponse,
  ChangePasswordRequest,
  DeleteAccountRequest,
  OAuthConnectResponse,
  OAuthProvider,
  UpdateProfileRequest,
  User,
} from '@/types/auth.types'

export const userService = {
  async updateProfile(values: UpdateProfileRequest): Promise<User> {
    const { data } = await api.patch<User>('/users/me', values)
    return data
  },

  async changePassword(values: ChangePasswordRequest): Promise<AuthMessageResponse> {
    const { data } = await api.post<AuthMessageResponse>('/users/me/change-password', values)
    return data
  },

  async uploadAvatar(file: File): Promise<User> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post<User>('/users/me/avatar', form)
    return data
  },

  async connectSocial(provider: OAuthProvider): Promise<OAuthConnectResponse> {
    const { data } = await api.post<OAuthConnectResponse>(
      `/users/me/linked-accounts/${provider}/connect`
    )
    return data
  },

  async disconnectSocial(provider: OAuthProvider): Promise<User> {
    const { data } = await api.delete<User>(`/users/me/linked-accounts/${provider}`)
    return data
  },

  async deactivateAccount(values: DeleteAccountRequest): Promise<AuthMessageResponse> {
    const { data } = await api.delete<AuthMessageResponse>('/users/me', { data: values })
    return data
  },
}
