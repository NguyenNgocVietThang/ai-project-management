'use client'

import { WifiOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { isAccessError } from '@/features/jobs/hooks/jobPolling'

/** Thông báo mất kết nối khi theo dõi job: kiểu Alert cảnh báo, dùng token warning. */
export function JobConnectionNotice({ error }: { error: unknown }) {
  const t = useTranslations('jobs')
  return (
    <p
      role="status"
      className="flex items-start gap-2 rounded-lg border border-warning/25 bg-warning-soft px-3 py-2 text-body-sm text-warning"
    >
      <WifiOff className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{t(isAccessError(error) ? 'unavailable' : 'connection')}</span>
    </p>
  )
}
