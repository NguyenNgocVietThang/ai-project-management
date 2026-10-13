import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { formatStatus } from '@/lib/format'

// Trạng thái danh mục -> tông màu ngữ nghĩa; có chấm tròn để không chỉ dựa vào màu.
const TONES: Record<string, BadgeTone> = {
  PLANNING: 'info',
  ACTIVE: 'success',
  ARCHIVED: 'neutral',
}

export function PortfolioStatusBadge({ status, className }: { status: string; className?: string }) {
  return <Badge tone={TONES[status] ?? 'neutral'} dot className={className}>{formatStatus(status)}</Badge>
}
