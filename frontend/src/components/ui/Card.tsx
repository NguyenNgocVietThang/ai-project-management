import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card bấm được: nhấc nhẹ 2px + bóng đậm hơn khi hover (200ms). */
  interactive?: boolean
  /** Bỏ padding mặc định (dùng cho bảng, biểu đồ tràn viền). */
  flush?: boolean
  as?: 'div' | 'article' | 'section'
}

/** Khối nội dung cơ sở: bo 12px, viền mảnh, bóng mềm nhiều tầng. */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, flush = false, as: Tag = 'div', ...props }, ref) => (
    <Tag
      ref={ref as never}
      className={cn(
        'relative rounded-xl border border-border/80 bg-card text-card-foreground shadow-soft',
        !flush && 'p-4 sm:p-6',
        interactive &&
          'transition-[transform,box-shadow,border-color] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft-md focus-within:border-primary/40',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

/** Đầu card: tiêu đề + mô tả bên trái, hành động bên phải. */
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4 flex flex-wrap items-start justify-between gap-3', className)} {...props} />
}

export function CardTitle({ className, as: Tag = 'h2', ...props }: HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'h3' | 'h4' }) {
  return <Tag className={cn('text-h4 text-foreground', className)} {...props} />
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('mt-1 max-w-prose-ui text-body-sm text-muted-foreground', className)} {...props} />
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-6 flex flex-wrap items-center justify-end gap-3 border-t pt-4', className)} {...props} />
}
