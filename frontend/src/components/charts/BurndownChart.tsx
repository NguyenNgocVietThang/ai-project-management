'use client'

/**
 * BurndownChart – biểu đồ burndown (Recharts ComposedChart)
 * Hiển thị số task còn lại thực tế (vùng tô nhạt + đường) so với đường lý tưởng (nét đứt muted).
 * Hover: đường dóng dọc nét đứt màu primary, chấm active viền màu nền thẻ, tooltip dùng chung.
 * Có bảng sr-only để thông tin không chỉ nằm trong hình.
 */
import { useId, useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { BurndownPoint } from '@/features/dashboard/types/dashboard.types'
import { ChartTooltip } from './ChartTooltip'
import {
  animationProps,
  axisProps,
  chartColors,
  gridProps,
  lineActiveDot,
  lineCursor,
  usePrefersReducedMotion,
} from './chartTheme'

export interface BurndownChartLabels {
  ideal: string
  remaining: string
  date: string
  empty: string
  /** Chú thích bảng sr-only. */
  summary: string
}

interface BurndownChartProps {
  data: BurndownPoint[]
  height?: number
  /** Ghi đè nhãn; mặc định theo ngôn ngữ đang chọn. */
  labels?: Partial<BurndownChartLabels>
}

function formatDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return new Intl.DateTimeFormat(locale, { month: 'numeric', day: 'numeric', timeZone: 'UTC' }).format(d)
}

export function BurndownChart({ data, height = 260, labels }: BurndownChartProps) {
  const locale = useLocale()
  const t = useTranslations('chartsUi')
  const text = { ideal: t('ideal'), remaining: t('remaining'), date: t('date'), empty: t('burndownEmpty'), summary: t('burndownSummary'), ...labels }
  const reducedMotion = usePrefersReducedMotion()
  // useId trả về dạng ":r0:"; bỏ ký tự đặc biệt để dùng trong url(#...).
  const gradientId = `burndown-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  // Giữ nguyên tham chiếu mảng để render lại không kích hoạt lại animation vào.
  const chartData = useMemo(
    () => (data ?? []).map((p) => ({ ...p, dateLabel: formatDate(p.date, locale) })),
    [data, locale]
  )

  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-body-sm text-muted-foreground"
        style={{ height }}
      >
        {text.empty}
      </div>
    )
  }

  return (
    <div>
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.22} />
                <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} vertical={false} />
            <XAxis dataKey="dateLabel" {...axisProps} minTickGap={8} />
            <YAxis {...axisProps} allowDecimals={false} />
            <Tooltip cursor={lineCursor} content={<ChartTooltip />} isAnimationActive={false} />
            <Legend
              iconType="plainline"
              iconSize={14}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value: string) => <span className="text-muted-foreground">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="remaining"
              name={text.remaining}
              stroke={chartColors.primary}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ ...lineActiveDot, fill: chartColors.primary }}
              {...animationProps(reducedMotion)}
            />
            <Line
              type="monotone"
              dataKey="ideal"
              name={text.ideal}
              stroke={chartColors.muted}
              strokeDasharray="5 5"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ ...lineActiveDot, r: 4, fill: chartColors.muted }}
              {...animationProps(reducedMotion)}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* Bảng dữ liệu cho trình đọc màn hình. */}
      <table className="sr-only">
        <caption>{text.summary}</caption>
        <thead>
          <tr>
            <th scope="col">{text.date}</th>
            <th scope="col">{text.remaining}</th>
            <th scope="col">{text.ideal}</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((p) => (
            <tr key={p.date}>
              <th scope="row">{p.dateLabel}</th>
              <td>{p.remaining}</td>
              <td>{p.ideal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
