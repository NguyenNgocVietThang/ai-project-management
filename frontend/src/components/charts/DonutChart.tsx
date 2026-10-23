'use client'

/**
 * DonutChart – biểu đồ vành khuyên (Recharts PieChart)
 * Dùng cho: phân bố trạng thái task, phân tích ngân sách.
 * Hover (lát hoặc mục chú giải): lát được chọn nở ra 6px, các lát khác mờ còn 0.5,
 * nhãn giữa đổi sang tên + giá trị của lát; rời chuột thì về tổng mặc định.
 * Không dùng con trỏ/tooltip vì nhãn giữa đã hiển thị thông tin.
 */
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  type LabelProps,
} from 'recharts'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'
import { animationProps, chartColors, usePrefersReducedMotion } from './chartTheme'

export interface DonutSlice {
  name: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutSlice[]
  /** Chữ hiển thị ở giữa biểu đồ donut */
  centerLabel?: string
  centerValue?: string | number
  height?: number
  showLegend?: boolean
  /** Định dạng giá trị (nhãn giữa, chú giải sr-only); mặc định in nguyên số. */
  valueFormatter?: (value: number) => string
  /** Chú thích cho danh sách sr-only mô tả dữ liệu. */
  summaryLabel?: string
  /** Nội dung khi tổng bằng 0. */
  emptyLabel?: string
}

/** Lát đang hover: bán kính ngoài +6px, giữ góc bo. */
function renderActiveShape(props: unknown) {
  const sector = props as PieSectorDataItem
  return <Sector {...sector} outerRadius={(sector.outerRadius ?? 0) + 6} />
}

export function DonutChart({
  data,
  centerLabel,
  centerValue,
  height = 260,
  showLegend = true,
  valueFormatter,
  summaryLabel,
  emptyLabel,
}: DonutChartProps) {
  const t = useTranslations('chartsUi')
  const reducedMotion = usePrefersReducedMotion()
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const format = (value: number) => (valueFormatter ? valueFormatter(value) : String(value))

  if (total === 0) {
    return (
      <div className="flex items-center justify-center text-body-sm text-muted-foreground" style={{ height }}>
        {emptyLabel ?? t('empty')}
      </div>
    )
  }

  const active = activeIndex !== undefined ? data[activeIndex] : undefined
  // Nhãn giữa: lát đang hover, nếu không thì giá trị/nhãn mặc định do trang gọi truyền vào.
  const centerTop = active ? format(active.value) : centerValue ?? format(total)
  const centerBottom = active ? active.name : centerLabel
  const showCenter = Boolean(active || centerLabel)

  const renderCenter = (props: LabelProps) => {
    const viewBox = (props as { viewBox?: { cx?: number; cy?: number } }).viewBox
    const cx = viewBox?.cx ?? 0
    const cy = viewBox?.cy ?? 0
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="pointer-events-none">
        <tspan
          x={cx}
          dy={centerBottom ? '-0.5em' : '0'}
          className="tabular-nums"
          style={{ fontSize: 20, fontWeight: 700, fill: 'hsl(var(--foreground))' }}
        >
          {centerTop}
        </tspan>
        {centerBottom && (
          <tspan x={cx} dy="1.5em" style={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}>
            {centerBottom}
          </tspan>
        )}
      </text>
    )
  }

  return (
    <div>
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="75%"
              paddingAngle={2}
              cornerRadius={4}
              dataKey="value"
              nameKey="name"
              stroke={chartColors.surface}
              strokeWidth={2}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
              {...animationProps(reducedMotion)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={activeIndex === undefined || activeIndex === index ? 1 : 0.5}
                  style={{ transition: 'opacity 200ms', outline: 'none' }}
                />
              ))}
              {showCenter && <Label position="center" content={renderCenter} />}
            </Pie>
            {showLegend && (
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
                formatter={(value: string) => <span className="text-muted-foreground">{value}</span>}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Danh sách cho trình đọc màn hình: tên, giá trị và tỉ lệ từng lát. */}
      <ul className="sr-only" aria-label={summaryLabel ?? centerLabel ?? t('donutSummary')}>
        {data.map((entry) => (
          <li key={entry.name}>
            {entry.name}: {format(entry.value)} ({Math.round((entry.value / total) * 100)}%)
          </li>
        ))}
      </ul>
    </div>
  )
}
