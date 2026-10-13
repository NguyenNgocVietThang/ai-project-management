'use client'

import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface TabNavItem {
  href: string
  label: string
  icon?: LucideIcon
  badge?: number
  active: boolean
}

/**
 * Thanh tab điều hướng dạng gạch chân, cuộn ngang được khi hẹp (mép mờ báo còn
 * nội dung). Tab đang mở luôn được cuộn vào tầm nhìn khi đổi trang.
 */
export function TabNav({ items, label, className }: { items: TabNavItem[]; label: string; className?: string }) {
  const activeRef = useRef<HTMLAnchorElement>(null)
  const activeHref = items.find(item => item.active)?.href

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [activeHref])

  return (
    <nav aria-label={label} className={cn('scroll-fade-x -mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-0 sm:px-0', className)}>
      <ul className="flex min-w-max gap-1 border-b">
        {items.map(({ href, label: itemLabel, icon: Icon, badge, active }) => (
          <li key={href}>
            <Link
              ref={active ? activeRef : undefined}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative inline-flex min-h-11 items-center gap-2 rounded-t-lg px-3 text-body-sm font-medium transition-colors duration-200',
                'after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:transition-colors after:duration-200',
                active
                  ? 'text-foreground after:bg-primary'
                  : 'text-muted-foreground after:bg-transparent hover:bg-muted/60 hover:text-foreground hover:after:bg-border'
              )}
            >
              {Icon && <Icon className={cn('h-4 w-4', active && 'text-primary')} aria-hidden="true" />}
              {itemLabel}
              {Boolean(badge) && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-overline tracking-normal text-destructive-foreground">
                  {badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
