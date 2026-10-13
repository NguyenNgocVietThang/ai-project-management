'use client'

import { useTranslations } from 'next-intl'
import { ArrowUpRight, Check, Workflow } from 'lucide-react'
import { Brand } from '@/components/layout/Brand'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { LanguageToggle } from '@/components/layout/LanguageToggle'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { Reveal, RevealText } from '@/components/motion/RevealText'
import { useAuthStore } from '@/store/authStore'
import { AppBackground } from '@/components/background/AppBackground'
import { FireworksToggle } from '@/components/background/FireworksToggle'

const STEP_ICONS = [Check, Workflow, ArrowUpRight] as const

/** Khung xương của cột form xác thực, hiển thị trong lúc store đăng nhập đang hydrate. */
function AuthLoadingSkeleton() {
  return (
    <SkeletonRegion label="Loading…" className="flex min-h-dvh items-center justify-center bg-background/80 px-4">
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

  // Lưu ý: các lớp nền ngoài cùng cố ý dùng màu bán trong suốt (bg-background/..)
  // để một lớp nền trang trí cố định (-z-10) gắn sau này vẫn nhìn xuyên qua được.
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <AppBackground />
      <aside className="auth-grid relative hidden flex-col justify-between overflow-hidden border-r border-border/60 bg-accent/20 p-10 lg:flex xl:p-16">
        {/* Quầng sáng teal mềm phía sau khối tiêu đề, chỉ để trang trí. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,hsl(var(--primary)/0.18),transparent_60%)]"
        />
        <div className="relative">
          <Brand />
        </div>
        <div className="relative my-12 max-w-lg">
          <p className="eyebrow mb-6 animate-fade-in text-primary">{t('eyebrow')}</p>
          <RevealText as="p" text={t('title')} className="text-display text-foreground" />
          <Reveal delay={240}>
            <p className="mt-6 max-w-md text-lead text-muted-foreground">{t('description')}</p>
          </Reveal>
          <Reveal
            stagger={80}
            delay={360}
            className="mt-10 space-y-2 rounded-2xl border border-border/60 bg-card/70 p-6 shadow-soft backdrop-blur-md"
          >
            {(['step1', 'step2', 'step3'] as const).map((step, i) => {
              const Icon = STEP_ICONS[i]
              return (
                <div key={step} className="flex items-center gap-4 py-2">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-body-sm font-medium text-foreground">{t(step)}</span>
                  <span className="ml-auto font-mono text-caption text-muted-foreground">0{i + 1}</span>
                </div>
              )
            })}
          </Reveal>
        </div>
        <p className="relative text-caption text-muted-foreground">{t('footer')}</p>
      </aside>
      <main className="relative flex min-h-dvh flex-col bg-background/40 px-4 py-6 sm:px-12">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <LanguageToggle />
          <FireworksToggle label={ts('fireworks')} reducedMotionHint={ts('fireworksReducedMotion')} />
          <ThemeToggle />
        </div>
        <div className="page-enter mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          {/* Trên mobile/tablet (không có cột giới thiệu) form nằm trong thẻ kính mờ;
              từ lg trở lên form đứng trực tiếp trên nền. */}
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-soft backdrop-blur-md sm:p-8 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
            {children}
          </div>
        </div>
        <p className="text-center text-caption text-muted-foreground">AI Project Planning & Portfolio Management</p>
      </main>
    </div>
  )
}
