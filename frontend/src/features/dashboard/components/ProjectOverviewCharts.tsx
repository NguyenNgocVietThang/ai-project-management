'use client'

import { useMemo, useState } from 'react'
import { Users } from 'lucide-react'
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
import { BurndownChart } from '@/components/charts/BurndownChart'
import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { DonutChart, type DonutSlice } from '@/components/charts/DonutChart'
import {
  animationProps,
  axisProps,
  axisTick,
  BandCursor,
  chartColors,
  colorForStatus,
  DIM_OPACITY,
  gridProps,
  opacityTransition,
  usePrefersReducedMotion,
} from '@/components/charts/chartTheme'
import { formatMoney } from '@/lib/format'
import type { ProjectDashboardStats, TeamMemberUtilization } from '../types/dashboard.types'

// recharts (~400KB) chỉ import ở đây và trang overview nạp qua next/dynamic, nên nằm ở chunk riêng
// tải sau lần vẽ đầu.

/** "IN_PROGRESS" -> "In progress" để chú giải đọc được bằng chữ. */
function humanizeStatus(status: string): string {
  const words = status.replace(/_/g, ' ').toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

const ROW_SIZE = 40

/**
 * Biểu đồ cột ngang cho mức sử dụng nhân sự: tên đầy đủ đọc được trên trục Y.
 * Hover: dải ngang bo góc phía sau hàng, hàng đang hover giữ độ đậm, các hàng khác mờ đi.
 */
function TeamUtilizationChart({ data }: { data: TeamMemberUtilization[] }) {
  const reducedMotion = usePrefersReducedMotion()
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  const opacityFor = (index: number) =>
    activeIndex === undefined || activeIndex === index ? 1 : DIM_OPACITY
  const height = Math.max(160, data.length * ROW_SIZE + 56)

  return (
    <div>
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
            barGap={3}
            onMouseMove={(state) =>
              setActiveIndex(state?.isTooltipActive ? state.activeTooltipIndex : undefined)
            }
            onMouseLeave={() => setActiveIndex(undefined)}
          >
            <CartesianGrid {...gridProps} horizontal={false} />
            <XAxis type="number" {...axisProps} unit="h" />
            <YAxis
              type="category"
              dataKey="full_name"
              {...axisProps}
              tick={{ ...axisTick, fill: 'hsl(var(--foreground))' }}
              width={120}
            />
            <Tooltip
              cursor={<BandCursor />}
              content={<ChartTooltip valueFormatter={(value) => `${value}h`} />}
              isAnimationActive={false}
            />
            <Legend
              iconType="square"
              iconSize={10}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value: string) => <span className="text-muted-foreground">{value}</span>}
            />
            <Bar
              dataKey="estimated_hours"
              name="Estimated (h)"
              fill={chartColors.muted}
              fillOpacity={0.45}
              radius={[0, 6, 6, 0]}
              maxBarSize={14}
              {...animationProps(reducedMotion)}
            >
              {data.map((m, index) => (
                <Cell key={`est-${m.user_id}`} opacity={opacityFor(index)} style={opacityTransition} />
              ))}
            </Bar>
            <Bar
              dataKey="logged_hours"
              name="Logged (h)"
              fill={chartColors.primary}
              radius={[0, 6, 6, 0]}
              maxBarSize={14}
              {...animationProps(reducedMotion)}
            >
              {data.map((m, index) => (
                <Cell key={`log-${m.user_id}`} opacity={opacityFor(index)} style={opacityTransition} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Bảng dữ liệu cho trình đọc màn hình. */}
      <table className="sr-only">
        <caption>Team utilization: estimated versus logged hours per member</caption>
        <thead>
          <tr>
            <th scope="col">Member</th>
            <th scope="col">Estimated (h)</th>
            <th scope="col">Logged (h)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((m) => (
            <tr key={m.user_id}>
              <th scope="row">{m.full_name}</th>
              <td>{m.estimated_hours}</td>
              <td>{m.logged_hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ProjectOverviewCharts({ stats }: { stats: ProjectDashboardStats }) {
  // Màu trạng thái lấy từ token theme (thay hex backend) để biểu đồ không vỡ ở dark mode.
  const statusData = useMemo<DonutSlice[]>(
    () =>
      stats.task_distribution.map((entry, index) => ({
        name: humanizeStatus(entry.status),
        value: entry.count,
        color: colorForStatus(entry.status, index),
      })),
    [stats.task_distribution]
  )

  const budgetData = useMemo<DonutSlice[]>(
    () => [
      { name: 'Spent', value: stats.budget.spent, color: chartColors.primary },
      {
        name: 'Remaining',
        value: Math.max(0, (stats.budget.budget ?? 0) - stats.budget.spent),
        color: chartColors.track,
      },
    ],
    [stats.budget.spent, stats.budget.budget]
  )

  const money = (value: number) => formatMoney(value, stats.budget.currency)

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Biểu đồ vành khuyên phân bố công việc */}
        <section className="rounded-xl border bg-card p-5 shadow-soft">
          <h2 className="mb-4 text-h4">Task Status</h2>
          <DonutChart
            data={statusData}
            height={220}
            centerValue={stats.total_tasks}
            centerLabel="Tasks"
            summaryLabel="Task status distribution"
          />
          <div className="mt-2 grid grid-cols-2 gap-1 text-caption tabular-nums">
            <p>Total: <strong>{stats.total_tasks}</strong></p>
            <p>Done: <strong>{stats.completed_tasks}</strong></p>
            <p className={stats.overdue_tasks > 0 ? 'font-medium text-destructive' : ''}>
              Overdue: <strong>{stats.overdue_tasks}</strong>
            </p>
            <p className={stats.critical_tasks > 0 ? 'font-medium text-warning' : ''}>
              Critical: <strong>{stats.critical_tasks}</strong>
            </p>
          </div>
        </section>

        {/* Biểu đồ vành khuyên ngân sách */}
        <section className="rounded-xl border bg-card p-5 shadow-soft">
          <h2 className="mb-4 text-h4">Budget</h2>
          {stats.budget.budget ? (
            <>
              <DonutChart
                data={budgetData}
                height={220}
                showLegend
                valueFormatter={money}
                centerValue={
                  stats.budget.utilization_pct !== null ? `${stats.budget.utilization_pct}%` : money(stats.budget.spent)
                }
                centerLabel={stats.budget.utilization_pct !== null ? 'Utilization' : 'Spent'}
                summaryLabel="Budget breakdown"
              />
              <div className="mt-2 space-y-1 text-caption tabular-nums">
                <p>Spent: <strong>{money(stats.budget.spent)}</strong></p>
                <p>Budget: <strong>{money(stats.budget.budget)}</strong></p>
                {stats.budget.utilization_pct !== null && (
                  <p className={stats.budget.utilization_pct > 90 ? 'font-medium text-destructive' : ''}>
                    Utilization: <strong>{stats.budget.utilization_pct}%</strong>
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="py-10 text-center text-body-sm text-muted-foreground">No budget set</p>
          )}
        </section>

        {/* Biểu đồ vùng burndown */}
        <section className="rounded-xl border bg-card p-5 shadow-soft">
          <h2 className="mb-4 text-h4">14-day Burndown</h2>
          <BurndownChart data={stats.burndown} height={240} />
        </section>
      </div>

      {stats.team_utilization.length > 0 && (
        <section className="rounded-xl border bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" aria-hidden="true" />
            <h2 className="text-h4">Team Utilization</h2>
          </div>
          <TeamUtilizationChart data={stats.team_utilization} />
        </section>
      )}
    </>
  )
}
