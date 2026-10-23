'use client'

import { useLocale, useTranslations } from 'next-intl'

import { ArrowRight, CalendarDays, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/ui/Card'
import { PortfolioStatusBadge } from '@/features/portfolios/components/PortfolioStatusBadge'
import { formatDate, formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Portfolio } from '@/types/portfolio.types'

interface PortfolioCardProps {
  portfolio: Portfolio
  onEdit: (portfolio: Portfolio) => void
  onDelete: (portfolio: Portfolio) => void
  /** Nhận từ Reveal để gắn hiệu ứng trồi lên theo nhịp. */
  className?: string
  style?: CSSProperties
}

export function PortfolioCard({ portfolio, onEdit, onDelete, className, style }: PortfolioCardProps) {
  const locale = useLocale()
  const tw = useTranslations('workspaceUi')
  const progress = Math.min(100, Math.max(0, portfolio.progress_percent))
  return (
    <Card as="article" interactive className={cn('group flex flex-col', className)} style={style}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <PortfolioStatusBadge status={portfolio.status} />
          <h2 className="mt-3 truncate text-h4 sm:text-h3">
            {/* Liên kết kéo giãn phủ toàn thẻ: cả thẻ bấm được nhưng chỉ một điểm dừng Tab */}
            <Link
              href={`/portfolios/${portfolio.id}`}
              className="transition-colors after:absolute after:inset-0 after:rounded-xl group-hover:text-primary focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {portfolio.name}
            </Link>
          </h2>
          <p className="mt-1 line-clamp-2 min-h-10 text-body-sm text-muted-foreground">
            {portfolio.description || tw('noDescriptionProvided')}
          </p>
        </div>
        {(portfolio.capabilities.can_update || portfolio.capabilities.can_delete) && (
          // z-10 để nút nổi trên liên kết kéo giãn và vẫn bấm được
          <div className="relative z-10 -mr-2 -mt-2 flex shrink-0 gap-1">
            {portfolio.capabilities.can_update && (
              <Button type="button" variant="ghost" size="icon" fullWidth={false} onClick={() => onEdit(portfolio)} className="text-muted-foreground" aria-label={tw('editNamed', { name: portfolio.name })}>
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
            {portfolio.capabilities.can_delete && (
              <Button type="button" variant="ghost" size="icon" fullWidth={false} onClick={() => onDelete(portfolio)} className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={tw('deleteNamed', { name: portfolio.name })}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        )}
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-4">
        <div><dt className="text-caption text-muted-foreground">{tw('projects')}</dt><dd className="mt-1 text-body-sm font-medium tabular-nums">{portfolio.project_count}</dd></div>
        <div className="min-w-0"><dt className="text-caption text-muted-foreground">{tw('budget')}</dt><dd className="mt-1 truncate text-body-sm font-medium tabular-nums">{formatMoney(portfolio.budget, portfolio.currency, locale)}</dd></div>
      </dl>
      <div className="mt-4">
        <div className="mb-2 flex justify-between text-caption"><span className="text-muted-foreground">{tw('averageProgress')}</span><span className="font-medium tabular-nums">{Math.round(portfolio.progress_percent)}%</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out-soft" style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-caption text-muted-foreground">
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        {formatDate(portfolio.start_date, locale)} – {formatDate(portfolio.end_date, locale)}
      </div>
      {/* Gợi ý trực quan; điều hướng thực hiện qua liên kết tiêu đề (tránh hai điểm dừng Tab) */}
      <span aria-hidden="true" className="mt-auto inline-flex items-center gap-2 pt-6 text-body-sm font-medium text-primary">
        {tw('viewPortfolio')} <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Card>
  )
}
