'use client'

import { useTranslations } from 'next-intl'
import { Bell, Briefcase, FolderKanban, LayoutDashboard, LineChart, ShieldCheck, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Modal } from '@/components/common/Modal'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { cn } from '@/lib/utils'

// Liên kết chia nhóm để sidebar có phân cấp rõ: công việc chính / cá nhân / nhà đầu tư / quản trị.
const GROUPS = [
  {
    key: 'groupWorkspace',
    audience: 'all',
    links: [
      { href: '/dashboard', key: 'dashboard', Icon: LayoutDashboard },
      { href: '/portfolios', key: 'portfolios', Icon: Briefcase },
      { href: '/projects', key: 'projects', Icon: FolderKanban },
    ],
  },
  {
    key: 'groupPersonal',
    audience: 'all',
    links: [
      { href: '/notifications', key: 'notifications', Icon: Bell },
      { href: '/profile', key: 'profile', Icon: User },
    ],
  },
  {
    key: 'groupInvestor',
    audience: 'investor',
    links: [{ href: '/investor', key: 'investor', Icon: LineChart }],
  },
  {
    key: 'groupAdmin',
    audience: 'admin',
    links: [{ href: '/admin', key: 'admin', Icon: ShieldCheck }],
  },
] as const

export function MainNav({ isAdmin, isInvestor = false, onNavigate, collapsed = false }: { isAdmin: boolean; isInvestor?: boolean; onNavigate?: () => void; collapsed?: boolean }) {
  const pathname = usePathname()
  const t = useTranslations('nav')
  // Nhóm hiện theo đối tượng; backend vẫn kiểm tra quyền ở từng API.
  const visible = (audience: 'all' | 'admin' | 'investor') =>
    audience === 'all' || (audience === 'admin' && isAdmin) || (audience === 'investor' && isInvestor)
  return (
    <nav aria-label={t('mainNavigation')} className="flex flex-col gap-6">
      {GROUPS.filter(group => visible(group.audience)).map(group => (
        <div key={group.key}>
          <p className={cn('eyebrow mb-2 px-3', collapsed && 'sr-only')}>{t(group.key)}</p>
          <ul className="flex flex-col gap-1">
            {group.links.map(({ href, key, Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    title={collapsed ? t(key) : undefined}
                    className={cn(
                      'group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-body-sm font-medium transition-colors duration-200',
                      collapsed && 'justify-center px-0',
                      // Thanh dọc bên trái báo mục đang mở, không chỉ dựa vào màu nền.
                      'before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:transition-colors before:duration-200',
                      active
                        ? 'bg-accent text-accent-foreground before:bg-primary'
                        : 'text-muted-foreground before:bg-transparent hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className={cn('h-5 w-5 transition-transform duration-200 group-hover:scale-110', active && 'text-primary')} strokeWidth={1.75} aria-hidden="true" />
                    <span className={collapsed ? 'sr-only' : undefined}>{t(key)}</span>
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

export function MobileNav({ open, isAdmin, isInvestor = false, onClose }: { open: boolean; isAdmin: boolean; isInvestor?: boolean; onClose: () => void }) {
  const t = useTranslations('nav')
  return <Modal open={open} onClose={onClose} title={t('mainNavigation')} className="max-w-sm">
    <MainNav isAdmin={isAdmin} isInvestor={isInvestor} onNavigate={onClose} />
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-6"><LanguageToggle /><ThemeToggle /></div>
  </Modal>
}
