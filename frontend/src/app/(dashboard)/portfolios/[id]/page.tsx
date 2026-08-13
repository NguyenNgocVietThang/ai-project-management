'use client'

import { ArrowLeft, CalendarDays, FolderKanban, Pencil, Trash2, WalletCards } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { DeletePortfolioDialog } from '@/features/portfolios/components/DeletePortfolioDialog'
import { PortfolioForm } from '@/features/portfolios/components/PortfolioForm'
import { useDeletePortfolio, usePortfolio, useUpdatePortfolio } from '@/features/portfolios/hooks/usePortfolios'
import { formatDate, formatMoney, formatStatus } from '@/lib/format'
import { getApiErrorMessage } from '@/types/api.types'
import type { PortfolioUpdate } from '@/types/portfolio.types'

export default function PortfolioDetailPage() {
  const id = Number(useParams<{ id: string }>().id)
  const router = useRouter()
  const query = usePortfolio(id)
  const updateMutation = useUpdatePortfolio()
  const deleteMutation = useDeletePortfolio()
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  if (query.isLoading) return <LoadingState label="Loading portfolio…" />
  if (query.isError || !query.data) return <ErrorState message={getApiErrorMessage(query.error, 'Portfolio not found.')} />
  const portfolio = query.data
  return <div className="space-y-6">
    <Link href="/portfolios" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to portfolios</Link>
    <section className="rounded-2xl border bg-card p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{formatStatus(portfolio.status)}</span><span className="text-xs text-muted-foreground">Portfolio #{portfolio.id}</span></div><h1 className="mt-3 text-3xl font-semibold tracking-tight">{portfolio.name}</h1><p className="mt-2 max-w-3xl text-sm text-muted-foreground">{portfolio.description || 'No description provided.'}</p></div><div className="flex gap-2">{portfolio.capabilities.can_update && <Button variant="outline" className="w-auto" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" />Edit</Button>}{portfolio.capabilities.can_delete && <Button variant="destructive" className="w-auto" onClick={() => setDeleting(true)}><Trash2 className="h-4 w-4" />Delete</Button>}</div></div></section>
    <div className="grid gap-4 md:grid-cols-3"><Metric icon={<FolderKanban className="h-5 w-5" />} label="Projects" value={portfolio.project_count.toString()} /><Metric icon={<WalletCards className="h-5 w-5" />} label="Budget" value={formatMoney(portfolio.budget, portfolio.currency)} /><Metric icon={<CalendarDays className="h-5 w-5" />} label="Timeline" value={`${formatDate(portfolio.start_date)} – ${formatDate(portfolio.end_date)}`} /></div>
    <section className="rounded-xl border bg-card p-5"><div className="mb-2 flex justify-between text-sm"><span>Average project progress</span><span className="font-medium">{Math.round(portfolio.progress_percent)}%</span></div><div className="h-2.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, portfolio.progress_percent))}%` }} /></div></section>
    <section><h2 className="mb-4 text-xl font-semibold">Projects</h2>{portfolio.projects.length === 0 ? <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No projects in this portfolio yet.</div> : <div className="grid gap-4 md:grid-cols-2">{portfolio.projects.map((project) => <Link key={project.id} href={`/projects/${project.id}/overview`} className="rounded-xl border bg-card p-5 transition hover:border-primary/40 hover:shadow-sm"><div className="flex items-center justify-between"><h3 className="font-semibold">{project.name}</h3><span className="text-xs text-muted-foreground">{formatStatus(project.status)}</span></div><p className="mt-2 text-xs text-muted-foreground">{formatStatus(project.methodology)} · {formatDate(project.end_date)}</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${project.progress_percent}%` }} /></div></Link>)}</div>}</section>
    <Modal open={editing} onClose={() => setEditing(false)} title="Edit portfolio"><PortfolioForm portfolio={portfolio} onCancel={() => setEditing(false)} isLoading={updateMutation.isPending} error={updateMutation.isError ? getApiErrorMessage(updateMutation.error) : null} onSubmit={async (body) => { await updateMutation.mutateAsync({ id, body: body as PortfolioUpdate }); setEditing(false) }} /></Modal>
    <DeletePortfolioDialog portfolio={deleting ? portfolio : null} onClose={() => setDeleting(false)} isLoading={deleteMutation.isPending} error={deleteMutation.isError ? getApiErrorMessage(deleteMutation.error) : null} onConfirm={async () => { await deleteMutation.mutateAsync(id); router.push('/portfolios') }} />
  </div>
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-xl border bg-card p-5"><div className="flex items-center gap-2 text-primary">{icon}<span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span></div><p className="mt-3 text-lg font-semibold">{value}</p></div> }
