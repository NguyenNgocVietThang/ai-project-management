'use client'

import { useTranslations } from 'next-intl'
import { Skeleton } from '@/components/ui/Skeleton'

/** Hiển thị trong khi khôi phục phiên đăng nhập: khung xương của shell (sidebar,
 *  header, nội dung) thay cho spinner, để lúc giao diện thật hiện ra không nhảy bố cục. */
export function FullPageSpinner() {
  const tw = useTranslations('workspaceUi')
  return (
    <div role="status" aria-busy="true" className="min-h-dvh bg-background lg:pl-64">
      <span className="sr-only">{tw('loading')}</span>
      <div aria-hidden="true" className="fixed inset-y-0 left-0 hidden w-64 flex-col gap-3 border-r bg-card px-4 py-6 lg:flex">
        <Skeleton className="mb-6 h-10 w-36" />
        {[0, 1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
      <div aria-hidden="true" className="flex h-16 items-center justify-between border-b bg-card/80 px-4 sm:px-8">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <div aria-hidden="true" className="mx-auto max-w-[1440px] space-y-6 p-4 sm:p-8">
        <Skeleton className="h-9 w-72 max-w-full" />
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  )
}
