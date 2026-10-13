'use client'

import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
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

  const newPortfolioButton = (
    <Button fullWidth={false} onClick={() => setCreating(true)}>
      <Plus className="h-4 w-4" aria-hidden="true" />
      New portfolio
    </Button>
  )

  return <div className="space-y-8">
    <PageHeader
      eyebrow="Portfolio management"
      title="Portfolios"
      description="Group related projects, budgets, and timelines in one place."
      actions={newPortfolioButton}
    />
    {/* Thanh bộ lọc: tìm kiếm + trạng thái */}
    <Card className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input aria-label="Search portfolios" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search portfolios" />
      </div>
      <Select aria-label="Filter portfolio status" value={status} onChange={(event) => setStatus(event.target.value as PortfolioStatus | '')}>
        <option value="">All statuses</option>
        <option value="PLANNING">Planning</option>
        <option value="ACTIVE">Active</option>
        <option value="ARCHIVED">Archived</option>
      </Select>
    </Card>
    {query.isLoading && <LoadingState variant="cards" label="Loading portfolios…" />}
    {query.isError && <ErrorState message={getApiErrorMessage(query.error)} onRetry={() => void query.refetch()} />}
    {query.data && <PortfolioList portfolios={query.data.items} onEdit={setEditing} onDelete={setDeleting} emptyAction={newPortfolioButton} />}
    <Modal open={creating} onClose={() => setCreating(false)} title="New portfolio" description="Create a container for related projects and investment goals."><PortfolioForm onCancel={() => setCreating(false)} isLoading={createMutation.isPending} error={createMutation.isError ? getApiErrorMessage(createMutation.error) : null} onSubmit={async (body) => { await createMutation.mutateAsync(body as PortfolioCreate); setCreating(false) }} /></Modal>
    <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit portfolio" description="Update portfolio scope, timeline, budget, or status.">{editing && <PortfolioForm portfolio={editing} onCancel={() => setEditing(null)} isLoading={updateMutation.isPending} error={updateMutation.isError ? getApiErrorMessage(updateMutation.error) : null} onSubmit={async (body) => { await updateMutation.mutateAsync({ id: editing.id, body: body as PortfolioUpdate }); setEditing(null) }} />}</Modal>
    <DeletePortfolioDialog portfolio={deleting} onClose={() => setDeleting(null)} isLoading={deleteMutation.isPending} error={deleteMutation.isError ? getApiErrorMessage(deleteMutation.error) : null} onConfirm={async () => { if (deleting) { await deleteMutation.mutateAsync(deleting.id); setDeleting(null) } }} />
  </div>
}
