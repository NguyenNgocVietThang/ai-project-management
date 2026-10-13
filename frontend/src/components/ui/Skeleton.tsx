import { cn } from '@/lib/utils'

/** Khối xương chờ tải với dải sáng chạy ngang (tắt khi prefers-reduced-motion). */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('skeleton-shimmer animate-shimmer rounded-lg bg-muted', className)} />
}

/** Vỏ ngoài cho mọi skeleton: báo cho trình đọc màn hình biết đang tải. */
export function SkeletonRegion({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn('h-4', i === lines - 1 ? 'w-3/5' : 'w-full')} />
      ))}
    </div>
  )
}

/** Card giả có cùng bố cục với card thật (badge, tiêu đề, mô tả, thanh tiến độ). */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('rounded-xl border border-border/80 bg-card p-6 shadow-soft', className)}>
      <div className="flex gap-2"><Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-6 w-16 rounded-full" /></div>
      <Skeleton className="mt-4 h-6 w-2/3" />
      <SkeletonText lines={2} className="mt-3" />
      <Skeleton className="mt-6 h-2 w-full rounded-full" />
      <div className="mt-6 grid grid-cols-2 gap-4"><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
    </div>
  )
}

export function SkeletonStatGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-xl border border-border/80 bg-card p-4 shadow-soft sm:p-6">
          <div className="flex justify-between"><Skeleton className="h-4 w-20" /><Skeleton className="h-8 w-8 rounded-lg" /></div>
          <Skeleton className="mt-6 h-9 w-16" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 6, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-soft">
      <div className="flex gap-4 border-b bg-muted/50 px-4 py-3">
        {Array.from({ length: cols }, (_, i) => <Skeleton key={i} className="h-4 flex-1" />)}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-4 border-b px-4 py-4 last:border-b-0">
          {Array.from({ length: cols }, (_, c) => <Skeleton key={c} className={cn('h-4 flex-1', c === 0 && 'flex-[2]')} />)}
        </div>
      ))}
    </div>
  )
}

/** Khung đầu trang: eyebrow, H1, mô tả. */
export function SkeletonPageHeader() {
  return (
    <div aria-hidden="true" className="space-y-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-9 w-72 max-w-full" />
      <Skeleton className="h-4 w-96 max-w-full" />
    </div>
  )
}

/** Khung cả trang, chọn bố cục gần nhất với trang thật để tránh nhảy layout. */
export function SkeletonPage({ label, variant = 'cards' }: { label: string; variant?: 'cards' | 'table' | 'detail' }) {
  return (
    <SkeletonRegion label={label} className="space-y-8">
      <SkeletonPageHeader />
      {variant === 'cards' && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
        </div>
      )}
      {variant === 'table' && <SkeletonTable />}
      {variant === 'detail' && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6"><SkeletonStatGrid /><Skeleton className="h-72 rounded-xl" /></div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      )}
    </SkeletonRegion>
  )
}
