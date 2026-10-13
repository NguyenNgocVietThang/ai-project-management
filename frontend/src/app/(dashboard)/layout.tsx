'use client'
import { useTranslations } from 'next-intl'

import { ArrowUpRight, LogOut, Menu, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Children, useEffect, useState } from 'react'
import { Button } from '@/components/common/Button'
import { FullPageSpinner } from '@/components/common/FullPageSpinner'
import { BreadcrumbProvider, Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { AppBackground } from '@/components/background/AppBackground'
import { FireworksToggle } from '@/components/background/FireworksToggle'
import { MainNav, MobileNav } from '@/components/layout/Navigation'
import { LanguageToggle } from '@/components/layout/LanguageToggle'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { EmailVerificationBanner } from '@/features/auth/components/EmailVerificationBanner'
import { JobsPanel } from '@/features/jobs/components/JobsPanel'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'
import { useNotificationSocket } from '@/features/notifications/hooks/useNotifications'
import { useAuth } from '@/hooks/useAuth'
import { Brand } from '@/components/layout/Brand'
import { isAdminUser } from '@/lib/rbac'
import { bootstrapSession } from '@/services/api'
import { hasSessionCookie, useAuthStore } from '@/store/authStore'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [sessionError, setSessionError] = useState(false)
  const [sessionAttempt, setSessionAttempt] = useState(0)
  const t = useTranslations('nav')
  const ts = useTranslations('shell')
  const tj = useTranslations('jobs')
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())
  const {
    user,
    logout,
    resendEmailVerification,
    isResendingEmailVerification,
    resendEmailVerificationMessage,
    resendEmailVerificationError,
  } = useAuth()

  // Access token chỉ sống trong bộ nhớ, nên mỗi lần tải lại trang nó biến mất và
  // phải được lấy lại từ cookie refresh httpOnly trước khi render bất cứ thứ gì.
  useEffect(() => {
    let cancelled = false
    setSessionError(false)
    if (useAuthStore.getState().accessToken) {
      setIsClient(true)
      useAuthStore.setState({ hasHydrated: true })
      return
    }
    if (!hasSessionCookie()) {
      useAuthStore.setState({ hasHydrated: true })
      router.replace('/login')
      return
    }
    void bootstrapSession().then((restored) => {
      if (cancelled) return
      setIsClient(true)
      useAuthStore.setState({ hasHydrated: true })
      if (!restored) router.replace('/login')
    }).catch(() => {
      if (cancelled) return
      useAuthStore.setState({ hasHydrated: false })
      setSessionError(true)
    })
    return () => {
      cancelled = true
    }
  }, [router, sessionAttempt])

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login')
    }
  }, [hasHydrated, isAuthenticated, router])

  // Đẩy thông báo real-time — kết nối khi người dùng đã được xác thực;
  // bản thân useNotificationSocket() không làm gì nếu chưa có access token.
  useNotificationSocket()

  if (!hasHydrated || !isClient || !isAuthenticated) {
    if (sessionError) return <main className="flex min-h-dvh items-center justify-center bg-background p-6"><div className="max-w-md space-y-4 text-center"><p role="status" className="text-body-sm text-muted-foreground">{tj('connection')}</p><Button fullWidth={false} onClick={() => setSessionAttempt(value => value + 1)}>{tj('refresh')}</Button></div></main>
    return <FullPageSpinner />
  }

  const initials = user?.full_name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('') ?? ''

  return (
    <BreadcrumbProvider>
      <div className="min-h-dvh lg:pl-64">
        {/* Lớp nền cố định phía sau mọi nội dung: ảnh nền theo chế độ + pháo hoa khi nhấp vào vùng trống */}
        <AppBackground />
        <a href="#main-content" className="skip-link">{ts('skipContent')}</a>

        {/* ===== Sidebar cố định (desktop >= 1024px) ===== */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto border-r bg-card/95 px-4 py-6 backdrop-blur-xl lg:flex">
          <Link href="/dashboard" className="mb-8 shrink-0 rounded-lg px-2 transition-opacity duration-200 hover:opacity-80" aria-label={t('dashboard')}><Brand /></Link>
          <MainNav isAdmin={isAdminUser(user)} />
          <div className="mt-auto space-y-4 pt-8">
            {/* Gợi ý AI: CTA phụ, nhẹ nhàng, không cạnh tranh với nội dung chính */}
            <div className="sidebar-tip rounded-xl border border-primary/15 bg-gradient-to-br from-accent to-card p-4">
              <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Sparkles className="h-4 w-4 text-primary" aria-hidden="true" /></span>
              <p className="text-body-sm font-semibold">{ts('aiTitle')}</p>
              <p className="mt-1 text-caption text-muted-foreground">{ts('aiDescription')}</p>
              <Link href="/projects" className="group mt-3 inline-flex min-h-9 items-center gap-1 text-caption font-semibold text-primary">{ts('explore')}<ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></Link>
            </div>
            <div className="flex items-center justify-between border-t pt-4"><span className="text-caption text-muted-foreground">{ts('appearance')}</span><div className="flex items-center gap-2"><FireworksToggle label={ts('fireworks')} reducedMotionHint={ts('fireworksReducedMotion')} /><ThemeToggle /></div></div>
          </div>
        </aside>

        {/* ===== Header dính trên cùng: breadcrumb + tiện ích ===== */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <button type="button" onClick={() => setMobileNavOpen(true)} aria-label={t('openNavigation')} aria-expanded={mobileNavOpen} className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-accent lg:hidden"><Menu className="h-5 w-5" aria-hidden="true" /></button>
            <Breadcrumbs />
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="hidden sm:block"><LanguageToggle /></div>
            <NotificationBell />
            <div className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
            {user && <Link href="/profile" aria-label={t('profile')} className="flex items-center gap-2 rounded-lg p-1 transition-colors duration-200 hover:bg-accent">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-caption font-semibold text-primary-foreground ring-2 ring-background">{initials}</span>
              <span className="hidden max-w-36 truncate pr-2 text-body-sm font-medium xl:block">{user.full_name}</span>
            </Link>}
            <button type="button" onClick={logout} aria-label={t('logout')} title={t('logout')} className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground"><LogOut className="h-4 w-4" aria-hidden="true" /></button>
          </div>
        </header>
        <MobileNav open={mobileNavOpen} isAdmin={isAdminUser(user)} onClose={() => setMobileNavOpen(false)} />

        {/* ===== Nội dung chính ===== */}
        <main id="main-content" tabIndex={-1} className="page-enter mx-auto w-full max-w-[1440px] space-y-6 px-4 py-6 outline-none sm:px-6 sm:py-8 lg:px-8">
          {user?.email_verified === false && (
            <EmailVerificationBanner
              email={user.email}
              onResend={resendEmailVerification}
              isResending={isResendingEmailVerification}
              successMessage={resendEmailVerificationMessage}
              errorMessage={resendEmailVerificationError}
            />
          )}
          <JobsPanel />
          <div>{Children.toArray(children)}</div>
        </main>
      </div>
    </BreadcrumbProvider>
  )
}
