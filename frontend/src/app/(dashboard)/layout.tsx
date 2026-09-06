'use client'
import { useTranslations } from 'next-intl'

import { LogOut, Menu, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FullPageSpinner } from '@/components/common/FullPageSpinner'
import { MainNav, MobileNav } from '@/components/layout/Navigation'
import { LanguageToggle } from '@/components/layout/LanguageToggle'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { EmailVerificationBanner } from '@/features/auth/components/EmailVerificationBanner'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'
import { useNotificationSocket } from '@/features/notifications/hooks/useNotifications'
import { useAuth } from '@/hooks/useAuth'
import { isAdminUser } from '@/lib/rbac'
import { bootstrapSession } from '@/services/api'
import { hasSessionCookie, useAuthStore } from '@/store/authStore'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')
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
    <div className="min-h-screen bg-background">
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label={t('openNavigation')}
            aria-expanded={mobileNavOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="hidden text-sm font-semibold tracking-tight text-foreground lg:inline">
            {tCommon('appName')}
          </span>
          <MainNav isAdmin={isAdminUser(user)} />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <NotificationBell />
          {user && (
            <Link
              href="/profile"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <User className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{user.full_name}</span>
            </Link>
          )}
          <button
            type="button"
            onClick={logout}
            aria-label={t('logout')}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('logout')}</span>
          </button>
        </div>
      </header>
      <MobileNav
        open={mobileNavOpen}
        isAdmin={isAdminUser(user)}
        onClose={() => setMobileNavOpen(false)}
      />
      <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6">
        {user?.email_verified === false && (
          <EmailVerificationBanner
            email={user.email}
            onResend={resendEmailVerification}
            isResending={isResendingEmailVerification}
            successMessage={resendEmailVerificationMessage}
            errorMessage={resendEmailVerificationError}
          />
        )}
        {children}
      </main>
    </div>
  )
}
