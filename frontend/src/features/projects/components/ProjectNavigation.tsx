'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const planning = ['wbs', 'gantt'] as const
const more = ['timesheet', 'members', 'chat', 'change-requests', 'versions', 'documents', 'process', 'ai-insights', 'settings'] as const
const labels = { 'change-requests': 'changeRequests', 'ai-insights': 'aiInsights' } as const

export function ProjectNavigation({ projectId, pathname, unread = 0 }: { projectId: number; pathname: string; unread?: number }) {
  const t = useTranslations('project')
  const navRef = useRef<HTMLElement>(null)
  const href = (section: string) => `/projects/${projectId}/${section}`
  const active = (section: string) => pathname === href(section) || pathname.startsWith(`${href(section)}/`)
  const label = (section: string) => t(labels[section as keyof typeof labels] ?? section)

  useEffect(() => {
    navRef.current?.querySelectorAll('details').forEach(item => { item.open = false })
  }, [pathname])

  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) navRef.current?.querySelectorAll('details').forEach(item => { item.open = false })
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [])

  const linkClass = (selected: boolean) => cn('flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-md px-2 py-2 text-center text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4', selected ? 'bg-accent text-accent-foreground ring-1 ring-primary/30' : 'text-muted-foreground hover:bg-muted hover:text-foreground')
  const group = (sections: readonly string[], title: string, alignRight = false) => <details className="group relative min-w-0" onToggle={event => {
    if (event.currentTarget.open) navRef.current?.querySelectorAll('details').forEach(item => { if (item !== event.currentTarget) item.open = false })
  }} onKeyDown={event => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.currentTarget.open = false
      event.currentTarget.querySelector('summary')?.focus()
    }
  }}>
    <summary className={cn(linkClass(sections.some(active)), 'cursor-pointer list-none [&::-webkit-details-marker]:hidden')}>
      <span className="min-w-0 break-words">{title}</span><ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
      {sections.includes('chat') && unread > 0 && <span className="h-2 w-2 shrink-0 rounded-full bg-primary"><span className="sr-only">{t('chat')}: {unread}</span></span>}
    </summary>
    <div className={cn('absolute top-full z-30 mt-2 max-h-[60dvh] w-56 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border bg-popover p-1 shadow-lg', alignRight ? 'right-0' : 'left-0')}>
      {sections.map(section => <Link key={section} href={href(section)} aria-current={active(section) ? 'page' : undefined} className={cn(linkClass(active(section)), 'justify-start text-left')} onClick={event => { const details = event.currentTarget.closest('details'); if (details) details.open = false }}>
        {label(section)}{section === 'chat' && unread > 0 && <span className="ml-auto rounded bg-primary px-1.5 text-xs text-primary-foreground">{unread}</span>}
      </Link>)}
    </div>
  </details>

  return <nav ref={navRef} aria-label={t('navigation')} className="grid grid-cols-4 gap-1 border-b bg-background py-2 sm:flex sm:gap-2">
    {['overview', 'tasks'].map(section => <Link key={section} href={href(section)} aria-current={active(section) ? 'page' : undefined} className={linkClass(active(section))}>{label(section)}</Link>)}
    {group(planning, t('planning'), true)}
    {group(more, t('more'), true)}
  </nav>
}
