import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setLocale } from './actions'
import { LOCALE_COOKIE, type Locale } from './config'

const { cookieStore } = vi.hoisted(() => ({ cookieStore: { set: vi.fn() } }))
vi.mock('next/headers', () => ({ cookies: async () => cookieStore }))

beforeEach(() => { vi.clearAllMocks() })

describe('locale persistence', () => {
  it.each(['en', 'vi'] as const)('persists %s for every route and future visits', async (locale) => {
    await setLocale(locale)
    expect(cookieStore.set).toHaveBeenCalledWith(LOCALE_COOKIE, locale, expect.objectContaining({
      path: '/', sameSite: 'lax', maxAge: 365 * 24 * 60 * 60,
    }))
  })

  it('rejects unsupported runtime input without corrupting the locale cookie', async () => {
    await expect(setLocale('fr' as Locale)).rejects.toThrow()
    expect(cookieStore.set).not.toHaveBeenCalled()
  })
})
