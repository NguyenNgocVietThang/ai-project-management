import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError = false, ...props }, ref) => {
    // Nối input với thông báo lỗi `<p id={`${id}-error`}>` (xem FieldError) để screen reader đọc
    // được lý do.
    const describedBy =
      [props['aria-describedby'], hasError && props.id ? `${props.id}-error` : null]
        .filter(Boolean)
        .join(' ') || undefined

    return (
      <input
        ref={ref}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        className={cn(
          'flex h-11 w-full rounded-md border bg-background px-3 py-2 text-base',
          'placeholder:text-muted-foreground',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          hasError ? 'border-destructive focus-visible:ring-destructive' : 'border-input',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
