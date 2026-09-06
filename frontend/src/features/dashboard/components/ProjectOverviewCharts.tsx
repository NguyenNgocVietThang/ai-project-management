'use client'

import { Users } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatMoney } from '@/lib/format'
import type { ProjectDashboardStats } from '../types/dashboard.types'

// Toàn bộ recharts (~400KB) chỉ được import ở đây, và trang overview nạp component
// này qua next/dynamic — nên thư viện nằm ở một chunk riêng tải sau lần vẽ đầu
// tiên, thay vì nằm trong bundle chính của route.

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; color?: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-medium text-muted-foreground">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

export function ProjectOverviewCharts({ stats }: { stats: ProjectDashboardStats }) {
  // Màu lấy từ token theme để biểu đồ không vỡ ở dark mode.
  const budgetData = [
    { name: 'Spent', value: stats.budget.spent, fill: 'hsl(var(--primary))' },
    {
      name: 'Remaining',
      value: Math.max(0, (stats.budget.budget ?? 0) - stats.budget.spent),
      fill: 'hsl(var(--muted))',
    },
  ]

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Biểu đồ vành khuyên phân bố công việc */}
        <section className="rounded-xl border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold">Task Status</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.task_distribution}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
              >
                {stats.task_distribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => (
                  <span className="text-xs text-muted-foreground">{v.replace('_', ' ')}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
            <p>Total: <strong>{stats.total_tasks}</strong></p>
            <p>Done: <strong>{stats.completed_tasks}</strong></p>
            <p className={stats.overdue_tasks > 0 ? 'font-medium text-destructive' : ''}>
              Overdue: <strong>{stats.overdue_tasks}</strong>
            </p>
            <p className={stats.critical_tasks > 0 ? 'font-medium text-orange-600 dark:text-orange-400' : ''}>
              Critical: <strong>{stats.critical_tasks}</strong>
            </p>
          </div>
        </section>

        {/* Biểu đồ vành khuyên ngân sách */}
        <section className="rounded-xl border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold">Budget</h2>
          {stats.budget.budget ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={budgetData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {budgetData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1 text-xs">
                <p>Spent: <strong>{formatMoney(stats.budget.spent, stats.budget.currency)}</strong></p>
                <p>Budget: <strong>{formatMoney(stats.budget.budget, stats.budget.currency)}</strong></p>
                {stats.budget.utilization_pct !== null && (
                  <p className={stats.budget.utilization_pct > 90 ? 'font-medium text-destructive' : ''}>
                    Utilization: <strong>{stats.budget.utilization_pct}%</strong>
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">No budget set</p>
          )}
        </section>

        {/* Biểu đồ đường burndown */}
        <section className="rounded-xl border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold">14-day Burndown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.burndown} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="remaining" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Remaining" />
              <Line type="monotone" dataKey="ideal" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Ideal" />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </div>

      {stats.team_utilization.length > 0 && (
        <section className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">Team Utilization</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.team_utilization} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="full_name" tick={{ fontSize: 10 }} />
              <YAxis unit="h" tick={{ fontSize: 10 }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="estimated_hours" name="Estimated (h)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="logged_hours" name="Logged (h)" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}
    </>
  )
}
