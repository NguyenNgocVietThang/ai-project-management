'use client'
import { useTranslations } from 'next-intl'

import { AlertCircle, LayoutDashboard, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'
import { Button, ButtonLink } from '@/components/common/Button'

/**
 * Error boundary cho toàn bộ ứng dụng.
 *
 * Trước đây không tồn tại file nào như thế này, nên một lỗi render bất kỳ trong
 * client component cho ra màn hình trắng: không thông báo, không nút thử lại,
 * không dấu hiệu nào cho biết đã có chuyện gì.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('common')

  useEffect(() => {
    // Lỗi phía client không tự đi đâu cả; ít nhất phải để lại dấu vết trong console.
    console.error(error)
  }, [error])

  // Bố cục kiểu EmptyState: ô biểu tượng, tiêu đề, mô tả và hai hành động
  // (thử lại là CTA chính, về dashboard là lối thoát phụ).
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background/80 px-4 py-12">
      <div className="flex w-full max-w-md animate-fade-up flex-col items-center rounded-2xl border border-border/60 bg-card/80 px-6 py-12 text-center shadow-soft backdrop-blur-md">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 ring-8 ring-destructive/5">
          <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-h3 text-foreground">{t('somethingWentWrong')}</h1>
        <p className="mt-2 max-w-prose-ui text-body-sm text-muted-foreground">{t('tryAgainMessage')}</p>
        {error.digest && (
          <p className="mt-3 font-mono text-caption text-muted-foreground">{t('reference', { digest: error.digest })}</p>
        )}
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button size="lg" className="sm:w-auto" onClick={reset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t('retry')}
          </Button>
          <ButtonLink href="/dashboard" variant="outline" size="lg" className="w-full sm:w-auto">
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            {t('backToDashboard')}
          </ButtonLink>
        </div>
      </div>
    </main>
  )
}
