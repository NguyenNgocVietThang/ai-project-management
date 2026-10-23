'use client'

import { useLocale } from 'next-intl'
import { localizeApiError } from './errors'

/** Resolve at render time so an already visible error follows a language change. */
export function useApiErrorMessage() {
  const locale = useLocale()
  return (error: unknown, fallback?: string) => localizeApiError(error, locale, fallback)
}

