'use client'
import { useTranslations } from 'next-intl'

import { ArrowUpRight, ChevronRight, LogOut, Menu, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Children, useEffect, useState } from 'react'
import { FullPageSpinner } from '@/components/common/FullPageSpinner'
import { MainNav, MobileNav } from '@/components/layout/Navigation'
import { LanguageToggle } from '@/components/layout/LanguageToggle'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { EmailVerificationBanner } from '@/features/auth/components/EmailVerificationBanner'
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
  const t = useTranslations('nav')
  const ts = useTranslations('shell')
  const pathname = usePathname()
  const section = pathname.split('/')[1]
  const sectionTitle = ['dashboard', 'projects', 'portfolios', 'admin', 'notifications', 'profile'].includes(section) ? t(section) : ts('workspace')
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
    })
    return () => {
      cancelled = true
    }
  }, [router])

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login')
    }
  }, [hasHydrated, isAuthenticated, router])

  // Đẩy thông báo real-time — kết nối khi người dùng đã được xác thực;
  // bản thân useNotificationSocket() không làm gì nếu chưa có access token.
  useNotificationSocket()

  if (!hasHydrated || !isClient || !isAuthenticated) {
    return <FullPageSpinner />
  }

  return (
    <div className="min-h-dvh bg-background lg:pl-60">
      <a href="#main-content" className="skip-link">{ts('skipContent')}</a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col overflow-y-auto border-r bg-card px-4 py-7 lg:flex">
        <Link href="/dashboard" className="mb-8 shrink-0 px-2" aria-label={t('dashboard')}><Brand /></Link>
        <p className="eyebrow mb-3 px-3">{ts('workspace')}</p>
        <MainNav isAdmin={isAdminUser(user)} />
        <div className="mt-auto space-y-5 pt-8">
          <div className="sidebar-tip rounded-2xl border border-primary/15 bg-primary/5 p-4">
            <Sparkles className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
            <p className="text-sm font-semibold">{ts('aiTitle')}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{ts('aiDescription')}</p>
            <Link href="/projects" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary">{ts('explore')}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
          </div>
          <div className="flex items-center justify-between border-t pt-4"><span className="text-xs text-muted-foreground">{ts('appearance')}</span><ThemeToggle /></div>
        </div>
      </aside>
      <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between gap-3 border-b bg-card/90 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={() => setMobileNavOpen(true)} aria-label={t('openNavigation')} aria-expanded={mobileNavOpen} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl hover:bg-accent lg:hidden"><Menu className="h-5 w-5" aria-hidden="true" /></button>
          <span className="hidden text-sm text-muted-foreground sm:inline">{ts('workspace')}</span>
          <ChevronRight className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" aria-hidden="true" />
          <span className="truncate text-sm font-semibold">{sectionTitle}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden sm:block"><LanguageToggle /></div>
          <NotificationBell />
          <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
          {user && <Link href="/profile" aria-label={t('profile')} className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-accent">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-xs font-semibold text-accent-foreground">{user.full_name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('')}</span>
            <span className="hidden max-w-36 truncate text-sm font-medium xl:block">{user.full_name}</span>
          </Link>}
          <button type="button" onClick={logout} aria-label={t('logout')} title={t('logout')} className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground"><LogOut className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      </header>
      <MobileNav open={mobileNavOpen} isAdmin={isAdminUser(user)} onClose={() => setMobileNavOpen(false)} />
      <main id="main-content" tabIndex={-1} className="page-enter mx-auto w-full max-w-[1480px] p-4 outline-none sm:p-7 lg:p-10">
        {user?.email_verified === false && (
          <EmailVerificationBanner
            email={user.email}
            onResend={resendEmailVerification}
            isResending={isResendingEmailVerification}
            successMessage={resendEmailVerificationMessage}
            errorMessage={resendEmailVerificationError}
          />
        )}
        {Children.toArray(children)}
      </main>
    </div>
  )
}
