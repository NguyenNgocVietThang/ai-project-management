'use client'
import { useTranslations } from 'next-intl'

import { AlertCircle, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/common/Button'

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
      <div>
        <h1 className="text-xl font-semibold">{t('somethingWentWrong')}</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{t('tryAgainMessage')}</p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">{t('reference', { digest: error.digest })}</p>
        )}
      </div>
      <Button className="w-auto" onClick={reset}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        {t('retry')}
      </Button>
    </main>
  )
}
