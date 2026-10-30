'use client'
import { useTranslations } from 'next-intl'

import { ChevronLeft, ChevronRight, LogOut, Menu } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Children, useEffect, useState } from 'react'
import { Button } from '@/components/common/Button'
import { FullPageSpinner } from '@/components/common/FullPageSpinner'
import { BreadcrumbProvider, Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { FireworksToggle } from '@/components/background/FireworksToggle'
import { cn } from '@/lib/utils'
import { MainNav, MobileNav } from '@/components/layout/Navigation'
import { LanguageToggle } from '@/components/layout/LanguageToggle'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { EmailVerificationBanner } from '@/features/auth/components/EmailVerificationBanner'
import { JobsPanel } from '@/features/jobs/components/JobsPanel'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'
import { useNotificationSocket } from '@/features/notifications/hooks/useNotifications'
import { useAuth } from '@/hooks/useAuth'
import { Brand } from '@/components/layout/Brand'
import { canViewInvestorPortal, isAdminUser } from '@/lib/rbac'
import { bootstrapSession } from '@/services/api'
import { hasSessionCookie, useAuthStore } from '@/store/authStore'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  useEffect(() => {
    try { setSidebarCollapsed(localStorage.getItem('sidebar-collapsed') === 'true') } catch { /* private mode */ }
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeMobile = () => { if (desktop.matches) setMobileNavOpen(false) }
    desktop.addEventListener('change', closeMobile)
    return () => desktop.removeEventListener('change', closeMobile)
  }, [])
  const toggleSidebar = () => {
    setSidebarCollapsed(value => {
      try { localStorage.setItem('sidebar-collapsed', String(!value)) } catch { /* private mode */ }
      return !value
    })
  }
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
      <div className={cn("min-h-dvh", sidebarCollapsed ? "lg:pl-20" : "lg:pl-64")}>
        <a href="#main-content" className="skip-link">{ts('skipContent')}</a>

        {/* ===== Sidebar cố định (desktop >= 1024px) ===== */}
        <aside className={cn("dusk-sidebar fixed inset-y-0 left-0 z-30 hidden flex-col overflow-y-auto border-r px-4 py-6 lg:flex", sidebarCollapsed ? "w-20" : "w-64")}>
          <Link href="/dashboard" className="mb-8 shrink-0 rounded-lg px-2 transition-opacity duration-200 hover:opacity-80" aria-label={t('dashboard')}>{sidebarCollapsed ? <span className="flex h-10 items-center justify-center text-lg font-semibold text-primary">AI.</span> : <Brand />}</Link>
          <button type="button" onClick={toggleSidebar} aria-label={sidebarCollapsed ? ts('expandNavigation') : ts('collapseNavigation')} title={sidebarCollapsed ? ts('expandNavigation') : ts('collapseNavigation')} className="mb-4 flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm text-muted-foreground hover:bg-muted">{sidebarCollapsed ? <ChevronRight className="h-5 w-5" aria-hidden="true" /> : <><ChevronLeft className="h-5 w-5" aria-hidden="true" />{ts('collapseNavigation')}</>}</button><MainNav collapsed={sidebarCollapsed} isAdmin={isAdminUser(user)} isInvestor={canViewInvestorPortal(user)} />
          <div className="mt-auto space-y-4 pt-8">
            <div className={cn("flex items-center border-t pt-4", sidebarCollapsed ? "flex-col gap-2 justify-center" : "justify-between")}>
              {!sidebarCollapsed && <span className="text-caption text-muted-foreground">{ts('appearance')}</span>}
              <div className={cn("flex items-center", sidebarCollapsed ? "flex-col gap-2" : "gap-2")}>
                <FireworksToggle label={ts('fireworks')} reducedMotionHint={ts('fireworksReducedMotion')} />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </aside>

        {/* ===== Header dính trên cùng: breadcrumb + tiện ích ===== */}
        <header className="dusk-topbar sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <button type="button" onClick={() => setMobileNavOpen(true)} aria-label={t('openNavigation')} aria-expanded={mobileNavOpen} className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-accent lg:hidden"><Menu className="h-5 w-5" aria-hidden="true" /></button>
            <Breadcrumbs />
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="hidden sm:block"><LanguageToggle /></div>
            <NotificationBell />
            <div className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
            {user && <Link href="/profile" aria-label={t('profile')} className="flex items-center gap-2 rounded-lg p-1 transition-colors duration-200 hover:bg-accent">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-caption font-semibold text-primary-foreground ring-2 ring-background">{initials}</span>
              <span className="hidden max-w-36 truncate pr-2 text-body-sm font-medium xl:block">{user.full_name}</span>
            </Link>}
            <button type="button" onClick={logout} aria-label={t('logout')} title={t('logout')} className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground"><LogOut className="h-4 w-4" aria-hidden="true" /></button>
          </div>
        </header>
        <MobileNav open={mobileNavOpen} isAdmin={isAdminUser(user)} isInvestor={canViewInvestorPortal(user)} onClose={() => setMobileNavOpen(false)} />

        {/* ===== Nội dung chính ===== */}
        <main id="main-content" tabIndex={-1} className="mx-auto min-w-0 w-full max-w-[1480px] space-y-4 px-4 py-4 outline-none sm:px-6 sm:py-6 lg:px-8">
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
          <div className="dusk-workspace">{Children.toArray(children)}</div>
        </main>
      </div>
    </BreadcrumbProvider>
  )
}
