'use client'

/**
 * MiniProgressBar – thanh tiến độ inline đơn giản
 * Dùng trong thẻ dự án và các hàng tình trạng danh mục đầu tư.
 * - Độ rộng chạy từ 0 khi mount (500ms, ease-out-soft); giảm chuyển động đã xử lý toàn cục bằng CSS.
 * - Có role progressbar + title phần trăm để thông tin không chỉ dựa vào hình.
 * - Hover thì thanh dày lên một chút (scale-y nên không xô lệch bố cục).
 */
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface MiniProgressBarProps {
  value: number   // 0–100
  className?: string
  colorClass?: string
  /** Nhãn truy cập (ví dụ "Tiến độ"); phần trăm luôn được nối thêm. */
  label?: string
}

export function MiniProgressBar({
  value,
  className,
  colorClass = 'bg-primary',
  label,
}: MiniProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0))
  const rounded = Math.round(pct)
  // Bắt đầu từ 0 rồi đặt giá trị thật ở frame kế tiếp để transition width chạy khi mount.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const text = label ? `${label}: ${rounded}%` : `${rounded}%`

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={rounded}
      aria-label={text}
      title={text}
      className={cn(
        'h-1.5 overflow-hidden rounded-full bg-muted transition-transform duration-200 ease-out-soft hover:scale-y-150',
        className
      )}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-500 ease-out-soft', colorClass)}
        style={{ width: `${mounted ? pct : 0}%` }}
      />
    </div>
  )
}
