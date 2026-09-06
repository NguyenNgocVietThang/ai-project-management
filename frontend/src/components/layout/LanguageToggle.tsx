'use client'

import { Languages } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { setLocale } from '@/i18n/actions'
import { LOCALES, type Locale } from '@/i18n/config'

export function LanguageToggle() {
  const current = useLocale()
  const t = useTranslations('language')
  const [pending, startTransition] = useTransition()

  return (
    <label className="inline-flex items-center gap-2">
      <Languages className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">{t('label')}</span>
      <select
        value={current}
        disabled={pending}
        onChange={(event) =>
          startTransition(() => {
            void setLocale(event.target.value as Locale)
          })
        }
        className="h-9 rounded-md border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {t(locale)}
          </option>
        ))}
      </select>
    </label>
  )
}
