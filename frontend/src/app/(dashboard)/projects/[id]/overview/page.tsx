'use client'

import { differenceInCalendarDays, parseISO } from 'date-fns'
import { CalendarClock, CheckCircle2, Clock3, Users, WalletCards } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { useProjectActivity, useProjectDetail } from '@/features/projects/hooks/useProjects'
import { formatDate, formatMoney, formatStatus } from '@/lib/format'
import { getApiErrorMessage } from '@/types/api.types'

export default function ProjectOverviewPage() {
  const id = Number(useParams<{ id: string }>().id)
  const projectQuery = useProjectDetail(id)
  const activityQuery = useProjectActivity(id)
  if (projectQuery.isLoading) return <LoadingState label="Loading overview…" />
  if (projectQuery.isError || !projectQuery.data) return <ErrorState message={getApiErrorMessage(projectQuery.error)} />
  const project = projectQuery.data
  const daysRemaining = project.end_date ? Math.max(0, differenceInCalendarDays(parseISO(project.end_date), new Date())) : null
  return <div className="space-y-6">
    <section className="rounded-xl border bg-card p-5"><p className="max-w-4xl text-sm text-muted-foreground">{project.description || 'No project description has been added.'}</p><div className="mt-5 flex justify-between text-xs"><span>{formatDate(project.start_date)}</span><span>{Math.round(project.progress_percent)}% complete</span><span>{formatDate(project.end_date)}</span></div><div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, project.progress_percent))}%` }} /></div></section>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat icon={<CheckCircle2 className="h-5 w-5" />} label="Tasks completed" value={`${project.completed_task_count} / ${project.task_count}`} /><Stat icon={<WalletCards className="h-5 w-5" />} label="Budget used" value={`${formatMoney(project.budget_spent, project.currency)} / ${formatMoney(project.budget, project.currency)}`} /><Stat icon={<Users className="h-5 w-5" />} label="Members" value={project.member_count.toString()} /><Stat icon={<CalendarClock className="h-5 w-5" />} label="Days remaining" value={daysRemaining === null ? 'Not set' : daysRemaining.toString()} /></div>
    <div className="grid gap-6 xl:grid-cols-2"><section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">Phases</h2><p className="mt-1 text-sm text-muted-foreground">Read-only in Phase 1</p><div className="mt-4 space-y-3">{project.phases.length === 0 && <p className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">No phases yet.</p>}{project.phases.sort((a, b) => a.order_index - b.order_index).map((phase) => <div key={phase.id} className="rounded-lg border p-3"><div className="flex items-center justify-between"><h3 className="text-sm font-medium">{phase.name}</h3><span className="text-xs text-muted-foreground">{formatStatus(phase.status)}</span></div><p className="mt-1 text-xs text-muted-foreground">{formatDate(phase.start_date)} – {formatDate(phase.end_date)}</p></div>)}</div></section><section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">Milestones</h2><p className="mt-1 text-sm text-muted-foreground">Upcoming project checkpoints</p><div className="mt-4 space-y-3">{project.milestones.length === 0 && <p className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">No milestones yet.</p>}{project.milestones.map((milestone) => <div key={milestone.id} className="flex gap-3 rounded-lg border p-3"><span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-primary" /><div><h3 className="text-sm font-medium">{milestone.name}</h3><p className="mt-1 text-xs text-muted-foreground">{formatDate(milestone.due_date)} · {formatStatus(milestone.status)}</p></div></div>)}</div></section></div>
    <section className="rounded-xl border bg-card p-5"><div className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Recent activity</h2></div><div className="mt-4 space-y-3">{activityQuery.isLoading && <LoadingState label="Loading activity…" />}{activityQuery.data?.length === 0 && <p className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">No activity has been recorded.</p>}{activityQuery.data?.map((event) => <div key={event.id} className="flex gap-3 border-b pb-3 last:border-0 last:pb-0"><span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" /><div><p className="text-sm">{event.description || formatStatus(event.action)}</p><p className="mt-1 text-xs text-muted-foreground">{event.actor?.full_name || 'System'} · {formatDate(event.created_at)}</p></div></div>)}</div></section>
  </div>
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-xl border bg-card p-5"><div className="flex items-center gap-2 text-primary">{icon}<span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span></div><p className="mt-3 text-lg font-semibold">{value}</p></div> }
