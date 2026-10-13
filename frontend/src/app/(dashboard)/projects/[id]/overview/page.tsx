'use client'

import { differenceInCalendarDays, parseISO } from 'date-fns'
import {
  CalendarClock,
  CheckCircle2,
  Users,
  Clock3,
  WalletCards,
  type LucideIcon,
} from 'lucide-react'
import { useNumericParam } from '@/hooks/useNumericParam'
import { ErrorState } from '@/components/common/PageState'
import { Reveal } from '@/components/motion/RevealText'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton, SkeletonRegion, SkeletonStatGrid, SkeletonText } from '@/components/ui/Skeleton'
import { useProjectStats } from '@/features/dashboard/hooks/useDashboard'
import { ProjectOverviewCharts } from './charts'
import { XlsxExportButton } from '@/features/reports/components/XlsxExportButton'
import { useProjectActivity, useProjectDetail } from '@/features/projects/hooks/useProjects'
import { formatDate, formatMoney, formatStatus } from '@/lib/format'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/types/api.types'

// ── Thẻ thống kê ───────────────────────────────────────────────────────────

function Stat({ icon: Icon, label, value, className, style }: { icon: LucideIcon; label: string; value: string; className?: string; style?: React.CSSProperties }) {
  return (
    <Card className={cn('p-4 sm:p-6', className)} style={style}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-body-sm font-medium text-muted-foreground">{label}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
          <Icon className="h-4 w-4 text-accent-foreground" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 break-words text-h4 tabular-nums sm:text-h3">{value}</p>
    </Card>
  )
}

/** Dòng trống trong card (chưa có giai đoạn / cột mốc / hoạt động). */
function EmptyRow({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg border border-dashed p-6 text-center text-body-sm text-muted-foreground">{children}</p>
}

// ── Trang chính ────────────────────────────────────────────────────────────

export default function ProjectOverviewPage() {
  const id = useNumericParam()
  const projectQuery = useProjectDetail(id)
  const activityQuery = useProjectActivity(id)
  const statsQuery = useProjectStats(id)

  // Khung xương cùng bố cục trang thật: khối tiến độ, 4 chỉ số, 2 card
  if (projectQuery.isLoading) {
    return (
      <SkeletonRegion label="Loading overview…" className="space-y-6">
        <Skeleton className="h-32 rounded-xl" />
        <SkeletonStatGrid />
        <div className="grid gap-6 xl:grid-cols-2"><Skeleton className="h-56 rounded-xl" /><Skeleton className="h-56 rounded-xl" /></div>
      </SkeletonRegion>
    )
  }
  if (projectQuery.isError || !projectQuery.data)
    return <ErrorState message={getApiErrorMessage(projectQuery.error)} onRetry={() => void projectQuery.refetch()} />

  const project = projectQuery.data
  const stats = statsQuery.data
  const daysRemaining = project.end_date
    ? Math.max(0, differenceInCalendarDays(parseISO(project.end_date), new Date()))
    : null

  return (
    <div className="space-y-6">
      {/* Xuất báo cáo XLSX của dự án */}
      <div className="flex justify-end">
        <XlsxExportButton projectId={id} />
      </div>
      {/* ── Tiến độ theo dòng thời gian ───────────────────────────────── */}
      <Card as="section">
        <p className="max-w-prose-ui text-body-sm text-muted-foreground">
          {project.description || 'No project description has been added.'}
        </p>
        <div className="mt-6 flex justify-between gap-3 text-caption text-muted-foreground">
          <span>{formatDate(project.start_date)}</span>
          <span className="font-medium text-foreground tabular-nums">{Math.round(project.progress_percent)}% complete</span>
          <span>{formatDate(project.end_date)}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out-soft"
            style={{ width: `${Math.min(100, Math.max(0, project.progress_percent))}%` }}
          />
        </div>
      </Card>

      {/* ── Hàng thống kê ─────────────────────────────────────────────── */}
      <Reveal stagger={60} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={CheckCircle2} label="Tasks completed"
          value={`${project.completed_task_count} / ${project.task_count}`} />
        <Stat icon={WalletCards} label="Budget used"
          value={`${formatMoney(project.budget_spent, project.currency)} / ${formatMoney(project.budget, project.currency)}`} />
        <Stat icon={Users} label="Members"
          value={project.member_count.toString()} />
        <Stat icon={CalendarClock} label="Days remaining"
          value={daysRemaining === null ? 'Not set' : daysRemaining.toString()} />
      </Reveal>

      {stats && <ProjectOverviewCharts stats={stats} />}

      {/* ── Giai đoạn & Cột mốc ───────────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card as="section">
          <CardHeader><CardTitle>Phases</CardTitle></CardHeader>
          <div className="space-y-3">
            {project.phases.length === 0 && <EmptyRow>No phases yet.</EmptyRow>}
            {project.phases
              .sort((a, b) => a.order_index - b.order_index)
              .map((phase) => (
                <div key={phase.id} className="rounded-lg border p-3 transition-colors hover:bg-muted/40">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="min-w-0 truncate text-body-sm font-medium">{phase.name}</h3>
                    <Badge size="sm">{formatStatus(phase.status)}</Badge>
                  </div>
                  <p className="mt-1 text-caption text-muted-foreground">
                    {formatDate(phase.start_date)} – {formatDate(phase.end_date)}
                  </p>
                </div>
              ))}
          </div>
        </Card>

        <Card as="section">
          <CardHeader><CardTitle>Milestones</CardTitle></CardHeader>
          <div className="space-y-3">
            {project.milestones.length === 0 && <EmptyRow>No milestones yet.</EmptyRow>}
            {project.milestones.map((milestone) => (
              <div key={milestone.id} className="flex gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40">
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <div className="min-w-0">
                  <h3 className="text-body-sm font-medium">{milestone.name}</h3>
                  <p className="mt-1 text-caption text-muted-foreground">
                    {formatDate(milestone.due_date)} · {formatStatus(milestone.status)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Hoạt động gần đây ─────────────────────────────────────────── */}
      <Card as="section">
        <CardHeader className="items-center justify-start gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Clock3 className="h-4 w-4 text-accent-foreground" aria-hidden="true" />
          </span>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {activityQuery.isLoading && (
            <SkeletonRegion label="Loading activity…">
              <SkeletonText lines={4} />
            </SkeletonRegion>
          )}
          {activityQuery.data?.length === 0 && <EmptyRow>No activity has been recorded.</EmptyRow>}
          {activityQuery.data?.map((event) => (
            <div key={event.id} className="flex gap-3 border-b pb-3 last:border-0 last:pb-0">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <div className="min-w-0">
                <p className="break-words text-body-sm">{event.description || formatStatus(event.action)}</p>
                <p className="mt-1 text-caption text-muted-foreground">
                  {event.actor?.full_name || 'System'} · {formatDate(event.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
