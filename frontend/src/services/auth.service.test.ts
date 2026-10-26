import { afterEach, describe, expect, it } from 'vitest'
import { api } from './api'
import { authService } from './auth.service'
import { useAuthStore } from '@/store/authStore'

afterEach(() => { useAuthStore.getState().clear() })

describe('logout request', () => {
  it('captures the bearer for revocation before immediate client clear', async () => {
    const previousAdapter = api.defaults.adapter
    let authorization: unknown
    api.defaults.adapter = async config => {
      authorization = config.headers.Authorization
      return { data: {}, status: 200, statusText: 'OK', headers: {}, config }
    }
    try {
      useAuthStore.getState().setTokens({ access_token: 'fixture-revoke', token_type: 'bearer' })
      const request = authService.logout()
      useAuthStore.getState().clear()
      await request
      expect(authorization).toBe('Bearer fixture-revoke')
      expect(useAuthStore.getState().accessToken).toBeNull()
    } finally {
      api.defaults.adapter = previousAdapter
    }
  })
})
