'use client'

import { useState } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import { Ban, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import { readApiError, type ApprovalStep, type ApprovalStepStatus } from '@/features/change-requests/approvals'
import { useApprovalChain, useDecideApproval } from '@/features/change-requests/hooks/useApprovals'

const REASON_MAX = 2000

// Ô nhập nhiều dòng cùng kiểu với Input (bo 8px, viền input, focus ring).
const TEXTAREA_CLASSES =
  'w-full rounded-lg border border-input bg-card px-3 py-2 text-body sm:text-body-sm shadow-xs transition-[border-color,box-shadow] duration-150 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-destructive'

// Mỗi trạng thái có biểu tượng + nhãn chữ riêng, không chỉ dựa vào màu.
const STATUS_ICON: Record<ApprovalStepStatus, typeof Clock> = {
  PENDING: Clock,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
  CANCELLED: Ban,
}
// Chấm trên trục thời gian: màu lấy từ token ngữ nghĩa.
const DOT_CLASS: Record<ApprovalStepStatus, string> = {
  PENDING: 'bg-muted text-muted-foreground',
  APPROVED: 'bg-success-soft text-success',
  REJECTED: 'bg-destructive/10 text-destructive',
  CANCELLED: 'bg-muted text-muted-foreground',
}
const STATUS_TONE: Record<ApprovalStepStatus, BadgeTone> = {
  PENDING: 'neutral',
  APPROVED: 'success',
  REJECTED: 'danger',
  CANCELLED: 'neutral',
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
    // Khung xương mô phỏng trục thời gian: chấm tròn + 2 dòng chữ mỗi bước.
    return (
      <SkeletonRegion label={t('loading')} className="space-y-4">
        <Skeleton className="h-5 w-40" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </SkeletonRegion>
    )
  }
  if (chain.isError || !chain.data) {
    // CR nháp chưa có chuỗi duyệt: backend có thể trả 404.
    if (readApiError(chain.error).status === 404) {
      return <p className="text-body-sm text-muted-foreground">{t('empty')}</p>
    }
    return <Alert>{errorMessage(chain.error)}</Alert>
  }

  const steps = [...chain.data.steps].sort((a, b) => a.step_order - b.step_order)
  const rejectInvalid = touched && !text.trim()

  return (
    <section aria-labelledby="approval-title" className="space-y-4">
      <h3 id="approval-title" className="text-h4 text-foreground">{t('title')}</h3>
      {decide.isError && <Alert>{errorMessage(decide.error)}</Alert>}
      {steps.length === 0 ? (
        <p className="text-body-sm text-muted-foreground">{t('empty')}</p>
      ) : (
        <ol>
          {steps.map((step, index) => {
            const Icon = STATUS_ICON[step.status]
            const isCurrent = step.step_order === chain.data.current_step_order
            const isLast = index === steps.length - 1
            return (
              <li
                key={step.id}
                className={cn('relative flex gap-3', !isLast && 'pb-6')}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {/* Đường dọc nối các bước (trang trí). */}
                {!isLast && <span aria-hidden="true" className="absolute bottom-0 left-3 top-7 w-px bg-border" />}
                <span
                  aria-hidden="true"
                  className={cn(
                    'relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-4 ring-card',
                    isCurrent && step.status === 'PENDING' ? 'bg-accent text-primary' : DOT_CLASS[step.status]
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className={cn('min-w-0 flex-1', isCurrent && 'rounded-lg border border-primary/30 bg-accent/40 p-3')}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="min-w-0 break-words text-body-sm font-medium text-foreground">
                      {t('stepLabel', { order: step.step_order, role: t(`role.${step.required_role}`) })}
                    </span>
                    <Badge tone={STATUS_TONE[step.status]} size="sm">{t(`status.${step.status}`)}</Badge>
                  </div>
                  {(step.approver_name || step.decided_at) && (
                    <p className="mt-1 text-caption text-muted-foreground">
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
                    <p className="mt-2 break-words text-body-sm text-foreground">
                      <span className="font-medium">{step.status === 'REJECTED' ? t('reasonLabel') : t('commentLabel')}: </span>
                      {step.comment}
                    </p>
                  )}
                  {step.can_decide && (
                    <div className="mt-3 flex gap-2">
                      <Button type="button" fullWidth={false} className="flex-1" onClick={() => { close(); setApproveStep(step) }}>
                        {t('approve')}
                      </Button>
                      <Button type="button" variant="outline" fullWidth={false} className="flex-1" onClick={() => { close(); setRejectStep(step) }}>
                        {t('reject')}
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}

      <Modal open={approveStep !== null} onClose={close} title={t('approveTitle')}>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); submitApprove() }}>
          <label className="block text-body-sm font-medium text-foreground" htmlFor="approval-comment">{t('commentOptional')}</label>
          <textarea
            id="approval-comment"
            className={TEXTAREA_CLASSES}
            rows={3}
            maxLength={REASON_MAX}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" fullWidth={false} className="w-full sm:w-auto" onClick={close}>{t('cancel')}</Button>
            <Button type="submit" fullWidth={false} className="w-full sm:w-auto" isLoading={decide.isPending}>{t('confirmApprove')}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={rejectStep !== null} onClose={close} title={t('rejectTitle')}>
        <form className="space-y-4" noValidate onSubmit={(e) => { e.preventDefault(); submitReject() }}>
          <label className="block text-body-sm font-medium text-foreground" htmlFor="approval-reason">{t('reasonRequired')}</label>
          <textarea
            id="approval-reason"
            className={TEXTAREA_CLASSES}
            rows={3}
            required
            maxLength={REASON_MAX}
            aria-invalid={rejectInvalid}
            aria-describedby={rejectInvalid ? 'approval-reason-error' : undefined}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {rejectInvalid && (
            <p id="approval-reason-error" role="alert" className="text-body-sm text-destructive">{t('reasonMissing')}</p>
          )}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" fullWidth={false} className="w-full sm:w-auto" onClick={close}>{t('cancel')}</Button>
            <Button type="submit" variant="destructive" fullWidth={false} className="w-full sm:w-auto" isLoading={decide.isPending}>{t('confirmReject')}</Button>
          </div>
        </form>
      </Modal>
    </section>
  )
}
