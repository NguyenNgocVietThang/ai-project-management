'use client'

import { useTranslations } from 'next-intl'
import { Bell, Briefcase, FolderKanban, LayoutDashboard, ShieldCheck, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Modal } from '@/components/common/Modal'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/dashboard', key: 'dashboard', Icon: LayoutDashboard, adminOnly: false },
  { href: '/portfolios', key: 'portfolios', Icon: Briefcase, adminOnly: false },
  { href: '/projects', key: 'projects', Icon: FolderKanban, adminOnly: false },
  { href: '/notifications', key: 'notifications', Icon: Bell, adminOnly: false },
  { href: '/profile', key: 'profile', Icon: User, adminOnly: false },
  { href: '/admin', key: 'admin', Icon: ShieldCheck, adminOnly: true },
] as const

export function MainNav({ isAdmin, onNavigate }: { isAdmin: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const t = useTranslations('nav')
  return <nav aria-label={t('mainNavigation')} className="flex flex-col gap-1.5">
    {LINKS.filter(link => !link.adminOnly || isAdmin).map(({ href, key, Icon }) => {
      const active = pathname === href || pathname.startsWith(`${href}/`)
      return <Link key={href} href={href} onClick={onNavigate} aria-current={active ? 'page' : undefined}
        className={cn('relative flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-[13px] font-medium transition-colors', active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden="true" />{t(key)}
        {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />}
      </Link>
    })}
  </nav>
}

export function MobileNav({ open, isAdmin, onClose }: { open: boolean; isAdmin: boolean; onClose: () => void }) {
  const t = useTranslations('nav')
  return <Modal open={open} onClose={onClose} title={t('mainNavigation')} className="max-w-sm">
    <MainNav isAdmin={isAdmin} onNavigate={onClose} />
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5"><LanguageToggle /><ThemeToggle /></div>
  </Modal>
}
