'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option<T extends string> {
  value: T
  label: string
  icon?: LucideIcon
  /** Chỉ hiện icon, nhãn vẫn dùng làm aria-label. */
  iconOnly?: boolean
}

/** Nhóm nút chọn một (ví dụ lưới/bảng). Dùng aria-pressed để trình đọc màn hình biết lựa chọn hiện tại. */
export function SegmentedControl<T extends string>({ value, onChange, options, label, className }: { value: T; onChange: (value: T) => void; options: Option<T>[]; label: string; className?: string }) {
  return (
    <div role="group" aria-label={label} className={cn('inline-flex rounded-lg border bg-muted/60 p-1', className)}>
      {options.map(({ value: optionValue, label: optionLabel, icon: Icon, iconOnly }) => {
        const active = optionValue === value
        return (
          <button
            key={optionValue}
            type="button"
            aria-pressed={active}
            aria-label={iconOnly ? optionLabel : undefined}
            title={iconOnly ? optionLabel : undefined}
            onClick={() => onChange(optionValue)}
            className={cn(
              'inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-3 text-body-sm font-medium transition-[background-color,color,box-shadow] duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            {!iconOnly && optionLabel}
          </button>
        )
      })}
    </div>
  )
}
