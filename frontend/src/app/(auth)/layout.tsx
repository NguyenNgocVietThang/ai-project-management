'use client'

import { useTranslations } from 'next-intl'

import { ArrowUpRight, Check, Workflow } from 'lucide-react'
import { Brand } from '@/components/layout/Brand'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { LanguageToggle } from '@/components/layout/LanguageToggle'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { useAuthStore } from '@/store/authStore'
import { FireworksToggle } from '@/components/background/FireworksToggle'

const STEP_ICONS = [Check, Workflow, ArrowUpRight] as const

/** Khung xương của cột form xác thực, hiển thị trong lúc store đăng nhập đang hydrate. */
function AuthLoadingSkeleton() {
  const tAccount = useTranslations('accountUi')
  return (
    <SkeletonRegion label={tAccount('loading')} className="flex min-h-dvh items-center justify-center bg-background/80 px-4">
      <div className="w-full max-w-sm space-y-6">
        <Skeleton className="h-10 w-36" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </SkeletonRegion>
  )
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const tAccount = useTranslations('accountUi')
  const router = useRouter()
  const t = useTranslations('authIntro')
  const ts = useTranslations('shell')
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
    return <AuthLoadingSkeleton />
  }

  return (
    <div className="min-h-dvh p-3 sm:p-5 lg:p-6">
      <div className="mx-auto grid min-h-[calc(100dvh-3rem)] max-w-[1600px] overflow-hidden rounded-3xl border border-border/70 bg-card lg:grid-cols-[1.1fr_1fr]">
        <aside className="dusk-auth-story relative hidden flex-col justify-between p-10 lg:flex xl:p-14">
          <Brand />
          <div className="my-12 max-w-lg">
            <p className="mb-5 text-body-sm font-medium text-primary">{t('eyebrow')}</p>
            <p className="text-4xl font-medium leading-[1.15] tracking-tight xl:text-5xl">{t('title')}</p>
            <p className="mt-6 max-w-md text-lead text-foreground">{t('description')}</p>
          </div>
          <div>
            <div className="space-y-4 border-t border-foreground/20 pt-6">
              {(['step1', 'step2', 'step3'] as const).map((step, i) => {
                const Icon = STEP_ICONS[i]
                return <div key={step} className="flex items-center gap-3 text-body-sm font-medium">
                  <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{t(step)}</span>
                </div>
              })}
            </div>
            <p className="mt-8 text-caption text-muted-foreground">{t('footer')}</p>
          </div>
        </aside>
        <main className="relative flex flex-col bg-card px-5 py-5 sm:px-10 lg:px-12 xl:px-16">
          <div className="flex flex-wrap items-center justify-end gap-3">
            <LanguageToggle />
            <FireworksToggle label={ts('fireworks')} reducedMotionHint={ts('fireworksReducedMotion')} />
            <ThemeToggle />
          </div>
          <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
            <div className="dusk-landscape mb-8 rounded-2xl border border-border/60 p-5 lg:hidden"><Brand /></div>
            {children}
          </div>
          <p className="text-center text-caption text-muted-foreground">{tAccount('aIProjectPlanningPortfolioManagement')}</p>
        </main>
      </div>
    </div>
  )
}
