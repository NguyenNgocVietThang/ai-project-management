import { AlertCircle, FolderOpen, RotateCcw, type LucideIcon } from 'lucide-react'
import { Skeleton, SkeletonCard, SkeletonRegion, SkeletonTable, SkeletonText } from '@/components/ui/Skeleton'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/utils'

type LoadingVariant = 'inline' | 'cards' | 'table' | 'page'

/**
 * Trạng thái đang tải bằng khung xương thay cho spinner: giữ chỗ đúng bố cục
 * nên nội dung thật xuất hiện không làm nhảy trang. Giữ nguyên API cũ (`label`).
 */
export function LoadingState({ label = 'Loading…', variant = 'inline', className }: { label?: string; variant?: LoadingVariant; className?: string }) {
  return (
    <SkeletonRegion label={label} className={cn('w-full', className)}>
      {variant === 'inline' && (
        <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6 shadow-soft">
          <Skeleton className="h-5 w-1/3" />
          <SkeletonText lines={3} />
        </div>
      )}
      {variant === 'cards' && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map(i => <SkeletonCard key={i} />)}</div>
      )}
      {variant === 'table' && <SkeletonTable />}
      {variant === 'page' && (
        <div className="space-y-6">
          <div className="space-y-3"><Skeleton className="h-4 w-28" /><Skeleton className="h-9 w-64 max-w-full" /></div>
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid gap-6 md:grid-cols-2">{[0, 1].map(i => <SkeletonCard key={i} />)}</div>
        </div>
      )}
    </SkeletonRegion>
  )
}

/** Lỗi tải dữ liệu; có nút thử lại khi truyền `onRetry`. */
export function ErrorState({ message, onRetry, retryLabel = 'Try again' }: { message: string; onRetry?: () => void; retryLabel?: string }) {
  return (
    <div role="alert" className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-xl border border-destructive/25 bg-destructive/5 p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
      </span>
      <p className="max-w-prose-ui text-body-sm text-destructive">{message}</p>
      {onRetry && (
        <Button variant="outline" fullWidth={false} onClick={onRetry}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

/**
 * Trạng thái rỗng: biểu tượng, tiêu đề, giải thích và CTA dẫn người dùng tới
 * bước tiếp theo (tạo mới / xoá bộ lọc) thay vì để họ đứng trước màn hình trống.
 */
export function EmptyState({
  title,
  description,
  icon: Icon = FolderOpen,
  action,
  secondaryAction,
  className,
}: {
  title: string
  description: string
  icon?: LucideIcon
  action?: React.ReactNode
  secondaryAction?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/60 px-6 py-12 text-center', className)}>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent ring-8 ring-accent/40">
        <Icon className="h-6 w-6 text-accent-foreground" aria-hidden="true" />
      </span>
      <h3 className="mt-6 text-h4">{title}</h3>
      <p className="mt-2 max-w-md text-body-sm text-muted-foreground">{description}</p>
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  )
}
