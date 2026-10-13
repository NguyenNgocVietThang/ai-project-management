'use client'

import { AlertTriangle, Briefcase, CheckSquare, Clock } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { CountUp } from '@/components/motion/CountUp'
import { Reveal } from '@/components/motion/RevealText'
import { Card } from '@/components/ui/Card'
import type { UserDashboardStats } from '@/features/dashboard/types/dashboard.types'
import { cn } from '@/lib/utils'

/** Hàng 4 chỉ số đồng dạng; số quá hạn > 0 chuyển sang tông destructive. */
export function StatsRow({ stats }: { stats: UserDashboardStats }) {
  const t = useTranslations('home')
  const f = useFormatter()
  const metrics = [
    { label: t('projects'), value: stats.active_projects, Icon: Briefcase, suffix: '', danger: false },
    { label: t('tasks'), value: stats.total_tasks, Icon: CheckSquare, suffix: '', danger: false },
    { label: t('overdue'), value: stats.overdue_tasks, Icon: AlertTriangle, suffix: '', danger: stats.overdue_tasks > 0 },
    { label: t('hours'), value: stats.hours_this_week, Icon: Clock, suffix: 'h', danger: false },
  ]
  return (
    <Reveal stagger={60} className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {metrics.map(({ label, value, Icon, suffix, danger }) => (
        <Card key={label} className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <p className="text-body-sm font-medium text-muted-foreground">{label}</p>
            <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', danger ? 'bg-destructive/10' : 'bg-accent')}>
              <Icon className={cn('h-4 w-4', danger ? 'text-destructive' : 'text-accent-foreground')} aria-hidden="true" />
            </span>
          </div>
          <p className={cn('mt-6 text-h2 sm:text-h1', danger && 'text-destructive')}>
            <CountUp value={value} format={n => f.number(n, { maximumFractionDigits: 1 })} />
            {suffix && <span className="ml-1 text-h4 font-normal text-muted-foreground">{suffix}</span>}
          </p>
        </Card>
      ))}
    </Reveal>
  )
}
