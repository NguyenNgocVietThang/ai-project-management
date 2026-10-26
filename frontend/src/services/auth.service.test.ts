import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from './api'
import { authService } from './auth.service'
import { startAuthSession, useAuthStore } from '@/store/authStore'

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

describe('profile response session boundary', () => {
  it.each(['logout', 'account switch'])('rejects a late me response after %s before a caller writes identity', async boundary => {
    const previousAdapter = api.defaults.adapter
    let complete!: () => void
    const oldUser = { id: 1, full_name: 'Old fixture' } as import('@/types/auth.types').User
    const newUser = { id: 2, full_name: 'New fixture' } as import('@/types/auth.types').User
    api.defaults.adapter = config => new Promise(resolve => {
      complete = () => resolve({ data: oldUser, status: 200, statusText: 'OK', headers: {}, config })
    })
    try {
      startAuthSession({ access_token: 'fixture-original', token_type: 'bearer' })
      const caller = authService.me().then(user => { useAuthStore.getState().setUser(user); return user })
      await vi.waitFor(() => expect(complete).toBeDefined())
      if (boundary === 'logout') useAuthStore.getState().clear()
      else { startAuthSession({ access_token: 'fixture-next', token_type: 'bearer' }); useAuthStore.getState().setUser(newUser) }
      complete()
      await expect(caller).rejects.toThrow('Session changed')
      expect(useAuthStore.getState().user).toEqual(boundary === 'logout' ? null : newUser)
    } finally {
      api.defaults.adapter = previousAdapter
    }
  })

  it('accepts me after same-owner access token rotation', async () => {
    const previousAdapter = api.defaults.adapter
    let complete!: () => void
    const user = { id: 1, full_name: 'Current fixture' } as import('@/types/auth.types').User
    api.defaults.adapter = config => new Promise(resolve => {
      complete = () => resolve({ data: user, status: 200, statusText: 'OK', headers: {}, config })
    })
    try {
      startAuthSession({ access_token: 'fixture-original', token_type: 'bearer' })
      const pending = authService.me()
      await vi.waitFor(() => expect(complete).toBeDefined())
      useAuthStore.getState().setTokens({ access_token: 'fixture-rotated', token_type: 'bearer' })
      complete()
      await expect(pending).resolves.toEqual(user)
    } finally {
      api.defaults.adapter = previousAdapter
    }
  })
})
