'use client'

import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { Modal } from '@/components/common/Modal'
import { Select } from '@/components/ui/Select'
import { parseImpactError } from '@/features/change-requests/approvals'
import { useSetManualImpactReport } from '@/features/change-requests/hooks/useChangeRequests'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'
import { IMPACT_LEVELS, type ImpactLevel, type RiskLevel } from '@/types/change-request.types'

const RISK_LEVELS: readonly RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const RISK_LABEL = { LOW: 'riskLow', MEDIUM: 'riskMedium', HIGH: 'riskHigh', CRITICAL: 'riskCritical' } as const
const SUMMARY_MAX = 5000

const TEXTAREA_CLASSES =
  'w-full rounded-lg border border-input bg-card px-3 py-2 text-body sm:text-body-sm shadow-xs transition-[border-color,box-shadow] duration-150 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-destructive'

/** PM nhập đánh giá tác động thủ công — đường dự phòng khi AI lỗi hoặc hết hạn mức. */
export function ManualImpactReportModal({
  changeRequestId,
  open,
  onClose,
}: {
  changeRequestId: number
  open: boolean
  onClose: () => void
}) {
  const t = useTranslations('impactControl')
  const tw = useTranslations('workflowUi')
  const getApiErrorMessage = useApiErrorMessage()
  const ids = { risk: useId(), days: useId(), cost: useId(), summary: useId(), summaryError: useId(), level: useId() }
  const mutation = useSetManualImpactReport(changeRequestId)
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('MEDIUM')
  const [days, setDays] = useState('0')
  const [cost, setCost] = useState('0')
  const [summary, setSummary] = useState('')
  const [level, setLevel] = useState<ImpactLevel | ''>('')
  const [touched, setTouched] = useState(false)

  const close = () => {
    setRiskLevel('MEDIUM')
    setDays('0')
    setCost('0')
    setSummary('')
    setLevel('')
    setTouched(false)
    mutation.reset()
    onClose()
  }

  const summaryInvalid = touched && !summary.trim()

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (!summary.trim()) return
    mutation.mutate(
      {
        risk_level: riskLevel,
        schedule_impact_days: Math.trunc(Number(days) || 0),
        cost_impact: Number(cost) || 0,
        summary: summary.trim(),
        suggested_impact_level: level || null,
      },
      { onSuccess: close },
    )
  }

  const code = mutation.isError ? parseImpactError(mutation.error) : null

  return (
    <Modal open={open} onClose={close} title={t('manualTitle')} description={t('manualDescription')}>
      <form className="space-y-4" noValidate onSubmit={submit}>
        {mutation.isError && <Alert>{code ? t(`errors.${code}`) : getApiErrorMessage(mutation.error)}</Alert>}
        <div>
          <Label htmlFor={ids.risk}>{t('riskLevel')}</Label>
          <Select id={ids.risk} value={riskLevel} onChange={(event) => setRiskLevel(event.target.value as RiskLevel)}>
            {RISK_LEVELS.map((item) => (
              <option key={item} value={item}>{tw(RISK_LABEL[item])}</option>
            ))}
          </Select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor={ids.days}>{t('scheduleDays')}</Label>
            <Input id={ids.days} type="number" step={1} min={-3650} max={3650} value={days} onChange={(event) => setDays(event.target.value)} />
          </div>
          <div>
            <Label htmlFor={ids.cost}>{t('costImpact')}</Label>
            <Input id={ids.cost} type="number" step="any" value={cost} onChange={(event) => setCost(event.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor={ids.summary}>{t('summary')}</Label>
          <textarea
            id={ids.summary}
            className={TEXTAREA_CLASSES}
            rows={4}
            required
            maxLength={SUMMARY_MAX}
            aria-invalid={summaryInvalid}
            aria-describedby={summaryInvalid ? ids.summaryError : undefined}
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />
          {summaryInvalid && (
            <p id={ids.summaryError} role="alert" className="mt-1 text-body-sm text-destructive">{t('summaryMissing')}</p>
          )}
        </div>
        <div>
          <Label htmlFor={ids.level}>{t('suggestedLevel')}</Label>
          <Select id={ids.level} value={level} onChange={(event) => setLevel(event.target.value as ImpactLevel | '')}>
            <option value="">{t('noneOption')}</option>
            {IMPACT_LEVELS.map((item) => (
              <option key={item} value={item}>{t(`level.${item}`)}</option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" fullWidth={false} className="w-full sm:w-auto" onClick={close}>{t('cancel')}</Button>
          <Button type="submit" fullWidth={false} className="w-full sm:w-auto" isLoading={mutation.isPending}>{t('save')}</Button>
        </div>
      </form>
    </Modal>
  )
}
