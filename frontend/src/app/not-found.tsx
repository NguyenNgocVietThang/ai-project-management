'use client'

import { useTranslations } from 'next-intl'
import { FileQuestion, LayoutDashboard } from 'lucide-react'
import { ButtonLink } from '@/components/common/Button'

// Trang 404 dùng bố cục kiểu EmptyState: ô biểu tượng, tiêu đề rõ ràng, mô tả và CTA về dashboard.
// Văn bản tiếng Anh cố định được giữ nguyên như trước.
export default function NotFound() {
  const tw = useTranslations('workspaceUi')
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background/80 px-4 py-12">
      <div className="flex w-full max-w-md animate-fade-up flex-col items-center rounded-2xl border border-border/60 bg-card/80 px-6 py-12 text-center shadow-soft backdrop-blur-md">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent ring-8 ring-accent/40">
          <FileQuestion className="h-6 w-6 text-accent-foreground" aria-hidden="true" />
        </span>
        <p className="eyebrow mt-6">404</p>
        <h1 className="mt-2 text-h3 text-foreground">{tw('pageNotFound')}</h1>
        <p className="mt-2 max-w-prose-ui text-body-sm text-muted-foreground">
          {tw('thisPageDoesNotExistOrTheItemItPointedToHasBeenRemoved')} </p>
        <ButtonLink href="/dashboard" size="lg" className="mt-8 w-full sm:w-auto">
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          {tw('backToDashboard')} </ButtonLink>
      </div>
    </main>
  )
}
