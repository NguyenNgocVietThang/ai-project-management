import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AlertProps {
  children: React.ReactNode
  className?: string
  variant?: 'error' | 'success'
}

const VARIANT_CLASSES = {
  error: 'border-destructive/25 bg-destructive/5 text-destructive',
  success: 'border-success/25 bg-success-soft text-success',
} as const

/** Banner trạng thái inline với ngữ nghĩa live-region hỗ trợ tiếp cận. */
export function Alert({ children, className, variant = 'error' }: AlertProps) {
  const Icon = variant === 'success' ? CheckCircle2 : AlertCircle

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-lg border px-4 py-3 text-body-sm animate-fade-in',
        VARIANT_CLASSES[variant],
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}
