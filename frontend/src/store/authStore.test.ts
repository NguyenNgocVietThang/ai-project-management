import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from './authStore'

/**
 * Trước đây cả access lẫn refresh token nằm trong `localStorage` (zustand
 * `persist`) và access token còn được sao vào một cookie mà JavaScript đọc được.
 * Một lỗ hổng XSS duy nhất là đủ để chiếm phiên kéo dài nhiều ngày.
 */
describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().clear()
  })

  it('không ghi token nào xuống localStorage', () => {
    useAuthStore.getState().setTokens({ access_token: 'secret-token', token_type: 'bearer' })

    const stored = JSON.stringify(localStorage)
    expect(stored).not.toContain('secret-token')
    expect(localStorage.getItem('auth-storage')).toBeNull()
  })

  it('giữ access token trong bộ nhớ để interceptor đọc được', () => {
    useAuthStore.getState().setTokens({ access_token: 'in-memory', token_type: 'bearer' })
    expect(useAuthStore.getState().accessToken).toBe('in-memory')
    expect(useAuthStore.getState().isAuthenticated()).toBe(true)
  })

  it('không có chỗ nào lưu refresh token', () => {
    // Refresh token là credential sống lâu nhất; nó phải nằm trong cookie
    // httpOnly do backend đặt, và frontend không bao giờ nhìn thấy nó.
    expect('refreshToken' in useAuthStore.getState()).toBe(false)
  })

  it('xoá sạch phiên khi đăng xuất', () => {
    useAuthStore.getState().setTokens({ access_token: 'x', token_type: 'bearer' })
    useAuthStore.getState().setUser({ id: 1 } as never)

    useAuthStore.getState().clear()

    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().isAuthenticated()).toBe(false)
  })

  it('coi cờ phiên là vắng mặt khi cookie không được đặt', async () => {
    const { hasSessionCookie } = await import('./authStore')
    expect(hasSessionCookie()).toBe(false)
  })
})
