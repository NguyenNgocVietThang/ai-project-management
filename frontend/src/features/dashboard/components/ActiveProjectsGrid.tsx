'use client'

/**
 * ActiveProjectsGrid – cards grid for the Home Dashboard
 * Shows progress bar, budget meter, and days remaining badge
 */
import Link from 'next/link'
import { CalendarClock, TrendingUp } from 'lucide-react'
import { MiniProgressBar } from '@/components/charts/MiniProgressBar'
import { formatMoney, formatStatus } from '@/lib/format'
import type { ActiveProjectSummary } from '@/features/dashboard/types/dashboard.types'

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  PLANNING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ON_HOLD: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  COMPLETED: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

function ProjectCard({ project }: { project: ActiveProjectSummary }) {
  const budgetPct =
    project.budget && project.budget > 0
      ? Math.min(100, (project.budget_spent / project.budget) * 100)
      : null

  return (
    <Link
      href={`/projects/${project.id}/overview`}
      className="group flex flex-col gap-4 rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[project.status] ?? STATUS_BADGE.PLANNING}`}
        >
          {formatStatus(project.status)}
        </span>
      </div>

      {/* Progress */}
      <div>
        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Progress
          </span>
          <span className="font-medium text-foreground">
            {Math.round(project.progress_percent)}%
          </span>
        </div>
        <MiniProgressBar value={project.progress_percent} />
      </div>

      {/* Tasks */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Tasks:{' '}
          <span className="font-medium text-foreground">
            {project.completed_task_count}/{project.task_count}
          </span>
        </span>
        {project.days_remaining !== null && (
          <span className="flex items-center gap-1">
            <CalendarClock className="h-3 w-3" />
            <span
              className={project.days_remaining <= 7 ? 'font-medium text-red-500' : 'text-muted-foreground'}
            >
              {project.days_remaining}d left
            </span>
          </span>
        )}
      </div>

      {/* Budget */}
      {project.budget !== null && (
        <div>
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>Budget</span>
            <span>{budgetPct !== null ? `${Math.round(budgetPct)}%` : '—'}</span>
          </div>
          <MiniProgressBar
            value={budgetPct ?? 0}
            colorClass={
              budgetPct !== null && budgetPct > 90
                ? 'bg-red-500'
                : budgetPct !== null && budgetPct > 70
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{formatMoney(project.budget_spent, project.currency)}</span>
            <span>{formatMoney(project.budget, project.currency)}</span>
          </div>
        </div>
      )}
    </Link>
  )
}

interface ActiveProjectsGridProps {
  projects: ActiveProjectSummary[]
}

export function ActiveProjectsGrid({ projects }: ActiveProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
        No active projects. Create your first project to get started.
      </div>
    )
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  )
}
