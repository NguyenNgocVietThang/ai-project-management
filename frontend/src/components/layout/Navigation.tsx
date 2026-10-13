'use client'

import { useTranslations } from 'next-intl'
import { Bell, Briefcase, FolderKanban, LayoutDashboard, ShieldCheck, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Modal } from '@/components/common/Modal'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { cn } from '@/lib/utils'

// Liên kết chia nhóm để sidebar có phân cấp rõ: công việc chính / cá nhân / quản trị.
const GROUPS = [
  {
    key: 'groupWorkspace',
    adminOnly: false,
    links: [
      { href: '/dashboard', key: 'dashboard', Icon: LayoutDashboard },
      { href: '/portfolios', key: 'portfolios', Icon: Briefcase },
      { href: '/projects', key: 'projects', Icon: FolderKanban },
    ],
  },
  {
    key: 'groupPersonal',
    adminOnly: false,
    links: [
      { href: '/notifications', key: 'notifications', Icon: Bell },
      { href: '/profile', key: 'profile', Icon: User },
    ],
  },
  {
    key: 'groupAdmin',
    adminOnly: true,
    links: [{ href: '/admin', key: 'admin', Icon: ShieldCheck }],
  },
] as const

export function MainNav({ isAdmin, onNavigate }: { isAdmin: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const t = useTranslations('nav')
  return (
    <nav aria-label={t('mainNavigation')} className="flex flex-col gap-6">
      {GROUPS.filter(group => !group.adminOnly || isAdmin).map(group => (
        <div key={group.key}>
          <p className="eyebrow mb-2 px-3">{t(group.key)}</p>
          <ul className="flex flex-col gap-1">
            {group.links.map(({ href, key, Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-body-sm font-medium transition-colors duration-200',
                      // Thanh dọc bên trái báo mục đang mở, không chỉ dựa vào màu nền.
                      'before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:transition-colors before:duration-200',
                      active
                        ? 'bg-accent text-accent-foreground before:bg-primary'
                        : 'text-muted-foreground before:bg-transparent hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className={cn('h-5 w-5 transition-transform duration-200 group-hover:scale-110', active && 'text-primary')} strokeWidth={1.75} aria-hidden="true" />
                    {t(key)}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function MobileNav({ open, isAdmin, onClose }: { open: boolean; isAdmin: boolean; onClose: () => void }) {
  const t = useTranslations('nav')
  return <Modal open={open} onClose={onClose} title={t('mainNavigation')} className="max-w-sm">
    <MainNav isAdmin={isAdmin} onNavigate={onClose} />
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-6"><LanguageToggle /><ThemeToggle /></div>
  </Modal>
}
