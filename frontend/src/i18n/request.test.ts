import { beforeEach, describe, expect, it, vi } from 'vitest'
import requestConfig from './request'
import english from '../../messages/en.json'
import vietnamese from '../../messages/vi.json'
import { LOCALE_COOKIE } from './config'

const { readCookie } = vi.hoisted(() => ({ readCookie: vi.fn() }))
vi.mock('next/headers', () => ({ cookies: async () => ({ get: readCookie }) }))
vi.mock('next-intl/server', () => ({ getRequestConfig: (factory: unknown) => factory }))

const resolveConfig = requestConfig as unknown as () => Promise<{ locale: string; messages: object }>
beforeEach(() => { vi.clearAllMocks() })

describe('request language', () => {
  it.each([
    ['en', english],
    ['vi', vietnamese],
  ] as const)('loads the complete %s catalog from the saved cookie', async (locale, messages) => {
    readCookie.mockReturnValue({ value: locale })
    expect(await resolveConfig()).toEqual({ locale, messages, timeZone: 'Asia/Ho_Chi_Minh' })
    expect(readCookie).toHaveBeenCalledWith(LOCALE_COOKIE)
  })

  it.each([undefined, 'fr', '', '../../en'])('falls back to Vietnamese for unsupported cookie %s', async (value) => {
    readCookie.mockReturnValue(value === undefined ? undefined : { value })
    expect(await resolveConfig()).toEqual({ locale: 'vi', messages: vietnamese, timeZone: 'Asia/Ho_Chi_Minh' })
  })
})
