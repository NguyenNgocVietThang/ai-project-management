'use client'

import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import type { Portfolio } from '@/types/portfolio.types'

export function DeletePortfolioDialog({ portfolio, onClose, onConfirm, isLoading, error }: { portfolio: Portfolio | null; onClose: () => void; onConfirm: () => Promise<void>; isLoading: boolean; error?: string | null }) {
  return (
    <Modal open={Boolean(portfolio)} onClose={onClose} title="Delete portfolio" description="This is a reversible soft delete, but restore is not available in Phase 1." className="max-w-lg">
      {error && <Alert className="mb-4">{error}</Alert>}
      <p className="text-sm text-muted-foreground">Deleting <strong className="text-foreground">{portfolio?.name}</strong> also hides all projects inside it.</p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="sm:w-auto" onClick={onClose}>Cancel</Button>
        <Button type="button" variant="destructive" className="sm:w-auto" isLoading={isLoading} onClick={onConfirm}>Delete portfolio</Button>
      </div>
    </Modal>
  )
}
