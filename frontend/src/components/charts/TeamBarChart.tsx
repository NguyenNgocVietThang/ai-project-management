'use client'

/**
 * TeamBarChart – biểu đồ cột dọc (Recharts BarChart)
 * Hiển thị mức sử dụng nhân sự: giờ ước tính so với giờ đã ghi nhận của từng thành viên.
 * Hover: cột nền bo góc phía sau nhóm cột, nhóm đang hover giữ độ đậm, các nhóm khác mờ đi.
 * Có bảng sr-only để thông tin không chỉ nằm trong hình.
 */
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TeamMemberUtilization } from '@/features/dashboard/types/dashboard.types'
import { ChartTooltip } from './ChartTooltip'
import {
  animationProps,
  axisProps,
  BandCursor,
  chartColors,
  DIM_OPACITY,
  gridProps,
  opacityTransition,
  usePrefersReducedMotion,
} from './chartTheme'

export interface TeamBarChartLabels {
  estimated: string
  logged: string
  member: string
  empty: string
  /** Chú thích bảng sr-only. */
  summary: string
}

interface TeamBarChartProps {
  data: TeamMemberUtilization[]
  height?: number
  /** Ghi đè nhãn; mặc định theo ngôn ngữ đang chọn. */
  labels?: Partial<TeamBarChartLabels>
}

export function TeamBarChart({ data, height = 220, labels }: TeamBarChartProps) {
  const t = useTranslations('chartsUi')
  const text = { estimated: t('estimated'), logged: t('logged'), member: t('member'), empty: t('teamEmpty'), summary: t('teamSummary'), ...labels }
  const reducedMotion = usePrefersReducedMotion()
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  // Giữ nguyên tham chiếu mảng giữa các lần render để hover không kích hoạt lại animation vào.
  const chartData = useMemo(
    () =>
      (data ?? []).map((m) => ({
        name: m.full_name.split(' ').slice(-1)[0], // chỉ lấy tên cuối cho ngắn gọn
        fullName: m.full_name,
        estimated: m.estimated_hours,
        logged: m.logged_hours,
      })),
    [data]
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

  const opacityFor = (index: number) =>
    activeIndex === undefined || activeIndex === index ? 1 : DIM_OPACITY

  return (
    <div>
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            barGap={4}
            onMouseMove={(state) =>
              setActiveIndex(state?.isTooltipActive ? state.activeTooltipIndex : undefined)
            }
            onMouseLeave={() => setActiveIndex(undefined)}
          >
            <CartesianGrid {...gridProps} vertical={false} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} unit={t('hourUnit')} />
            <Tooltip
              cursor={<BandCursor />}
              content={
                <ChartTooltip
                  valueFormatter={(value) => t('hours', { value })}
                  labelFormatter={(label, payload) => (payload[0]?.payload?.fullName as string | undefined) ?? label}
                />
              }
              isAnimationActive={false}
            />
            <Legend
              iconType="square"
              iconSize={10}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value: string) => <span className="text-muted-foreground">{value}</span>}
            />
            <Bar
              dataKey="estimated"
              name={text.estimated}
              fill={chartColors.muted}
              fillOpacity={0.45}
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
              {...animationProps(reducedMotion)}
            >
              {chartData.map((entry, index) => (
                <Cell key={`est-${entry.fullName}-${index}`} opacity={opacityFor(index)} style={opacityTransition} />
              ))}
            </Bar>
            <Bar
              dataKey="logged"
              name={text.logged}
              fill={chartColors.primary}
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
              {...animationProps(reducedMotion)}
            >
              {chartData.map((entry, index) => (
                <Cell key={`log-${entry.fullName}-${index}`} opacity={opacityFor(index)} style={opacityTransition} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Bảng dữ liệu cho trình đọc màn hình. */}
      <table className="sr-only">
        <caption>{text.summary}</caption>
        <thead>
          <tr>
            <th scope="col">{text.member}</th>
            <th scope="col">{text.estimated}</th>
            <th scope="col">{text.logged}</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((m, index) => (
            <tr key={`${m.fullName}-${index}`}>
              <th scope="row">{m.fullName}</th>
              <td>{t('hours', { value: m.estimated })}</td>
              <td>{t('hours', { value: m.logged })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
