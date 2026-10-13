'use client'

import { ArrowLeft, CalendarDays, CheckCircle2, FolderKanban, Gauge, Pencil, PlayCircle, Trash2, WalletCards, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useNumericParam } from '@/hooks/useNumericParam'
import { useState } from 'react'
import { Button, ButtonLink } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { useBreadcrumbLabel } from '@/components/layout/Breadcrumbs'
import { Reveal } from '@/components/motion/RevealText'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader, SectionHeader } from '@/components/ui/PageHeader'
import { DeletePortfolioDialog } from '@/features/portfolios/components/DeletePortfolioDialog'
import { PortfolioForm } from '@/features/portfolios/components/PortfolioForm'
import { PortfolioStatusBadge } from '@/features/portfolios/components/PortfolioStatusBadge'
import { ProjectStatusBadge } from '@/features/projects/components/ProjectStatusBadge'
import { usePortfolioHealth } from '@/features/dashboard/hooks/useDashboard'
import { useDeletePortfolio, usePortfolio, useUpdatePortfolio } from '@/features/portfolios/hooks/usePortfolios'
import { formatDate, formatMoney, formatStatus } from '@/lib/format'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/types/api.types'
import type { PortfolioUpdate } from '@/types/portfolio.types'

/** Thanh tiến độ cao 8px, chiều rộng chuyển động mượt 500ms. */
function ProgressBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out-soft" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function PortfolioDetailPage() {
  const id = useNumericParam()
  const router = useRouter()
  const query = usePortfolio(id)
  const health = usePortfolioHealth(id)
  const updateMutation = useUpdatePortfolio()
  const deleteMutation = useDeletePortfolio()
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  // Hiện tên danh mục trên breadcrumb thay cho mã số
  useBreadcrumbLabel(`/portfolios/${id}`, query.data?.name)
  if (query.isLoading) return <LoadingState variant="page" label="Loading portfolio…" />
  if (query.isError || !query.data) return <ErrorState message={getApiErrorMessage(query.error, 'Portfolio not found.')} onRetry={() => void query.refetch()} />
  const portfolio = query.data
  return <div className="space-y-8">
    <Link href="/portfolios" className="-mb-4 inline-flex min-h-11 items-center gap-2 text-body-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to portfolios</Link>

    <PageHeader
      meta={<><PortfolioStatusBadge status={portfolio.status} /><span className="text-caption text-muted-foreground">Portfolio #{portfolio.id}</span></>}
      title={portfolio.name}
      description={portfolio.description || 'No description provided.'}
      actions={(portfolio.capabilities.can_update || portfolio.capabilities.can_delete) && <>
        {portfolio.capabilities.can_update && <Button variant="outline" fullWidth={false} onClick={() => setEditing(true)}><Pencil className="h-4 w-4" aria-hidden="true" />Edit</Button>}
        {portfolio.capabilities.can_delete && <Button variant="destructive" fullWidth={false} onClick={() => setDeleting(true)}><Trash2 className="h-4 w-4" aria-hidden="true" />Delete</Button>}
      </>}
    />

    <Reveal stagger={60} className="grid gap-4 md:grid-cols-3">
      <Metric icon={FolderKanban} label="Projects" value={portfolio.project_count.toString()} />
      <Metric icon={WalletCards} label="Budget" value={formatMoney(portfolio.budget, portfolio.currency)} />
      <Metric icon={CalendarDays} label="Timeline" value={`${formatDate(portfolio.start_date)} – ${formatDate(portfolio.end_date)}`} />
    </Reveal>

    <Card>
      <div className="mb-2 flex justify-between gap-3 text-body-sm"><span className="text-muted-foreground">Average project progress</span><span className="font-medium tabular-nums">{Math.round(portfolio.progress_percent)}%</span></div>
      <ProgressBar value={portfolio.progress_percent} />
    </Card>

    {health.data && <Card as="section" aria-labelledby="portfolio-health-title">
      <CardHeader className="mb-6"><CardTitle id="portfolio-health-title" className="sm:text-h3">Portfolio health</CardTitle></CardHeader>
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric icon={PlayCircle} label="Active" value={health.data.active_projects.toString()} nested />
        <Metric icon={CheckCircle2} label="Completed" value={health.data.completed_projects.toString()} nested />
        <Metric icon={Gauge} label="Overall progress" value={`${Math.round(health.data.overall_progress)}%`} nested />
      </div>
      {health.data.projects.length > 0 && <Card flush className="mt-6 overflow-hidden shadow-none">
        {/* Bảng tự cuộn ngang trong khung, trang không bị cuộn ngang */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-body-sm">
            <thead className="bg-muted/50 text-left text-caption uppercase text-muted-foreground">
              <tr><th scope="col" className="px-4 py-3 font-medium">Project</th><th scope="col" className="px-4 py-3 font-medium">Progress</th><th scope="col" className="px-4 py-3 font-medium">Overdue</th><th scope="col" className="px-4 py-3 font-medium">Budget used</th></tr>
            </thead>
            <tbody>
              {health.data.projects.map(item => <tr key={item.project_id} className="border-t transition-colors hover:bg-muted/40">
                <td className="px-4 py-3 font-medium">{item.project_name}</td>
                <td className="px-4 py-3 tabular-nums">{Math.round(item.progress_percent)}%</td>
                <td className="px-4 py-3 tabular-nums">{item.overdue_tasks > 0 ? <span className="font-medium text-destructive">{item.overdue_tasks}</span> : '0'}</td>
                <td className="px-4 py-3 tabular-nums">{item.budget_utilization_pct === null ? '—' : `${Math.round(item.budget_utilization_pct)}%`}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </Card>}
    </Card>}

    <section aria-labelledby="portfolio-projects-title">
      <SectionHeader id="portfolio-projects-title" title="Projects" />
      {portfolio.projects.length === 0
        ? <EmptyState icon={FolderKanban} title="No projects in this portfolio yet." description="Projects you add to this portfolio will appear here." action={<ButtonLink href="/projects">View projects</ButtonLink>} />
        : <Reveal stagger={60} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{portfolio.projects.map((project) => <Card key={project.id} as="article" interactive className="group">
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 text-h4">
                {/* Liên kết kéo giãn phủ toàn thẻ: cả thẻ bấm được nhưng chỉ một điểm dừng Tab */}
                <Link href={`/projects/${project.id}/overview`} className="transition-colors after:absolute after:inset-0 after:rounded-xl group-hover:text-primary focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring">{project.name}</Link>
              </h3>
              <ProjectStatusBadge status={project.status} />
            </div>
            <p className="mt-2 text-caption text-muted-foreground">{formatStatus(project.methodology)} · {formatDate(project.end_date)}</p>
            <div className="mt-4"><ProgressBar value={project.progress_percent} /></div>
          </Card>)}</Reveal>}
    </section>

    <Modal open={editing} onClose={() => setEditing(false)} title="Edit portfolio"><PortfolioForm portfolio={portfolio} onCancel={() => setEditing(false)} isLoading={updateMutation.isPending} error={updateMutation.isError ? getApiErrorMessage(updateMutation.error) : null} onSubmit={async (body) => { await updateMutation.mutateAsync({ id, body: body as PortfolioUpdate }); setEditing(false) }} /></Modal>
    <DeletePortfolioDialog portfolio={deleting ? portfolio : null} onClose={() => setDeleting(false)} isLoading={deleteMutation.isPending} error={deleteMutation.isError ? getApiErrorMessage(deleteMutation.error) : null} onConfirm={async () => { await deleteMutation.mutateAsync(id); router.push('/portfolios') }} />
  </div>
}

/** Ô chỉ số: icon trong ô accent nhỏ, nhãn và giá trị. `nested` dùng khi nằm trong một Card khác. */
function Metric({ icon: Icon, label, value, nested = false, className, style }: { icon: LucideIcon; label: string; value: string; nested?: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <Card className={cn(nested && 'bg-muted/30 p-4 shadow-none sm:p-4', className)} style={style}>
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent"><Icon className="h-4 w-4 text-accent-foreground" aria-hidden="true" /></span>
        <span className="text-caption font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
      <p className="mt-4 break-words text-h4 tabular-nums sm:text-h3">{value}</p>
    </Card>
  )
}
