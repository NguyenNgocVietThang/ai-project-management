'use client'

import { useTranslations } from 'next-intl'

import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import type { Portfolio } from '@/types/portfolio.types'

export function DeletePortfolioDialog({ portfolio, onClose, onConfirm, isLoading, error }: { portfolio: Portfolio | null; onClose: () => void; onConfirm: () => Promise<void>; isLoading: boolean; error?: string | null }) {
  const tw = useTranslations('workspaceUi')
  return (
    <Modal open={Boolean(portfolio)} onClose={onClose} title={tw('deletePortfolio')} description={tw('thisIsAReversibleSoftDeleteButRestoreIsNotAvailableInPhase1')} className="max-w-lg">
      {error && <Alert className="mb-4">{error}</Alert>}
      <p className="text-body-sm text-muted-foreground">{tw('deletePortfolioConfirmation', { name: portfolio?.name || '' })}</p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="sm:w-auto" onClick={onClose}>{tw('cancel')}</Button>
        <Button type="button" variant="destructive" className="sm:w-auto" isLoading={isLoading} onClick={onConfirm}>{tw('deletePortfolio')}</Button>
      </div>
    </Modal>
  )
}
