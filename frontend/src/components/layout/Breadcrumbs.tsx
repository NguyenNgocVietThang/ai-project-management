'use client'

import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

/* Nhãn động cho các đoạn URL là ID (tên dự án, tên danh mục, mã CR...).
   Trang con đăng ký nhãn qua useBreadcrumbLabel; mặc định hiện "#<id>". */
type LabelMap = Record<string, string>
const BreadcrumbContext = createContext<{ labels: LabelMap; setLabel: (href: string, label: string | null) => void } | null>(null)

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [labels, setLabels] = useState<LabelMap>({})
  const setLabel = useCallback((href: string, label: string | null) => {
    setLabels(current => {
      if (label === null) {
        if (!(href in current)) return current
        const next = { ...current }
        delete next[href]
        return next
      }
      return current[href] === label ? current : { ...current, [href]: label }
    })
  }, [])
  const value = useMemo(() => ({ labels, setLabel }), [labels, setLabel])
  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>
}

/** Đặt nhãn hiển thị cho một đường dẫn (ví dụ `/projects/12` -> tên dự án). */
export function useBreadcrumbLabel(href: string, label: string | undefined | null) {
  const context = useContext(BreadcrumbContext)
  const setLabel = context?.setLabel
  useEffect(() => {
    if (!setLabel || !label) return
    setLabel(href, label)
    return () => setLabel(href, null)
  }, [setLabel, href, label])
}

// Ánh xạ đoạn URL tĩnh -> khoá i18n.
const NAV_SEGMENTS = new Set(['dashboard', 'projects', 'portfolios', 'admin', 'notifications', 'profile'])
const PROJECT_SEGMENTS: Record<string, string> = {
  overview: 'overview', wbs: 'wbs', tasks: 'tasks', gantt: 'gantt', timesheet: 'timesheet', members: 'members', chat: 'chat',
  'change-requests': 'changeRequests', versions: 'versions', documents: 'documents', process: 'process', 'ai-insights': 'aiInsights', settings: 'settings',
}
const ADMIN_SEGMENTS = new Set(['users', 'roles', 'audit'])

interface Crumb { href: string; label: string }

/**
 * Breadcrumb tự suy ra từ pathname. Trên mobile chỉ hiện mục cha gần nhất +
 * trang hiện tại để không tràn dòng; desktop hiện đủ đường dẫn.
 */
export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname()
  const context = useContext(BreadcrumbContext)
  const tNav = useTranslations('nav')
  const tProject = useTranslations('project')
  const tCrumb = useTranslations('breadcrumb')

  const crumbs: Crumb[] = []
  const segments = pathname.split('/').filter(Boolean)
  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const parent = segments[index - 1]
    let label: string
    if (context?.labels[href]) label = context.labels[href]
    else if (index === 0 && NAV_SEGMENTS.has(segment)) label = tNav(segment)
    else if (PROJECT_SEGMENTS[segment] && segments[0] === 'projects') label = tProject(PROJECT_SEGMENTS[segment])
    else if (parent === 'admin' && ADMIN_SEGMENTS.has(segment)) label = tCrumb(segment)
    else if (/^\d+$/.test(segment)) label = `#${segment}`
    else label = segment
    crumbs.push({ href, label })
  })
  if (crumbs.length === 0) return null

  return (
    <nav aria-label={tCrumb('label')} className={cn('min-w-0', className)}>
      <ol className="flex min-w-0 items-center gap-1 text-body-sm">
        <li className="hidden shrink-0 sm:block">
          <Link href="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label={tNav('dashboard')}>
            <Home className="h-4 w-4" aria-hidden="true" />
          </Link>
        </li>
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1
          // Mobile: chỉ giữ 2 mục cuối.
          const hiddenOnMobile = index < crumbs.length - 2
          return (
            <li key={crumb.href} className={cn('flex min-w-0 items-center gap-1', hiddenOnMobile && 'hidden md:flex')}>
              <ChevronRight className={cn('h-4 w-4 shrink-0 text-muted-foreground/70', index === 0 && 'hidden sm:block')} aria-hidden="true" />
              {last ? (
                <span aria-current="page" className="truncate font-semibold text-foreground">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="truncate rounded-md px-1 text-muted-foreground transition-colors hover:text-foreground hover:underline hover:underline-offset-4">
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
