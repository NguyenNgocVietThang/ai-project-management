import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AlertProps {
  children: React.ReactNode
  className?: string
  variant?: 'error' | 'success'
}

const VARIANT_CLASSES = {
  error: 'border-destructive/30 bg-destructive/10 text-destructive',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
} as const

/** Banner trạng thái inline với ngữ nghĩa live-region hỗ trợ tiếp cận. */
export function Alert({ children, className, variant = 'error' }: AlertProps) {
  const Icon = variant === 'success' ? CheckCircle2 : AlertCircle

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm',
        VARIANT_CLASSES[variant],
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}
