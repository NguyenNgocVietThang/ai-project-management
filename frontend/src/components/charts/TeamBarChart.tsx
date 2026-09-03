'use client'

/**
 * TeamBarChart – Recharts BarChart wrapper
 * Hiển thị mức sử dụng nhân sự: giờ ước tính so với giờ đã ghi nhận của từng thành viên
 */
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TeamMemberUtilization } from '@/features/dashboard/types/dashboard.types'

interface TeamBarChartProps {
  data: TeamMemberUtilization[]
  height?: number
}

export function TeamBarChart({ data, height = 220 }: TeamBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground"
        style={{ height }}
      >
        No team data available
      </div>
    )
  }

  const chartData = data.map((m) => ({
    name: m.full_name.split(' ').slice(-1)[0], // chỉ lấy tên cuối cho ngắn gọn
    fullName: m.full_name,
    Estimated: m.estimated_hours,
    Logged: m.logged_hours,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
          unit="h"
        />
        <Tooltip
          formatter={(value: number, name: string) => [`${value}h`, name]}
          labelFormatter={(label, payload) =>
            payload?.[0]?.payload?.fullName ?? label
          }
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'hsl(var(--foreground))',
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
        />
        <Bar dataKey="Estimated" fill="hsl(var(--muted-foreground))" radius={[3, 3, 0, 0]} opacity={0.5} />
        <Bar dataKey="Logged" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
