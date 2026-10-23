'use client'

import { useLocale, useTranslations } from 'next-intl'
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
  const locale = useLocale()
  const t = useTranslations('project')
  return <Badge tone={TONES[status] ?? 'neutral'} dot className={className}>{t.has(`statuses.${status}`) ? t(`statuses.${status}`) : formatStatus(status, locale)}</Badge>
}
