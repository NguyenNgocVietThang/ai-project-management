'use client'
import { useTranslations } from 'next-intl'

import { AlertCircle, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/common/Button'

/** Error boundary trong phạm vi dashboard: giữ nguyên thanh điều hướng phía trên
 *  để người dùng đi tiếp được thay vì mất cả trang. */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('common')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      role="alert"
      className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center"
    >
      <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
      <p className="max-w-md text-sm text-destructive">
        {t('sectionFailed')}
        {error.digest && (
          <span className="block font-mono text-xs">{t('reference', { digest: error.digest })}</span>
        )}
      </p>
      <Button variant="outline" className="w-auto" onClick={reset}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        {t('retry')}
      </Button>
    </div>
  )
}
