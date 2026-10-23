'use client'

import { Languages } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setLocale } from '@/i18n/actions'
import { LOCALES, type Locale } from '@/i18n/config'

export function LanguageToggle() {
  const current = useLocale()
  const t = useTranslations('language')
  const router = useRouter()
  const [refreshing, startTransition] = useTransition()
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)
  const inFlight = useRef(false)
  const pending = saving || refreshing

  async function changeLocale(locale: Locale) {
    if (inFlight.current || locale === current) return
    inFlight.current = true
    setSaving(true)
    setFailed(false)
    try {
      await setLocale(locale)
      startTransition(() => router.refresh())
    } catch {
      setFailed(true)
    } finally {
      inFlight.current = false
      setSaving(false)
    }
  }

  return (
    <label className="inline-flex items-center gap-2">
      <Languages className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">{t('label')}</span>
      <select
        value={current}
        disabled={pending}
        aria-busy={pending}
        onChange={(event) => void changeLocale(event.target.value as Locale)}
        className="h-9 rounded-md border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {t(locale)}
          </option>
        ))}
      </select>
      {failed && <span role="alert" className="text-caption text-destructive">{t('saveError')}</span>}
    </label>
  )
}
