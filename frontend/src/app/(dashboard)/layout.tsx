'use client'

import { Briefcase, FolderKanban, LayoutDashboard, LogOut, ShieldCheck, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { FullPageSpinner } from '@/components/common/FullPageSpinner'
import { EmailVerificationBanner } from '@/features/auth/components/EmailVerificationBanner'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'
import { useNotificationSocket } from '@/features/notifications/hooks/useNotifications'
import { useAuth } from '@/hooks/useAuth'
import { isAdminUser } from '@/lib/rbac'
import { useAuthStore } from '@/store/authStore'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
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

  useEffect(() => {
    setIsClient(true)
    useAuthStore.setState({ hasHydrated: true })
  }, [])

  useEffect(() => {
    if ((hasHydrated || isClient) && !isAuthenticated) {
      Cookies.remove('auth-token', { path: '/' })
      Cookies.remove('auth-token')
      router.replace('/login')
    }
  }, [hasHydrated, isClient, isAuthenticated, router])

  // Đẩy thông báo real-time — kết nối khi người dùng đã được xác thực;
  // bản thân useNotificationSocket() không làm gì nếu chưa có access token.
  useNotificationSocket()

  if (!isClient || !isAuthenticated) {
    return <FullPageSpinner />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2 sm:px-6">
        <div className="flex items-center gap-5">
          <span className="hidden text-sm font-semibold tracking-tight text-foreground lg:inline">
            AI Project Management
          </span>
          <nav aria-label="Main navigation" className="flex items-center gap-1">
            <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><LayoutDashboard className="h-4 w-4" /><span className="hidden sm:inline">Dashboard</span></Link>
            <Link href="/portfolios" className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><Briefcase className="h-4 w-4" /><span className="hidden sm:inline">Portfolios</span></Link>
            <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><FolderKanban className="h-4 w-4" /><span className="hidden sm:inline">Projects</span></Link>
            {isAdminUser(user) && <Link href="/admin" className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><ShieldCheck className="h-4 w-4" /><span className="hidden sm:inline">Admin</span></Link>}
          </nav>
        </div>
        <div className="flex items-center gap-4">
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
            aria-label="Log out"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>
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
