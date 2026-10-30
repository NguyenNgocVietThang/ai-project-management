'use client'

import { useLocale, useTranslations } from 'next-intl'

/**
 * ActiveProjectsGrid – lưới thẻ cho Home Dashboard
 * Hiển thị thanh tiến độ, đồng hồ ngân sách và badge số ngày còn lại
 */
import Link from 'next/link'
import { CalendarClock, TrendingUp } from 'lucide-react'
import { ButtonLink } from '@/components/common/Button'
import { EmptyState } from '@/components/common/PageState'
import { Reveal } from '@/components/motion/RevealText'
import { Card } from '@/components/ui/Card'
import { ProjectStatusBadge } from '@/features/projects/components/ProjectStatusBadge'
import { formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ActiveProjectSummary } from '@/features/dashboard/types/dashboard.types'

/** Thanh tiến độ cao 8px, chiều rộng chuyển động mượt 500ms. */
function ProgressBar({ value, toneClass = 'bg-primary' }: { value: number; toneClass?: string }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <div className={cn('h-full rounded-full ', toneClass)} style={{ width: `${pct}%` }} />
    </div>
  )
}

// Nhận className/style để Reveal gắn hiệu ứng trồi lên theo nhịp
function ProjectCard({ project, className, style }: { project: ActiveProjectSummary; className?: string; style?: React.CSSProperties }) {
  const locale = useLocale()
  const t = useTranslations('home')
  const budgetPct =
    project.budget && project.budget > 0
      ? (project.budget_spent / project.budget) * 100
      : null
  // Ngân sách: > 90% nguy hiểm, > 70% cảnh báo, còn lại an toàn
  const budgetTone =
    budgetPct !== null && budgetPct > 90 ? 'bg-destructive' : budgetPct !== null && budgetPct > 70 ? 'bg-warning' : 'bg-success'

  return (
    <Card as="article" interactive className={cn('group flex flex-col gap-4', className)} style={style}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-h4">
          {/* Liên kết kéo giãn phủ toàn thẻ: cả thẻ bấm được nhưng chỉ một điểm dừng Tab */}
          <Link
            href={`/projects/${project.id}/overview`}
            className="transition-colors after:absolute after:inset-0 after:rounded-xl group-hover:text-primary focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {project.name}
          </Link>
        </h3>
        <ProjectStatusBadge status={project.status} />
      </div>

      {/* Tiến độ */}
      <div>
        <div className="mb-2 flex justify-between text-caption text-muted-foreground">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
            {t('progress')}
          </span>
          <span className="font-medium text-foreground tabular-nums">
            {Math.round(project.progress_percent)}%
          </span>
        </div>
        <ProgressBar value={project.progress_percent} />
      </div>

      {/* Task */}
      <div className="flex items-center justify-between text-caption text-muted-foreground">
        <span>
          {t('taskCount')}:{' '}
          <span className="font-medium text-foreground tabular-nums">
            {project.completed_task_count}/{project.task_count}
          </span>
        </span>
        {project.days_remaining !== null && (
          <span className="flex items-center gap-1">
            <CalendarClock className="h-3 w-3" aria-hidden="true" />
            <span className={project.days_remaining <= 7 ? 'font-medium text-destructive' : 'text-muted-foreground'}>
              {project.days_remaining < 0 ? t('daysOverdue', { count: Math.abs(project.days_remaining) }) : t('daysLeft', { count: project.days_remaining })}
            </span>
          </span>
        )}
      </div>

      {/* Ngân sách */}
      {project.budget !== null && (
        <div>
          <div className="mb-2 flex justify-between text-caption text-muted-foreground">
            <span>{t('budget')}</span>
            <span className="tabular-nums">{budgetPct !== null ? `${Math.round(budgetPct)}%` : '-'}</span>
          </div>
          <ProgressBar value={budgetPct ?? 0} toneClass={budgetTone} />
          <div className="mt-1 flex justify-between gap-2 text-caption text-muted-foreground tabular-nums">
            <span>{formatMoney(project.budget_spent, project.currency, locale)}</span>
            <span>{formatMoney(project.budget, project.currency, locale)}</span>
          </div>
        </div>
      )}
    </Card>
  )
}

interface ActiveProjectsGridProps {
  projects: ActiveProjectSummary[]
}

export function ActiveProjectsGrid({ projects }: ActiveProjectsGridProps) {
  const t = useTranslations('home')
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title={t('noProjects')}
        description={t('noProjectsDescription')}
        action={<ButtonLink href="/projects">{t('viewProjects')}</ButtonLink>}
      />
    )
  }
  return (
    <Reveal stagger={60} className="grid gap-4 md:grid-cols-2">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </Reveal>
  )
}
