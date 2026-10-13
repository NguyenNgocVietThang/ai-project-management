import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// Tông màu ngữ nghĩa lấy từ token, không hard-code bảng màu Tailwind,
// nên tự đổi đúng theo sáng/tối và luôn đạt tương phản AA.
const TONES = {
  neutral: 'border-border bg-muted text-muted-foreground',
  primary: 'border-primary/20 bg-accent text-accent-foreground',
  success: 'border-success/20 bg-success-soft text-success',
  warning: 'border-warning/25 bg-warning-soft text-warning',
  danger: 'border-destructive/20 bg-destructive/10 text-destructive',
  info: 'border-info/20 bg-info-soft text-info',
} as const

const SIZES = {
  sm: 'h-5 px-2 text-overline normal-case tracking-normal',
  md: 'h-6 px-2.5 text-caption',
} as const

export type BadgeTone = keyof typeof TONES

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  size?: keyof typeof SIZES
  /** Chấm tròn phía trước, giúp phân biệt trạng thái không chỉ bằng màu chữ. */
  dot?: boolean
}

export function Badge({ tone = 'neutral', size = 'md', dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border font-medium', SIZES[size], TONES[tone], className)}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  )
}
