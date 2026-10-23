'use client'

import { useTranslations } from 'next-intl'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FullPageSpinner } from '@/components/common/FullPageSpinner'
import { useAuth } from '@/hooks/useAuth'
import { isAdminUser } from '@/lib/rbac'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/admin/users', label: 'users' },
  { href: '/admin/roles', label: 'rolesPermissions' },
  { href: '/admin/audit', label: 'auditLogLabel' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const tAccount = useTranslations('accountUi')
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const isAdmin = isAdminUser(user)

  // `(dashboard)/layout.tsx` đã đảm bảo người dùng được xác thực vào thời điểm
  // component này render — guard này chỉ bổ sung việc kiểm tra vai trò lên trên đó.
  useEffect(() => {
    if (user && !isAdmin) {
      router.replace('/dashboard')
    }
  }, [user, isAdmin, router])

  if (!user || !isAdmin) {
    return <FullPageSpinner />
  }

  return (
    <div className="space-y-6">
      <nav aria-label={tAccount('adminNavigation')} className="flex gap-1 border-b">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-medium transition-colors',
              pathname?.startsWith(tab.href)
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tAccount(tab.label)}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  )
}
