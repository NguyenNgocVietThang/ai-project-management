'use client'

import { useTranslations } from 'next-intl'
import { ArrowUpRight, Check, Workflow } from 'lucide-react'
import { Brand } from '@/components/layout/Brand'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { LanguageToggle } from '@/components/layout/LanguageToggle'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FullPageSpinner } from '@/components/common/FullPageSpinner'
import { useAuthStore } from '@/store/authStore'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const t = useTranslations('authIntro')
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())
  const isVerificationRoute = pathname === '/verify-email'

  useEffect(() => {
    setIsClient(true)
    useAuthStore.setState({ hasHydrated: true })
  }, [])

  useEffect(() => {
    if ((hasHydrated || isClient) && isAuthenticated && !isVerificationRoute) {
      router.replace('/dashboard')
    }
  }, [hasHydrated, isClient, isAuthenticated, isVerificationRoute, router])

  // Các liên kết xác minh là công khai và phải render được ngay cả khi browser storage
  // không khả dụng hoặc vẫn đang hydrate (ví dụ, khi mở từ một email client).
  if (!isVerificationRoute && (!isClient || isAuthenticated)) {
    return <FullPageSpinner />
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="auth-grid relative hidden flex-col justify-between overflow-hidden border-r bg-accent/30 p-10 xl:p-16 lg:flex">
        <Brand />
        <div className="relative my-14 max-w-lg">
          <p className="eyebrow mb-6 text-primary">{t('eyebrow')}</p>
          <p className="text-5xl font-semibold leading-[1.12] xl:text-6xl">{t('title')}</p>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">{t('description')}</p>
          <div className="mt-10 space-y-3 rounded-2xl border bg-card/85 p-6 shadow-sm backdrop-blur-sm">
            {(['step1', 'step2', 'step3'] as const).map((step, i) => <div key={step} className="flex items-center gap-4 py-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">{i === 0 ? <Check className="h-4 w-4" /> : i === 1 ? <Workflow className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}</span>
              <span className="text-sm font-medium">{t(step)}</span><span className="ml-auto font-mono text-xs text-muted-foreground">0{i + 1}</span>
            </div>)}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{t('footer')}</p>
      </aside>
      <main className="relative flex min-h-dvh flex-col bg-card px-6 py-6 sm:px-12">
        <div className="flex flex-wrap items-center justify-end gap-3"><LanguageToggle /><ThemeToggle /></div>
        <div className="page-enter mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-14">
          <div className="mb-10 lg:hidden"><Brand /></div>
          {children}
        </div>
        <p className="text-center text-xs text-muted-foreground">AI Project Planning & Portfolio Management</p>
      </main>
    </div>
  )
}
