'use server'

import { cookies } from 'next/headers'
import { LOCALE_COOKIE, isLocale, type Locale } from './config'

/** Ghi nhớ lựa chọn ngôn ngữ. Cookie chứ không phải localStorage: message được
 *  phân giải trên server, nên lựa chọn phải đến cùng request. */
export async function setLocale(locale: Locale): Promise<void> {
  if (!isLocale(locale)) throw new Error('Unsupported locale')
  const store = await cookies()
  store.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 365 * 24 * 60 * 60,
    sameSite: 'lax',
  })
}
