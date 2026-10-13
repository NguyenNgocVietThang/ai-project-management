'use client'
import { useTranslations } from 'next-intl'

import { BarChart3, Clock3, FileEdit, FileText, GanttChartSquare, GitBranch, History, ListTodo, MessageSquare, Network, Settings, Sparkles, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useNumericParam } from '@/hooks/useNumericParam'
import { ErrorState } from '@/components/common/PageState'
import { useBreadcrumbLabel } from '@/components/layout/Breadcrumbs'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { SkeletonPageHeader, SkeletonRegion, Skeleton } from '@/components/ui/Skeleton'
import { TabNav } from '@/components/ui/TabNav'
import { useChatUnreadCount } from '@/features/chat/hooks/useChat'
import { ProjectStatusBadge } from '@/features/projects/components/ProjectStatusBadge'
import { useProjectDetail } from '@/features/projects/hooks/useProjects'
import { formatStatus } from '@/lib/format'
import { getApiErrorMessage } from '@/types/api.types'

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const id = useNumericParam()
  const pathname = usePathname()
  const query = useProjectDetail(id)
  const unread = useChatUnreadCount(id).data?.unread_count ?? 0
  const t = useTranslations('project')
  const tc = useTranslations('common')
  // Breadcrumb hiện tên dự án thay vì "#12".
  useBreadcrumbLabel(`/projects/${id}`, query.data?.name)

  if (query.isLoading) {
    return (
      <SkeletonRegion label={tc('loading')} className="space-y-6">
        <SkeletonPageHeader />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </SkeletonRegion>
    )
  }
  if (query.isError || !query.data) return <ErrorState message={getApiErrorMessage(query.error, t('notFound'))} onRetry={() => void query.refetch()} retryLabel={tc('retry')} />

  const project = query.data
  const base = `/projects/${id}`
  const links = [
    { href: `${base}/overview`, label: t('overview'), icon: BarChart3 },
    { href: `${base}/wbs`, label: t('wbs'), icon: Network },
    { href: `${base}/tasks`, label: t('tasks'), icon: ListTodo },
    { href: `${base}/gantt`, label: t('gantt'), icon: GanttChartSquare },
    { href: `${base}/timesheet`, label: t('timesheet'), icon: Clock3 },
    { href: `${base}/members`, label: t('members'), icon: Users },
    { href: `${base}/chat`, label: t('chat'), icon: MessageSquare, badge: unread },
    { href: `${base}/change-requests`, label: t('changeRequests'), icon: FileEdit },
    { href: `${base}/versions`, label: t('versions'), icon: History },
    { href: `${base}/documents`, label: t('documents'), icon: FileText },
    { href: `${base}/process`, label: t('process'), icon: GitBranch },
    { href: `${base}/ai-insights`, label: t('aiInsights'), icon: Sparkles },
    { href: `${base}/settings`, label: t('settings'), icon: Settings },
  ].map(link => ({ ...link, active: pathname.startsWith(link.href) }))

  return (
    <div className="space-y-6">
      {/* ===== Đầu trang dự án: trạng thái, phương pháp, tên, danh mục ===== */}
      <PageHeader
        title={project.name}
        description={project.portfolio_name || t('standalone')}
        meta={<><ProjectStatusBadge status={project.status} /><Badge tone="primary">{formatStatus(project.methodology)}</Badge></>}
      />
      {/* ===== Thanh tab dính ngay dưới header ứng dụng (cao 64px) ===== */}
      <div className="sticky top-16 z-10 -mx-4 bg-background/85 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <TabNav items={links} label={t('navigation')} />
      </div>
      <div>{children}</div>
    </div>
  )
}
