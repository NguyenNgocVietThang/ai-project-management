'use client'

import { useTranslations } from 'next-intl'
import { Briefcase } from 'lucide-react'
import { EmptyState } from '@/components/common/PageState'
import { Reveal } from '@/components/motion/RevealText'
import { PortfolioCard } from '@/features/portfolios/components/PortfolioCard'
import type { Portfolio } from '@/types/portfolio.types'

/** Lưới danh mục 1/2/3 cột; `emptyAction` là CTA hiển thị khi danh sách rỗng. */
export function PortfolioList({ portfolios, onEdit, onDelete, emptyAction }: { portfolios: Portfolio[]; onEdit: (portfolio: Portfolio) => void; onDelete: (portfolio: Portfolio) => void; emptyAction?: React.ReactNode }) {
  const tw = useTranslations('workspaceUi')
  if (portfolios.length === 0) {
    return <EmptyState icon={Briefcase} title={tw('noPortfoliosFound')} description={tw('createAPortfolioOrAdjustTheCurrentFilters')} action={emptyAction} />
  }
  return (
    <Reveal stagger={60} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {portfolios.map((portfolio) => <PortfolioCard key={portfolio.id} portfolio={portfolio} onEdit={onEdit} onDelete={onDelete} />)}
    </Reveal>
  )
}
