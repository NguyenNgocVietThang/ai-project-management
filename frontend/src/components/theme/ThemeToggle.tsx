'use client'
import { useTranslations } from 'next-intl'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

const OPTIONS = [
  { value: 'light', Icon: Sun },
  { value: 'dark', Icon: Moon },
  { value: 'system', Icon: Monitor },
] as const

export function ThemeToggle() {
  const { preference, setPreference } = useTheme()
  const t = useTranslations('theme')

  return (
    <div
      role="radiogroup"
      aria-label={t('label')}
      className="flex items-center rounded-lg border p-0.5"
    >
      {OPTIONS.map(({ value, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={preference === value}
          aria-label={t(value)}
          title={t(value)}
          onClick={() => setPreference(value)}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            preference === value
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent/60'
          }`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
