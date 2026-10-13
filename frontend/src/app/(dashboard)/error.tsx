'use client'
import { useTranslations } from 'next-intl'

import { AlertCircle, LayoutDashboard, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'
import { Button, ButtonLink } from '@/components/common/Button'

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

  // Bố cục kiểu ErrorState: ô biểu tượng, thông điệp, mã tham chiếu và hành động.
  return (
    <div
      role="alert"
      className="flex min-h-64 animate-fade-in flex-col items-center justify-center rounded-xl border border-destructive/25 bg-destructive/5 px-6 py-12 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 ring-8 ring-destructive/5">
        <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
      </span>
      <h2 className="mt-6 text-h4 text-foreground">{t('somethingWentWrong')}</h2>
      <p className="mt-2 max-w-prose-ui text-body-sm text-muted-foreground">
        {t('sectionFailed')}
        {error.digest && (
          <span className="mt-2 block font-mono text-caption">{t('reference', { digest: error.digest })}</span>
        )}
      </p>
      <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button variant="outline" className="sm:w-auto" onClick={reset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {t('retry')}
        </Button>
        <ButtonLink href="/dashboard" variant="ghost" className="w-full sm:w-auto">
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          {t('backToDashboard')}
        </ButtonLink>
      </div>
    </div>
  )
}
