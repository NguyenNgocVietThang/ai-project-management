'use server'

import { cookies } from 'next/headers'
import { LOCALE_COOKIE, type Locale } from './config'

/** Ghi nhớ lựa chọn ngôn ngữ. Cookie chứ không phải localStorage: message được
 *  phân giải trên server, nên lựa chọn phải đến cùng request. */
export async function setLocale(locale: Locale): Promise<void> {
  const store = await cookies()
  store.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 365 * 24 * 60 * 60,
    sameSite: 'lax',
  })
}
