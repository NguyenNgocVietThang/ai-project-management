import { EmptyState } from '@/components/common/PageState'
import { PortfolioCard } from '@/features/portfolios/components/PortfolioCard'
import type { Portfolio } from '@/types/portfolio.types'

export function PortfolioList({ portfolios, onEdit, onDelete }: { portfolios: Portfolio[]; onEdit: (portfolio: Portfolio) => void; onDelete: (portfolio: Portfolio) => void }) {
  if (portfolios.length === 0) {
    return <EmptyState title="No portfolios found" description="Create a portfolio or adjust the current filters." />
  }
  return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{portfolios.map((portfolio) => <PortfolioCard key={portfolio.id} portfolio={portfolio} onEdit={onEdit} onDelete={onDelete} />)}</div>
}
