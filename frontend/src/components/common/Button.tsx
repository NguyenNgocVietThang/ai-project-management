import Link from 'next/link'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/common/Spinner'

// Biến thể màu. Chỉ "default" dùng nền primary — mỗi vùng màn hình chỉ nên có
// một nút như vậy để CTA chính luôn nổi bật.
const VARIANT_CLASSES = {
  default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-soft',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
  outline: 'border border-input bg-card text-foreground shadow-xs hover:border-primary/40 hover:bg-accent hover:text-accent-foreground',
  ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
  link: 'h-auto min-h-0 px-0 text-primary underline-offset-4 hover:underline',
} as const

// Kích thước theo lưới 4px; md/lg/icon giữ vùng chạm tối thiểu 44px.
const SIZE_CLASSES = {
  sm: 'min-h-9 px-3 text-body-sm',
  md: 'min-h-11 px-4 text-body-sm',
  lg: 'min-h-12 px-6 text-body',
  icon: 'h-11 w-11 shrink-0 p-0',
} as const

export type ButtonVariant = keyof typeof VARIANT_CLASSES
export type ButtonSize = keyof typeof SIZE_CLASSES

/** Sinh class cho button; dùng lại được cho <Link> muốn trông như nút. */
export function buttonClasses({
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; fullWidth?: boolean; className?: string } = {}) {
  return cn(
    'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out-soft',
    'active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    fullWidth && 'w-full',
    className
  )
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Mặc định true để giữ hành vi cũ (nút trong form chiếm hết chiều ngang). */
  fullWidth?: boolean
  isLoading?: boolean
}

/** Button cơ sở. Vùng chạm tối thiểu 44px, focus ring hiển thị, trạng thái disabled + loading. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', fullWidth = true, isLoading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={buttonClasses({ variant, size, fullWidth, className })}
        {...props}
      >
        {isLoading && <Spinner className="h-4 w-4" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

/** Liên kết điều hướng mang hình thức nút (CTA dẫn sang trang khác). */
export function ButtonLink({
  href,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}: { href: string; variant?: ButtonVariant; size?: ButtonSize; fullWidth?: boolean; className?: string; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, fullWidth, className })} {...props}>
      {children}
    </Link>
  )
}
