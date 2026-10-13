import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { formatStatus } from '@/lib/format'
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
  return (
    <Badge tone={STATUS_TONE[status]} dot className={status === 'CANCELLED' ? `line-through ${className ?? ''}` : className}>
      {formatStatus(status)}
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
  return (
    <Badge tone={RISK_TONE[level]} dot>
      {level}
    </Badge>
  )
}
