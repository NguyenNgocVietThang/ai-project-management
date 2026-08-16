'use client'

import {
  AlertTriangle,
  Briefcase,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Timer,
} from 'lucide-react'
import Link from 'next/link'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { useDashboardSummary } from '@/features/dashboard/hooks/useDashboard'
import type { ActiveProjectSummary, MyTaskItem } from '@/features/dashboard/types/dashboard.types'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatMoney } from '@/lib/format'
import { getApiErrorMessage } from '@/types/api.types'

// ── Helpers ────────────────────────────────────────────────────────────────

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function priorityColor(p: string): string {
  switch (p.toUpperCase()) {
    case 'CRITICAL': return 'text-red-500'
    case 'HIGH': return 'text-orange-500'
    case 'MEDIUM': return 'text-amber-500'
    default: return 'text-muted-foreground'
  }
}

function statusBadge(s: string) {
  const map: Record<string, string> = {
    TODO: 'bg-muted text-muted-foreground',
    IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    IN_REVIEW: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    DONE: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    BLOCKED: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  }
  return map[s] ?? 'bg-muted text-muted-foreground'
}

// ── Stat card ──────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  accent?: boolean
}) {
  return (
    <div className={`rounded-xl border bg-card p-5 ${accent ? 'border-destructive/30' : ''}`}>
      <div className="flex items-center gap-2">
        <span className={`${accent ? 'text-destructive' : 'text-primary'}`}>{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

// ── Project card ───────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: ActiveProjectSummary }) {
  const pct = Math.min(100, Math.max(0, project.progress_percent))
  return (
    <Link
      href={`/projects/${project.id}/overview`}
      id={`home-project-card-${project.id}`}
      className="group block rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-tight group-hover:text-primary">{project.name}</h3>
        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
          {project.methodology}
        </span>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{project.completed_task_count}/{project.task_count} tasks</span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {project.budget
            ? `${formatMoney(project.budget_spent, project.currency)} / ${formatMoney(project.budget, project.currency)}`
            : 'No budget set'}
        </span>
        {project.days_remaining !== null && (
          <span className={project.days_remaining <= 3 ? 'text-destructive font-medium' : ''}>
            {project.days_remaining === 0 ? 'Due today' : `${project.days_remaining}d left`}
          </span>
        )}
      </div>
    </Link>
  )
}

// ── My Tasks widget ─────────────────────────────────────────────────────────

function MyTasksWidget({ tasks }: { tasks: MyTaskItem[] }) {
  return (
    <section id="home-my-tasks" className="rounded-xl border bg-card">
      <div className="flex items-center gap-2 border-b px-5 py-4">
        <CalendarCheck2 className="h-4 w-4 text-primary" />
        <h2 className="font-semibold">My Tasks</h2>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      {tasks.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">
          No tasks assigned to you. Enjoy the quiet! 🎉
        </p>
      ) : (
        <div className="divide-y">
          {tasks.map((t) => (
            <Link
              key={t.id}
              href={`/projects/${t.project_id}/tasks`}
              id={`home-my-task-${t.id}`}
              className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-accent"
            >
              <span
                className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${t.is_overdue ? 'bg-destructive' : t.is_critical ? 'bg-orange-500' : 'bg-primary'}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.project_name}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`text-xs font-medium ${priorityColor(t.priority)}`}>
                  {t.priority}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadge(t.status)}`}>
                  {t.status.replace('_', ' ')}
                </span>
                {t.due_date && (
                  <span className={`text-xs ${t.is_overdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                    {formatDate(t.due_date)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth()
  const { data, isLoading, isError, error } = useDashboardSummary()

  if (isLoading) return <LoadingState label="Loading dashboard…" />
  if (isError || !data) return <ErrorState message={getApiErrorMessage(error)} />

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting()}, {user?.full_name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across your projects today.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<FolderKanban className="h-5 w-5" />}
          label="Active Projects"
          value={data.stats.active_projects}
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Total Tasks"
          value={data.stats.total_tasks}
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Overdue Tasks"
          value={data.stats.overdue_tasks}
          accent={data.stats.overdue_tasks > 0}
        />
        <StatCard
          icon={<Timer className="h-5 w-5" />}
          label="Hours This Week"
          value={`${data.stats.hours_this_week}h`}
        />
      </div>

      {/* Projects grid */}
      {data.active_projects.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Active Projects</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.active_projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* My Tasks + Recent Activity */}
      <div className="grid gap-6 xl:grid-cols-2">
        <MyTasksWidget tasks={data.my_tasks} />

        <section id="home-recent-activity" className="rounded-xl border bg-card">
          <div className="flex items-center gap-2 border-b px-5 py-4">
            <Clock3 className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Recent Activity</h2>
          </div>
          {data.recent_activity.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No recent activity recorded.
            </p>
          ) : (
            <div className="divide-y">
              {data.recent_activity.map((a) => (
                <div key={a.id} className="flex gap-3 px-5 py-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm">
                      {a.description || `${a.action} ${a.entity_type}${a.entity_id ? ` #${a.entity_id}` : ''}`}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {a.actor_name ?? 'System'} · {formatDate(a.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
