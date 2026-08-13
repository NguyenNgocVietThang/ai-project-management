'use client'

import { ArrowLeft, BarChart3, GanttChartSquare, ListTodo, Settings, Users } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { ProjectStatusBadge } from '@/features/projects/components/ProjectStatusBadge'
import { useProjectDetail } from '@/features/projects/hooks/useProjects'
import { getApiErrorMessage } from '@/types/api.types'

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const id = Number(useParams<{ id: string }>().id)
  const pathname = usePathname()
  const query = useProjectDetail(id)
  if (query.isLoading) return <LoadingState label="Loading project…" />
  if (query.isError || !query.data) return <ErrorState message={getApiErrorMessage(query.error, 'Project not found or access denied.')} />
  const project = query.data
  const links = [{ href: `/projects/${id}/overview`, label: 'Overview', icon: BarChart3 }, { href: `/projects/${id}/members`, label: 'Members', icon: Users }, { href: `/projects/${id}/settings`, label: 'Settings', icon: Settings }]
  return <div className="space-y-6"><Link href="/projects" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to projects</Link><div className="flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><ProjectStatusBadge status={project.status} /><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">{project.methodology}</span></div><h1 className="mt-3 text-3xl font-semibold tracking-tight">{project.name}</h1><p className="mt-1 text-sm text-muted-foreground">{project.portfolio_name || 'Standalone project'}</p></div><nav className="flex max-w-full gap-1 overflow-x-auto" aria-label="Project navigation">{links.map((link) => { const Icon = link.icon; const active = pathname.startsWith(link.href); return <Link key={link.href} href={link.href} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}><Icon className="h-4 w-4" />{link.label}</Link> })}<span className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground/60" title="Coming in Phase 2"><ListTodo className="h-4 w-4" />Tasks <small>Phase 2</small></span><span className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground/60" title="Coming in Phase 2"><GanttChartSquare className="h-4 w-4" />Gantt <small>Phase 2</small></span></nav></div>{children}</div>
}
