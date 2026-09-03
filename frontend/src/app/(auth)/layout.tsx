'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FullPageSpinner } from '@/components/common/FullPageSpinner'
import { useAuthStore } from '@/store/authStore'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
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
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel thương hiệu — ẩn trên màn hình nhỏ, hiện từ breakpoint lg trở lên */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_45%)]"
        />
        <span className="relative text-lg font-semibold tracking-tight">AI Project Management</span>
        <div className="relative space-y-3">
          <p className="text-2xl font-semibold leading-snug">
            Plan, track, and report on every project — powered by AI.
          </p>
          <p className="max-w-md text-sm text-primary-foreground/80">
            Portfolios, Gantt scheduling, critical path analysis, and change management in one
            workspace.
          </p>
        </div>
      </div>

      {/* Panel biểu mẫu */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
