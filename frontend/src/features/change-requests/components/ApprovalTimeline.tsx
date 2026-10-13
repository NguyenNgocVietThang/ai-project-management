'use client'

import { useState } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import { Ban, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Spinner } from '@/components/common/Spinner'
import { readApiError, type ApprovalStep, type ApprovalStepStatus } from '@/features/change-requests/approvals'
import { useApprovalChain, useDecideApproval } from '@/features/change-requests/hooks/useApprovals'

const REASON_MAX = 2000

// Mỗi trạng thái có biểu tượng + nhãn chữ riêng, không chỉ dựa vào màu.
const STATUS_ICON: Record<ApprovalStepStatus, typeof Clock> = {
  PENDING: Clock,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
  CANCELLED: Ban,
}
const STATUS_CLASS: Record<ApprovalStepStatus, string> = {
  PENDING: 'text-muted-foreground',
  APPROVED: 'text-emerald-700 dark:text-emerald-300',
  REJECTED: 'text-destructive',
  CANCELLED: 'text-muted-foreground',
}

export function ApprovalTimeline({ changeRequestId }: { changeRequestId: number }) {
  const t = useTranslations('approvals')
  const format = useFormatter()
  const chain = useApprovalChain(changeRequestId)
  const decide = useDecideApproval(changeRequestId)
  const [approveStep, setApproveStep] = useState<ApprovalStep | null>(null)
  const [rejectStep, setRejectStep] = useState<ApprovalStep | null>(null)
  const [text, setText] = useState('')
  const [touched, setTouched] = useState(false)

  // Chuyển lỗi API thành thông báo thân thiện theo mã HTTP.
  const errorMessage = (error: unknown) => {
    const { status } = readApiError(error)
    if (status === 403) return t('errorForbidden')
    if (status === 409) return t('errorConflict')
    if (status === 404) return t('errorNotFound')
    return t('errorGeneric')
  }

  const close = () => {
    setApproveStep(null)
    setRejectStep(null)
    setText('')
    setTouched(false)
  }

  const submitApprove = () => {
    if (!approveStep) return
    const comment = text.trim() || null
    decide.mutate({ kind: 'approve', stepOrder: approveStep.step_order, comment }, { onSettled: close })
  }

  const submitReject = () => {
    setTouched(true)
    if (!rejectStep || !text.trim()) return
    decide.mutate({ kind: 'reject', stepOrder: rejectStep.step_order, reason: text.trim() }, { onSettled: close })
  }

  if (chain.isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="h-4 w-4" />
        {t('loading')}
      </div>
    )
  }
  if (chain.isError || !chain.data) {
    // CR nháp chưa có chuỗi duyệt: backend có thể trả 404.
    if (readApiError(chain.error).status === 404) {
      return <p className="text-sm text-muted-foreground">{t('empty')}</p>
    }
    return <Alert>{errorMessage(chain.error)}</Alert>
  }

  const steps = [...chain.data.steps].sort((a, b) => a.step_order - b.step_order)
  const rejectInvalid = touched && !text.trim()

  return (
    <section aria-labelledby="approval-title" className="space-y-3">
      <h3 id="approval-title" className="text-base font-semibold">{t('title')}</h3>
      {decide.isError && <Alert>{errorMessage(decide.error)}</Alert>}
      {steps.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      ) : (
        <ol className="space-y-3">
          {steps.map((step) => {
            const Icon = STATUS_ICON[step.status]
            const isCurrent = step.step_order === chain.data.current_step_order
            return (
              <li
                key={step.id}
                className={`rounded-lg border p-3 ${isCurrent ? 'border-primary' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon className={`h-5 w-5 shrink-0 ${STATUS_CLASS[step.status]}`} aria-hidden="true" />
                    <span className="font-medium">{t('stepLabel', { order: step.step_order, role: t(`role.${step.required_role}`) })}</span>
                    <span className={`text-sm ${STATUS_CLASS[step.status]}`}>{t(`status.${step.status}`)}</span>
                  </div>
                  {step.can_decide && (
                    <div className="flex w-full gap-2 sm:w-auto">
                      <Button type="button" className="flex-1 sm:w-auto" onClick={() => { close(); setApproveStep(step) }}>
                        {t('approve')}
                      </Button>
                      <Button type="button" variant="outline" className="flex-1 sm:w-auto" onClick={() => { close(); setRejectStep(step) }}>
                        {t('reject')}
                      </Button>
                    </div>
                  )}
                </div>
                {(step.approver_name || step.decided_at) && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {step.approver_name && t('decidedBy', { name: step.approver_name })}
                    {step.approver_name && step.decided_at && ' · '}
                    {step.decided_at && (
                      <time dateTime={step.decided_at}>
                        {format.dateTime(new Date(step.decided_at), { dateStyle: 'medium', timeStyle: 'short' })}
                      </time>
                    )}
                  </p>
                )}
                {step.comment && (
                  <p className="mt-1 break-words text-sm">
                    <span className="font-medium">{step.status === 'REJECTED' ? t('reasonLabel') : t('commentLabel')}: </span>
                    {step.comment}
                  </p>
                )}
              </li>
            )
          })}
        </ol>
      )}

      <Modal open={approveStep !== null} onClose={close} title={t('approveTitle')}>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); submitApprove() }}>
          <label className="block text-sm font-medium" htmlFor="approval-comment">{t('commentOptional')}</label>
          <textarea
            id="approval-comment"
            className="w-full rounded-md border bg-background p-2 text-sm"
            rows={3}
            maxLength={REASON_MAX}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" className="sm:w-auto" onClick={close}>{t('cancel')}</Button>
            <Button type="submit" className="sm:w-auto" isLoading={decide.isPending}>{t('confirmApprove')}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={rejectStep !== null} onClose={close} title={t('rejectTitle')}>
        <form className="space-y-3" noValidate onSubmit={(e) => { e.preventDefault(); submitReject() }}>
          <label className="block text-sm font-medium" htmlFor="approval-reason">{t('reasonRequired')}</label>
          <textarea
            id="approval-reason"
            className="w-full rounded-md border bg-background p-2 text-sm"
            rows={3}
            required
            maxLength={REASON_MAX}
            aria-invalid={rejectInvalid}
            aria-describedby={rejectInvalid ? 'approval-reason-error' : undefined}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {rejectInvalid && (
            <p id="approval-reason-error" role="alert" className="text-sm text-destructive">{t('reasonMissing')}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" className="sm:w-auto" onClick={close}>{t('cancel')}</Button>
            <Button type="submit" variant="destructive" className="sm:w-auto" isLoading={decide.isPending}>{t('confirmReject')}</Button>
          </div>
        </form>
      </Modal>
    </section>
  )
}
