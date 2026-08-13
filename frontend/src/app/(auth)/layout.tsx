'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FullPageSpinner } from '@/components/common/FullPageSpinner'
import { useAuthStore } from '@/store/authStore'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())
  const isVerificationRoute = pathname === '/verify-email'

  useEffect(() => {
    if (hasHydrated && isAuthenticated && !isVerificationRoute) {
      router.replace('/dashboard')
    }
  }, [hasHydrated, isAuthenticated, isVerificationRoute, router])

  // Verification links are public and must render even when browser storage is
  // unavailable or still hydrating (for example, when opened from an email client).
  if (!isVerificationRoute && (!hasHydrated || isAuthenticated)) {
    return <FullPageSpinner />
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel — hidden on small screens, shown from lg breakpoint up */}
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

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
