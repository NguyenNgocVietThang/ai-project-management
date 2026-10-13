import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { formatStatus } from '@/lib/format'

// Trạng thái dự án -> tông màu ngữ nghĩa; có chấm tròn để không chỉ dựa vào màu.
const TONES: Record<string, BadgeTone> = {
  PLANNING: 'neutral',
  ACTIVE: 'success',
  ON_HOLD: 'warning',
  COMPLETED: 'info',
  CANCELLED: 'danger',
}

export function ProjectStatusBadge({ status, className }: { status: string; className?: string }) {
  return <Badge tone={TONES[status] ?? 'neutral'} dot className={className}>{formatStatus(status)}</Badge>
}
