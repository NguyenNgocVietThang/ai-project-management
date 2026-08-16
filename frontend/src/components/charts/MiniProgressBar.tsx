/**
 * MiniProgressBar – simple inline progress bar
 * Used in project cards and portfolio health rows
 */
import { cn } from '@/lib/utils'

interface MiniProgressBarProps {
  value: number   // 0–100
  className?: string
  colorClass?: string
}

export function MiniProgressBar({
  value,
  className,
  colorClass = 'bg-primary',
}: MiniProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('h-1.5 overflow-hidden rounded-full bg-muted', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', colorClass)}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
