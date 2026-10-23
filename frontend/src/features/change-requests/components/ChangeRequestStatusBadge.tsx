'use client'

import { useTranslations } from 'next-intl'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import type { ChangeRequestStatus, RiskLevel } from '@/types/change-request.types'

// Trạng thái CR -> tông Badge lấy từ token ngữ nghĩa (không hard-code bảng màu).
const STATUS_TONE: Record<ChangeRequestStatus, BadgeTone> = {
  DRAFT: 'neutral',
  SUBMITTED: 'info',
  UNDER_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  IMPLEMENTED: 'primary',
  CANCELLED: 'neutral',
}

/** Nhãn trạng thái CR: chấm tròn + chữ nên không chỉ dựa vào màu. */
export function ChangeRequestStatusBadge({ status, className }: { status: ChangeRequestStatus; className?: string }) {
  const t = useTranslations('workflowUi.status')
  return (
    <Badge tone={STATUS_TONE[status]} dot className={status === 'CANCELLED' ? `line-through ${className ?? ''}` : className}>
      {t(status)}
    </Badge>
  )
}

// Mức rủi ro -> tông Badge; HIGH và CRITICAL cùng tông nguy hiểm, phân biệt bằng chữ.
export const RISK_TONE: Record<RiskLevel, BadgeTone> = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'danger',
  CRITICAL: 'danger',
}

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  const t = useTranslations('workflowUi')
  const labels = { LOW: 'riskLow', MEDIUM: 'riskMedium', HIGH: 'riskHigh', CRITICAL: 'riskCritical' } as const
  return (
    <Badge tone={RISK_TONE[level]} dot>
      {t(labels[level])}
    </Badge>
  )
}
