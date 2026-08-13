'use client'

import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { DeletePortfolioDialog } from '@/features/portfolios/components/DeletePortfolioDialog'
import { PortfolioForm } from '@/features/portfolios/components/PortfolioForm'
import { PortfolioList } from '@/features/portfolios/components/PortfolioList'
import { useCreatePortfolio, useDeletePortfolio, usePortfolios, useUpdatePortfolio } from '@/features/portfolios/hooks/usePortfolios'
import { getApiErrorMessage } from '@/types/api.types'
import type { Portfolio, PortfolioCreate, PortfolioStatus, PortfolioUpdate } from '@/types/portfolio.types'

export default function PortfoliosPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<PortfolioStatus | ''>('')
  const [editing, setEditing] = useState<Portfolio | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Portfolio | null>(null)
  const query = usePortfolios({ page_size: 100, search: search || undefined, status: status || undefined })
  const createMutation = useCreatePortfolio()
  const updateMutation = useUpdatePortfolio()
  const deleteMutation = useDeletePortfolio()

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-primary">Portfolio management</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Portfolios</h1><p className="mt-2 text-sm text-muted-foreground">Group related projects, budgets, and timelines in one place.</p></div><Button className="sm:w-auto" onClick={() => setCreating(true)}><Plus className="h-4 w-4" />New portfolio</Button></div>
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search portfolios" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search portfolios" /></div><select aria-label="Filter portfolio status" value={status} onChange={(event) => setStatus(event.target.value as PortfolioStatus | '')} className="h-11 rounded-md border bg-background px-3 text-sm sm:w-48"><option value="">All statuses</option><option value="PLANNING">Planning</option><option value="ACTIVE">Active</option><option value="ARCHIVED">Archived</option></select></div>
    {query.isLoading && <LoadingState label="Loading portfolios…" />}
    {query.isError && <ErrorState message={getApiErrorMessage(query.error)} />}
    {query.data && <PortfolioList portfolios={query.data.items} onEdit={setEditing} onDelete={setDeleting} />}
    <Modal open={creating} onClose={() => setCreating(false)} title="New portfolio" description="Create a container for related projects and investment goals."><PortfolioForm onCancel={() => setCreating(false)} isLoading={createMutation.isPending} error={createMutation.isError ? getApiErrorMessage(createMutation.error) : null} onSubmit={async (body) => { await createMutation.mutateAsync(body as PortfolioCreate); setCreating(false) }} /></Modal>
    <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit portfolio" description="Update portfolio scope, timeline, budget, or status.">{editing && <PortfolioForm portfolio={editing} onCancel={() => setEditing(null)} isLoading={updateMutation.isPending} error={updateMutation.isError ? getApiErrorMessage(updateMutation.error) : null} onSubmit={async (body) => { await updateMutation.mutateAsync({ id: editing.id, body: body as PortfolioUpdate }); setEditing(null) }} />}</Modal>
    <DeletePortfolioDialog portfolio={deleting} onClose={() => setDeleting(null)} isLoading={deleteMutation.isPending} error={deleteMutation.isError ? getApiErrorMessage(deleteMutation.error) : null} onConfirm={async () => { if (deleting) { await deleteMutation.mutateAsync(deleting.id); setDeleting(null) } }} />
  </div>
}
