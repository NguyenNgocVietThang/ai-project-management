'use client'
import { useTranslations } from 'next-intl'

import { Briefcase, FolderKanban, LayoutDashboard, ShieldCheck, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/dashboard', key: 'dashboard', Icon: LayoutDashboard, adminOnly: false },
  { href: '/portfolios', key: 'portfolios', Icon: Briefcase, adminOnly: false },
  { href: '/projects', key: 'projects', Icon: FolderKanban, adminOnly: false },
  { href: '/admin', key: 'admin', Icon: ShieldCheck, adminOnly: true },
] as const

function useVisibleLinks(isAdmin: boolean) {
  return LINKS.filter((link) => !link.adminOnly || isAdmin)
}

/** Điều hướng ngang cho màn hình từ `sm` trở lên. */
export function MainNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  const links = useVisibleLinks(isAdmin)
  const t = useTranslations('nav')

  return (
    <nav aria-label={t('mainNavigation')} className="hidden items-center gap-1 sm:flex">
      {links.map(({ href, key, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            // aria-current: trước đây không có gì cho biết đang ở mục nào, kể cả
            // bằng mắt lẫn với screen reader.
            aria-current={active ? 'page' : undefined}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active
                ? 'bg-accent font-medium text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {t(key)}
          </Link>
        )
      })}
    </nav>
  )
}

/**
 * Bảng điều hướng trượt cho màn hình nhỏ.
 *
 * Trước đây nhãn của các liên kết bị ẩn dưới breakpoint `sm`, để lại một hàng
 * icon trần không chú thích — điều hướng mù trên điện thoại.
 */
export function MobileNav({
  open,
  isAdmin,
  onClose,
}: {
  open: boolean
  isAdmin: boolean
  onClose: () => void
}) {
  const pathname = usePathname()
  const links = useVisibleLinks(isAdmin)
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 sm:hidden" role="presentation">
      <div className="absolute inset-0 bg-slate-950/55" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('mainNavigation')}
        className="relative flex h-full w-72 max-w-[85vw] flex-col gap-2 border-r bg-background p-4 shadow-xl"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">{tCommon('appName')}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('closeNavigation')}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {links.map(({ href, key, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex min-h-12 items-center gap-3 rounded-md px-3 text-sm',
                active
                  ? 'bg-accent font-medium text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {t(key)}
            </Link>
          )
        })}
        <div className="mt-auto pt-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
