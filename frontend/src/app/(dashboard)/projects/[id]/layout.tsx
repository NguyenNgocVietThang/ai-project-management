'use client'
import { useTranslations } from 'next-intl'

import { ArrowLeft, BarChart3, Clock3, GanttChartSquare, ListTodo, MessageSquare, Network, Settings, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useNumericParam } from '@/hooks/useNumericParam'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { useChatUnreadCount } from '@/features/chat/hooks/useChat'
import { ProjectStatusBadge } from '@/features/projects/components/ProjectStatusBadge'
import { useProjectDetail } from '@/features/projects/hooks/useProjects'
import { getApiErrorMessage } from '@/types/api.types'

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const id = useNumericParam()
  const pathname = usePathname()
  const query = useProjectDetail(id)
  const unread = useChatUnreadCount(id).data?.unread_count ?? 0
  const t = useTranslations('project')
  if (query.isLoading) return <LoadingState label="Loading project…" />
  if (query.isError || !query.data) return <ErrorState message={getApiErrorMessage(query.error, t('notFound'))} />
  const project = query.data
  const links = [{ href: `/projects/${id}/overview`, label: t('overview'), icon: BarChart3 }, { href: `/projects/${id}/wbs`, label: t('wbs'), icon: Network }, { href: `/projects/${id}/tasks`, label: t('tasks'), icon: ListTodo }, { href: `/projects/${id}/timesheet`, label: t('timesheet'), icon: Clock3 }, { href: `/projects/${id}/members`, label: t('members'), icon: Users }, { href: `/projects/${id}/chat`, label: t('chat'), icon: MessageSquare, badge: unread }, { href: `/projects/${id}/settings`, label: t('settings'), icon: Settings }]
  return <div className="space-y-6"><Link href="/projects" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />{t('backToProjects')}</Link><div className="flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><ProjectStatusBadge status={project.status} /><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">{project.methodology}</span></div><h1 className="mt-3 text-3xl font-semibold tracking-tight">{project.name}</h1><p className="mt-1 text-sm text-muted-foreground">{project.portfolio_name || t('standalone')}</p></div><nav className="flex max-w-full gap-1 overflow-x-auto" aria-label={t('navigation')}>{links.map((link) => { const Icon = link.icon; const active = pathname.startsWith(link.href); return <Link key={link.href} href={link.href} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}><Icon className="h-4 w-4" />{link.label}{Boolean(link.badge) && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-xs font-bold text-destructive-foreground">{link.badge}</span>}</Link> })}<span className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground/60" title={t('ganttLater')}><GanttChartSquare className="h-4 w-4" />{t('gantt')}</span></nav></div>{children}</div>
}
