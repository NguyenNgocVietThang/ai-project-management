'use client'

import { useLocale, useTranslations } from 'next-intl'

import { ArrowRight, CalendarDays, Users } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ProjectStatusBadge } from '@/features/projects/components/ProjectStatusBadge'
import { formatDate, formatMoney, formatStatus } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Project } from '@/types/project.types'

/** Thẻ dự án; `className`/`style` nhận từ Reveal để gắn hiệu ứng trồi lên theo nhịp. */
export function ProjectCard({ project, className, style }: { project: Project; className?: string; style?: CSSProperties }) {
  const locale = useLocale()
  const tw = useTranslations('workspaceUi')
  const progress = Math.min(100, Math.max(0, project.progress_percent))
  return (
    <Card as="article" interactive className={cn('group flex h-full flex-col', className)} style={style}>
      <div className="flex flex-wrap items-center gap-2">
        <ProjectStatusBadge status={project.status} />
        <Badge tone="primary">{formatStatus(project.methodology, locale)}</Badge>
      </div>
      <h2 className="mt-4 text-h4 sm:text-h3">
        {/* Liên kết kéo giãn phủ toàn thẻ: cả thẻ bấm được nhưng chỉ một điểm dừng Tab */}
        <Link
          href={`/projects/${project.id}/overview`}
          className="transition-colors after:absolute after:inset-0 after:rounded-xl group-hover:text-primary focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
        >
          {project.name}
        </Link>
      </h2>
      <p className="mt-1 line-clamp-2 min-h-10 text-body-sm text-muted-foreground">{project.description || tw('noDescriptionProvided')}</p>
      <p className="mt-4 truncate text-caption text-muted-foreground">{project.portfolio_name || tw('standaloneProject')}</p>
      <div className="mt-4 flex items-center justify-between text-body-sm"><span className="text-muted-foreground">{tw('progress')}</span><span className="font-medium tabular-nums">{Math.round(project.progress_percent)}%</span></div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out-soft" style={{ width: `${progress}%` }} /></div>
      <dl className="mt-6 grid grid-cols-2 gap-4">
        <div className="min-w-0"><dt className="text-caption text-muted-foreground">{tw('budget')}</dt><dd className="mt-1 truncate text-body-sm font-medium tabular-nums">{formatMoney(project.budget, project.currency, locale)}</dd></div>
        <div><dt className="text-caption text-muted-foreground">{tw('members')}</dt><dd className="mt-1 flex items-center gap-1.5 text-body-sm font-medium tabular-nums"><Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />{project.member_count}</dd></div>
      </dl>
      <div className="mt-4 flex items-center gap-2 text-caption text-muted-foreground"><CalendarDays className="h-4 w-4" aria-hidden="true" />{formatDate(project.start_date, locale)} – {formatDate(project.end_date, locale)}</div>
      {/* Gợi ý trực quan; điều hướng thực hiện qua liên kết tiêu đề (tránh hai điểm dừng Tab) */}
      <span aria-hidden="true" className="mt-auto inline-flex items-center gap-2 pt-6 text-body-sm font-medium text-primary">
        {tw('openProject')} <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Card>
  )
}
