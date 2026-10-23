'use client'

import { useFormatter, useTranslations } from 'next-intl'
import { useState } from 'react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { Modal } from '@/components/common/Modal'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'
import { useGrantInvestor, usePortfolioInvestors, useRevokeInvestor } from '../hooks/useInvestor'
import type { InvestorGrant } from '../types/investor.types'

/** Chủ portfolio hoặc admin cấp/thu hồi quyền xem chỉ đọc cho nhà đầu tư. */
export function PortfolioInvestorsCard({ portfolioId }: { portfolioId: number }) {
  const getApiErrorMessage = useApiErrorMessage()
  const t = useTranslations('investor.grants')
  const format = useFormatter()
  const grants = usePortfolioInvestors(portfolioId, true)
  const grantMutation = useGrantInvestor(portfolioId)
  const revokeMutation = useRevokeInvestor(portfolioId)
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState<InvestorGrant | null>(null)

  // Xóa lỗi cũ của lần thu hồi trước mỗi khi mở/đóng hộp thoại.
  const openRevoke = (grant: InvestorGrant) => {
    revokeMutation.reset()
    setPending(grant)
  }
  const closeRevoke = () => {
    revokeMutation.reset()
    setPending(null)
  }

  return (
    <Card as="section" aria-labelledby="portfolio-investors-title">
      <CardHeader className="mb-4">
        <CardTitle id="portfolio-investors-title" className="sm:text-h3">{t('title')}</CardTitle>
        <p className="text-body-sm text-muted-foreground">{t('description')}</p>
      </CardHeader>

      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          grantMutation.mutate(email.trim(), { onSuccess: () => setEmail('') })
        }}
      >
        <div className="flex-1">
          <Label htmlFor="investor-email">{t('email')}</Label>
          <Input id="investor-email" type="email" required value={email} onChange={(event) => { setEmail(event.target.value); if (grantMutation.isError) grantMutation.reset() }} />
        </div>
        <Button type="submit" fullWidth={false} isLoading={grantMutation.isPending}>{t('grant')}</Button>
      </form>
      {grantMutation.isError && <Alert className="mt-3">{getApiErrorMessage(grantMutation.error)}</Alert>}

      {grants.data && grants.data.length === 0 && <p className="mt-4 text-body-sm text-muted-foreground">{t('empty')}</p>}
      {grants.data && grants.data.length > 0 && (
        <ul className="mt-4 divide-y">
          {grants.data.map((grant) => (
            <li key={grant.user_id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{grant.full_name}</p>
                <p className="truncate text-caption text-muted-foreground">{grant.email} · {t('grantedOn', { date: format.dateTime(new Date(grant.granted_at), { dateStyle: 'medium' }) })}</p>
              </div>
              <Button variant="outline" fullWidth={false} onClick={() => openRevoke(grant)}>{t('revoke')}</Button>
            </li>
          ))}
        </ul>
      )}

      <Modal open={pending !== null} onClose={closeRevoke} title={t('revoke')}>
        <p className="text-body">{pending && t('revokeConfirm', { name: pending.full_name })}</p>
        {revokeMutation.isError && <Alert className="mt-3">{getApiErrorMessage(revokeMutation.error)}</Alert>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" fullWidth={false} onClick={closeRevoke}>{t('cancel')}</Button>
          <Button
            variant="destructive"
            fullWidth={false}
            isLoading={revokeMutation.isPending}
            onClick={() => {
              if (!pending) return
              revokeMutation.mutate(pending.user_id, { onSuccess: () => setPending(null) })
            }}
          >
            {t('revoke')}
          </Button>
        </div>
      </Modal>
    </Card>
  )
}
