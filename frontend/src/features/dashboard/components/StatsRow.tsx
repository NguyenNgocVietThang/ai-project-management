'use client'

import { AlertTriangle, Briefcase, CheckSquare, Clock, ArrowUpRight } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import type { UserDashboardStats } from '@/features/dashboard/types/dashboard.types'

export function StatsRow({ stats }: { stats: UserDashboardStats }) {
  const t = useTranslations('home')
  const f = useFormatter()
  const metrics = [
    { label: t('projects'), value: stats.active_projects, Icon: Briefcase, suffix: '', danger: false },
    { label: t('tasks'), value: stats.total_tasks, Icon: CheckSquare, suffix: '', danger: false },
    { label: t('overdue'), value: stats.overdue_tasks, Icon: AlertTriangle, suffix: '', danger: stats.overdue_tasks > 0 },
    { label: t('hours'), value: stats.hours_this_week, Icon: Clock, suffix: 'h', danger: false },
  ]
  return <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
    {metrics.map(({ label, value, Icon, suffix, danger }, i) => <div key={label} className={`relative overflow-hidden rounded-2xl border p-4 sm:p-6 ${i === 0 ? 'border-primary bg-primary text-primary-foreground' : 'bg-card'}`}>
      <div className="flex items-center justify-between gap-2"><p className={`text-xs font-medium ${i === 0 ? 'text-primary-foreground/85' : 'text-muted-foreground'}`}>{label}</p><Icon className={`h-[18px] w-[18px] ${danger ? 'text-destructive' : i === 0 ? 'text-primary-foreground/80' : 'text-muted-foreground'}`} strokeWidth={1.6} aria-hidden="true" /></div>
      <div className="mt-6 flex items-end justify-between"><p className={`text-4xl font-semibold tracking-tight tabular-nums ${danger ? 'text-destructive' : ''}`}>{f.number(value, { maximumFractionDigits: 1 })}<span className="ml-1 text-xl font-normal">{suffix}</span></p>{i === 0 && <ArrowUpRight className="h-5 w-5 opacity-70" aria-hidden="true" />}</div>
    </div>)}
  </div>
}
