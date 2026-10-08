'use client'

import { useTranslations } from 'next-intl'
import { isAccessError } from '@/features/jobs/hooks/jobPolling'

export function JobConnectionNotice({ error }: { error: unknown }) {
  const t = useTranslations('jobs')
  return <p role="status" className="text-sm text-muted-foreground">{t(isAccessError(error) ? 'unavailable' : 'connection')}</p>
}
