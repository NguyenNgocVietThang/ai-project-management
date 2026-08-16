'use client'

import { differenceInCalendarDays, parseISO } from 'date-fns'
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Users,
  WalletCards,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { useProjectStats } from '@/features/dashboard/hooks/useDashboard'
import { useProjectActivity, useProjectDetail } from '@/features/projects/hooks/useProjects'
import { formatDate, formatMoney, formatStatus } from '@/lib/format'
import { getApiErrorMessage } from '@/types/api.types'

// ── Stat card ──────────────────────────────────────────────────────────────

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
      <p className="mt-3 text-lg font-semibold">{value}</p>
    </div>
  )
}

// ── Custom tooltip ─────────────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; color?: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-medium text-muted-foreground">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function ProjectOverviewPage() {
  const id = Number(useParams<{ id: string }>().id)
  const projectQuery = useProjectDetail(id)
  const activityQuery = useProjectActivity(id)
  const statsQuery = useProjectStats(id)

  if (projectQuery.isLoading) return <LoadingState label="Loading overview…" />
  if (projectQuery.isError || !projectQuery.data)
    return <ErrorState message={getApiErrorMessage(projectQuery.error)} />

  const project = projectQuery.data
  const stats = statsQuery.data
  const daysRemaining = project.end_date
    ? Math.max(0, differenceInCalendarDays(parseISO(project.end_date), new Date()))
    : null

  // Budget donut data
  const budgetData = stats
    ? [
        { name: 'Spent', value: stats.budget.spent, fill: '#3b82f6' },
        { name: 'Remaining', value: Math.max(0, (stats.budget.budget ?? 0) - stats.budget.spent), fill: '#e5e7eb' },
      ]
    : []

  return (
    <div className="space-y-6">
      {/* ── Timeline progress ─────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-5">
        <p className="max-w-4xl text-sm text-muted-foreground">
          {project.description || 'No project description has been added.'}
        </p>
        <div className="mt-5 flex justify-between text-xs">
          <span>{formatDate(project.start_date)}</span>
          <span>{Math.round(project.progress_percent)}% complete</span>
          <span>{formatDate(project.end_date)}</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.min(100, Math.max(0, project.progress_percent))}%` }}
          />
        </div>
      </section>

      {/* ── Stats row ─────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={<CheckCircle2 className="h-5 w-5" />} label="Tasks completed"
          value={`${project.completed_task_count} / ${project.task_count}`} />
        <Stat icon={<WalletCards className="h-5 w-5" />} label="Budget used"
          value={`${formatMoney(project.budget_spent, project.currency)} / ${formatMoney(project.budget, project.currency)}`} />
        <Stat icon={<Users className="h-5 w-5" />} label="Members"
          value={project.member_count.toString()} />
        <Stat icon={<CalendarClock className="h-5 w-5" />} label="Days remaining"
          value={daysRemaining === null ? 'Not set' : daysRemaining.toString()} />
      </div>

      {/* ── Charts row ────────────────────────────────────────────────── */}
      {stats && (
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Task distribution donut */}
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold">Task Status</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.task_distribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {stats.task_distribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => (
                    <span className="text-xs text-muted-foreground">{v.replace('_', ' ')}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              <p>Total: <strong>{stats.total_tasks}</strong></p>
              <p>Done: <strong>{stats.completed_tasks}</strong></p>
              <p className={stats.overdue_tasks > 0 ? 'text-destructive font-medium' : ''}>
                Overdue: <strong>{stats.overdue_tasks}</strong>
              </p>
              <p className={stats.critical_tasks > 0 ? 'text-orange-500 font-medium' : ''}>
                Critical: <strong>{stats.critical_tasks}</strong>
              </p>
            </div>
          </section>

          {/* Budget donut */}
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold">Budget</h2>
            {stats.budget.budget ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={budgetData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {budgetData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1 text-xs">
                  <p>Spent: <strong>{formatMoney(stats.budget.spent, stats.budget.currency)}</strong></p>
                  <p>Budget: <strong>{formatMoney(stats.budget.budget, stats.budget.currency)}</strong></p>
                  {stats.budget.utilization_pct !== null && (
                    <p className={stats.budget.utilization_pct > 90 ? 'text-destructive font-medium' : ''}>
                      Utilization: <strong>{stats.budget.utilization_pct}%</strong>
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">No budget set</p>
            )}
          </section>

          {/* Burndown line chart */}
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold">14-day Burndown</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.burndown} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9 }}
                  tickFormatter={(v) => v.slice(5)} // MM-DD
                />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="remaining" stroke="#3b82f6" strokeWidth={2} dot={false} name="Remaining" />
                <Line type="monotone" dataKey="ideal" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Ideal" />
              </LineChart>
            </ResponsiveContainer>
          </section>
        </div>
      )}

      {/* ── Team utilization bar chart ─────────────────────────────────── */}
      {stats && stats.team_utilization.length > 0 && (
        <section className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">Team Utilization</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={stats.team_utilization}
              margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="full_name" tick={{ fontSize: 10 }} />
              <YAxis unit="h" tick={{ fontSize: 10 }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="estimated_hours" name="Estimated (h)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="logged_hours" name="Logged (h)" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* ── Phases & Milestones ───────────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">Phases</h2>
          <div className="mt-4 space-y-3">
            {project.phases.length === 0 && (
              <p className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
                No phases yet.
              </p>
            )}
            {project.phases
              .sort((a, b) => a.order_index - b.order_index)
              .map((phase) => (
                <div key={phase.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{phase.name}</h3>
                    <span className="text-xs text-muted-foreground">{formatStatus(phase.status)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(phase.start_date)} – {formatDate(phase.end_date)}
                  </p>
                </div>
              ))}
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">Milestones</h2>
          <div className="mt-4 space-y-3">
            {project.milestones.length === 0 && (
              <p className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
                No milestones yet.
              </p>
            )}
            {project.milestones.map((milestone) => (
              <div key={milestone.id} className="flex gap-3 rounded-lg border p-3">
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-primary" />
                <div>
                  <h3 className="text-sm font-medium">{milestone.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(milestone.due_date)} · {formatStatus(milestone.status)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Recent Activity ───────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2">
          <Clock3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Recent activity</h2>
        </div>
        <div className="mt-4 space-y-3">
          {activityQuery.isLoading && <LoadingState label="Loading activity…" />}
          {activityQuery.data?.length === 0 && (
            <p className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
              No activity has been recorded.
            </p>
          )}
          {activityQuery.data?.map((event) => (
            <div key={event.id} className="flex gap-3 border-b pb-3 last:border-0 last:pb-0">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-sm">{event.description || formatStatus(event.action)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {event.actor?.full_name || 'System'} · {formatDate(event.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
