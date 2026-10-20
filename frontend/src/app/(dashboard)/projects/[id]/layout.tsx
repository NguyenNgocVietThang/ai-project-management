'use client'
import { useTranslations } from 'next-intl'

import { usePathname } from 'next/navigation'
import { useNumericParam } from '@/hooks/useNumericParam'
import { ErrorState } from '@/components/common/PageState'
import { useBreadcrumbLabel } from '@/components/layout/Breadcrumbs'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { SkeletonPageHeader, SkeletonRegion, Skeleton } from '@/components/ui/Skeleton'
import { ProjectNavigation } from '@/features/projects/components/ProjectNavigation'
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
      <SkeletonRegion label={tc('loading')} className="min-w-0 space-y-4">
        <SkeletonPageHeader />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </SkeletonRegion>
    )
  }
  if (query.isError || !query.data) return <ErrorState message={getApiErrorMessage(query.error, t('notFound'))} onRetry={() => void query.refetch()} retryLabel={tc('retry')} />

  const project = query.data

  return (
    <div className="min-w-0 space-y-4">
      {/* ===== Đầu trang dự án: trạng thái, phương pháp, tên, danh mục ===== */}
      <PageHeader
        title={project.name}
        description={project.portfolio_name || t('standalone')}
        meta={<><ProjectStatusBadge status={project.status} /><Badge tone="primary">{t.has(`methodologies.${project.methodology}`) ? t(`methodologies.${project.methodology}`) : formatStatus(project.methodology)}</Badge></>}
      />
      {/* ===== Thanh tab dính ngay dưới header ứng dụng (cao 64px) ===== */}
      <div className="sticky top-16 z-10 -mx-4 bg-background px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <ProjectNavigation projectId={id} pathname={pathname} unread={unread} />
      </div>
      <div>{children}</div>
    </div>
  )
}
