'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FullPageSpinner } from '@/components/common/FullPageSpinner'
import { useAuth } from '@/hooks/useAuth'
import { canViewInvestorPortal } from '@/lib/rbac'

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user } = useAuth()
  const allowed = canViewInvestorPortal(user)

  // `(dashboard)/layout.tsx` đã đảm bảo đăng nhập; ở đây chỉ chặn thêm theo role.
  // Backend vẫn kiểm tra quyền xem từng portfolio.
  useEffect(() => {
    if (user && !allowed) router.replace('/dashboard')
  }, [user, allowed, router])

  if (!user || !allowed) return <FullPageSpinner />
  return <>{children}</>
}
