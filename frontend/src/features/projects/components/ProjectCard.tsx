import { ArrowRight, CalendarDays, Users } from 'lucide-react'
import Link from 'next/link'
import { ProjectStatusBadge } from '@/features/projects/components/ProjectStatusBadge'
import { formatDate, formatMoney, formatStatus } from '@/lib/format'
import type { Project } from '@/types/project.types'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2">
        <ProjectStatusBadge status={project.status} />
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{formatStatus(project.methodology)}</span>
      </div>
      <h2 className="mt-4 text-lg font-semibold">{project.name}</h2>
      <p className="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground">{project.description || 'No description provided.'}</p>
      <p className="mt-4 text-xs text-muted-foreground">{project.portfolio_name || 'Standalone project'}</p>
      <div className="mt-4 flex items-center justify-between text-sm"><span>Progress</span><span className="font-medium">{Math.round(project.progress_percent)}%</span></div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, project.progress_percent))}%` }} /></div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div><p className="text-xs text-muted-foreground">Budget</p><p className="mt-1 truncate font-medium">{formatMoney(project.budget, project.currency)}</p></div>
        <div><p className="text-xs text-muted-foreground">Members</p><p className="mt-1 flex items-center gap-1.5 font-medium"><Users className="h-4 w-4" />{project.member_count}</p></div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="h-4 w-4" />{formatDate(project.start_date)} – {formatDate(project.end_date)}</div>
      <Link href={`/projects/${project.id}/overview`} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline">Open project <ArrowRight className="h-4 w-4" /></Link>
    </article>
  )
}
