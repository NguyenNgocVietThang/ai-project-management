'use client'

/**
 * StatsRow – 4 KPI cards for the Home Dashboard
 * Active Projects / Total Tasks / Overdue Tasks / Hours This Week
 */
import { AlertTriangle, Briefcase, CheckSquare, Clock } from 'lucide-react'
import type { UserDashboardStats } from '@/features/dashboard/types/dashboard.types'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  accent?: 'default' | 'warning' | 'danger'
}

function StatCard({ icon, label, value, accent = 'default' }: StatCardProps) {
  const accentColors = {
    default: 'text-primary bg-primary/10',
    warning: 'text-amber-500 bg-amber-500/10',
    danger: 'text-red-500 bg-red-500/10',
  }
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accentColors[accent]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums text-foreground">{value}</p>
      </div>
    </div>
  )
}

interface StatsRowProps {
  stats: UserDashboardStats
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<Briefcase className="h-5 w-5" />}
        label="Active Projects"
        value={stats.active_projects}
      />
      <StatCard
        icon={<CheckSquare className="h-5 w-5" />}
        label="Total Tasks"
        value={stats.total_tasks}
      />
      <StatCard
        icon={<AlertTriangle className="h-5 w-5" />}
        label="Overdue Tasks"
        value={stats.overdue_tasks}
        accent={stats.overdue_tasks > 0 ? 'danger' : 'default'}
      />
      <StatCard
        icon={<Clock className="h-5 w-5" />}
        label="Hours This Week"
        value={`${stats.hours_this_week}h`}
        accent="warning"
      />
    </div>
  )
}
