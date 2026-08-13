import { cn } from '@/lib/utils'
import { formatStatus } from '@/lib/format'

const COLORS: Record<string, string> = {
  PLANNING: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  ON_HOLD: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  COMPLETED: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  CANCELLED: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
}

export function ProjectStatusBadge({ status, className }: { status: string; className?: string }) {
  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', COLORS[status] ?? COLORS.PLANNING, className)}>{formatStatus(status)}</span>
}
