import { RevealText } from '@/components/motion/RevealText'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  eyebrow?: string
  description?: React.ReactNode
  /** Nhóm nút bên phải: đặt CTA chính (variant default) ở cuối, tối đa 2 nút phụ. */
  actions?: React.ReactNode
  /** Badge/trạng thái hiển thị phía trên tiêu đề. */
  meta?: React.ReactNode
  /** Tắt hiệu ứng chữ (ví dụ khi tiêu đề đổi liên tục). */
  animate?: boolean
  compact?: boolean
  className?: string
}

/**
 * Đầu trang thống nhất: eyebrow -> H1 -> mô tả (giới hạn ~68 ký tự/dòng),
 * hành động căn đáy bên phải trên desktop, xếp dưới tiêu đề trên mobile.
 */
export function PageHeader({ title, eyebrow, description, actions, meta, animate = false, compact = true, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        {meta && <div className="mb-2 flex flex-wrap items-center gap-2">{meta}</div>}
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        {animate ? (
          <RevealText text={title} className={cn('break-words [overflow-wrap:anywhere]', compact ? 'text-2xl font-medium tracking-tight sm:text-3xl' : 'text-h2 sm:text-h1')} />
        ) : (
          <h1 title={title} className={cn('break-words [overflow-wrap:anywhere]', compact ? 'line-clamp-2 text-2xl font-medium tracking-tight sm:text-3xl' : 'text-h2 sm:text-h1')}>{title}</h1>
        )}
        {description && <p className="mt-1 max-w-prose-ui break-words text-body-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>}
    </header>
  )
}

/** Tiêu đề khu vực bên trong trang (H2) với liên kết/hành động phụ. */
export function SectionHeader({ title, description, action, id, className }: { title: string; description?: string; action?: React.ReactNode; id?: string; className?: string }) {
  return (
    <div className={cn('mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4', className)}>
      <div className="min-w-0">
        <h2 id={id} className="text-h4 sm:text-h3">{title}</h2>
        {description && <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
