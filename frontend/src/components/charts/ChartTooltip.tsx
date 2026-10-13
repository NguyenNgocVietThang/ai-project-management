'use client'

/**
 * ChartTooltip – tooltip dùng chung cho các biểu đồ Recharts.
 * Thẻ nhỏ có ô màu cho từng chuỗi (kèm tên chuỗi, không chỉ dựa vào màu),
 * số dùng `tabular-nums` để không nhảy khi rê chuột, hiện nhanh với `animate-scale-in`.
 */
import type { ReactNode } from 'react'

export interface ChartTooltipEntry {
  name?: string | number
  value?: number | string | (number | string)[]
  color?: string
  fill?: string
  stroke?: string
  dataKey?: string | number
  payload?: Record<string, unknown> & { fill?: string; color?: string }
}

export interface ChartTooltipProps {
  /** Recharts tự truyền các props dưới đây khi dùng `content={<ChartTooltip />}`. */
  active?: boolean
  payload?: ChartTooltipEntry[]
  label?: ReactNode
  /** Định dạng giá trị hiển thị cho từng dòng. */
  valueFormatter?: (value: number | string, entry: ChartTooltipEntry) => ReactNode
  /** Định dạng tiêu đề (nhãn trục X hoặc tên lát). */
  labelFormatter?: (label: ReactNode, payload: ChartTooltipEntry[]) => ReactNode
  /** Ẩn tiêu đề, hữu ích cho donut vì tên lát đã có trong dòng. */
  hideLabel?: boolean
}

/** Lấy màu thật của chuỗi: Line dùng stroke, Bar/Pie dùng fill. */
function entryColor(entry: ChartTooltipEntry): string | undefined {
  return entry.color ?? entry.payload?.fill ?? entry.payload?.color ?? entry.fill ?? entry.stroke
}

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
  hideLabel = false,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  const title = labelFormatter ? labelFormatter(label, payload) : label

  return (
    <div className="pointer-events-none min-w-[8rem] animate-scale-in rounded-lg border border-border/80 bg-popover px-3 py-2 text-caption text-popover-foreground shadow-soft-md">
      {!hideLabel && title !== undefined && title !== null && title !== '' && (
        <p className="mb-1 font-medium text-foreground">{title}</p>
      )}
      <ul className="space-y-1">
        {payload.map((entry, index) => {
          const raw = Array.isArray(entry.value) ? entry.value.join(' - ') : entry.value
          const shown = raw === undefined ? '' : valueFormatter ? valueFormatter(raw, entry) : raw
          return (
            <li key={`${String(entry.dataKey ?? entry.name)}-${index}`} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: entryColor(entry) }}
              />
              <span className="text-muted-foreground">{entry.name}</span>
              <span className="ml-auto pl-3 font-semibold tabular-nums text-foreground">{shown}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
