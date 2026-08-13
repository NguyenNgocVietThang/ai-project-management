import { ArrowRight, CalendarDays, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatMoney, formatStatus } from '@/lib/format'
import type { Portfolio } from '@/types/portfolio.types'

interface PortfolioCardProps {
  portfolio: Portfolio
  onEdit: (portfolio: Portfolio) => void
  onDelete: (portfolio: Portfolio) => void
}

export function PortfolioCard({ portfolio, onEdit, onDelete }: PortfolioCardProps) {
  return (
    <article className="group rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {formatStatus(portfolio.status)}
          </span>
          <h2 className="mt-3 truncate text-lg font-semibold">{portfolio.name}</h2>
          <p className="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground">
            {portfolio.description || 'No description provided.'}
          </p>
        </div>
        {(portfolio.capabilities.can_update || portfolio.capabilities.can_delete) && (
          <div className="flex shrink-0 gap-1">
            {portfolio.capabilities.can_update && (
              <button type="button" onClick={() => onEdit(portfolio)} className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label={`Edit ${portfolio.name}`}>
                <Pencil className="h-4 w-4" />
              </button>
            )}
            {portfolio.capabilities.can_delete && (
              <button type="button" onClick={() => onDelete(portfolio)} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={`Delete ${portfolio.name}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div><p className="text-xs text-muted-foreground">Projects</p><p className="mt-1 font-medium">{portfolio.project_count}</p></div>
        <div><p className="text-xs text-muted-foreground">Budget</p><p className="mt-1 truncate font-medium">{formatMoney(portfolio.budget, portfolio.currency)}</p></div>
      </div>
      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs"><span className="text-muted-foreground">Average progress</span><span>{Math.round(portfolio.progress_percent)}%</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, portfolio.progress_percent))}%` }} /></div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        {formatDate(portfolio.start_date)} – {formatDate(portfolio.end_date)}
      </div>
      <Link href={`/portfolios/${portfolio.id}`} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline">
        View portfolio <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </article>
  )
}
