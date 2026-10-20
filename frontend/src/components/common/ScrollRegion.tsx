'use client'

import { useId, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

/** Keeps wide content locally scrollable and reachable with a keyboard. */
export function ScrollRegion({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  const t = useTranslations('remainingUi')
  const hintId = useId()
  return <div className="min-w-0">
    <p id={hintId} className="border-b bg-muted/30 px-4 py-2 text-caption text-muted-foreground">{t('scrollHint')}</p>
    <div role="region" aria-label={label} aria-describedby={hintId} tabIndex={0} className={cn('min-w-0 overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring', className)}>
      {children}
    </div>
  </div>
}
