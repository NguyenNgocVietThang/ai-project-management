'use client'

/**
 * DonutChart – Recharts PieChart wrapper
 * Used for: Task Status Distribution, Budget breakdown
 */
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

export interface DonutSlice {
  name: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutSlice[]
  /** Text shown in the center of the donut */
  centerLabel?: string
  centerValue?: string | number
  height?: number
  showLegend?: boolean
}

export function DonutChart({
  data,
  centerLabel,
  centerValue,
  height = 260,
  showLegend = true,
}: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  if (total === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-muted-foreground" style={{ height }}>
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="75%"
          paddingAngle={2}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [value, name]}
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'hsl(var(--foreground))',
          }}
        />
        {showLegend && (
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
          />
        )}
        {/* Center label rendered via SVG foreignObject */}
        {centerLabel && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fontSize: '13px', fill: 'hsl(var(--muted-foreground))' }}
          >
            <tspan x="50%" dy="-0.6em" style={{ fontSize: '20px', fontWeight: 700, fill: 'hsl(var(--foreground))' }}>
              {centerValue ?? total}
            </tspan>
            <tspan x="50%" dy="1.4em" style={{ fontSize: '11px' }}>
              {centerLabel}
            </tspan>
          </text>
        )}
      </PieChart>
    </ResponsiveContainer>
  )
}
