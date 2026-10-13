import { ChevronDown } from 'lucide-react'
import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean
  wrapperClassName?: string
}

/**
 * Select gốc của trình duyệt (giữ bàn phím, trình đọc màn hình, picker di động)
 * nhưng cùng hình thức với Input: cao 44px, bo 10px, mũi tên riêng.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, wrapperClassName, hasError = false, children, ...props }, ref) => (
    <div className={cn('relative', wrapperClassName)}>
      <select
        ref={ref}
        aria-invalid={hasError || undefined}
        className={cn(
          'h-11 w-full appearance-none rounded-lg border bg-card pl-3 pr-9 text-body sm:text-body-sm text-foreground shadow-xs',
          'transition-[border-color,box-shadow] duration-150 hover:border-primary/40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          hasError ? 'border-destructive' : 'border-input',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
    </div>
  )
)
Select.displayName = 'Select'
