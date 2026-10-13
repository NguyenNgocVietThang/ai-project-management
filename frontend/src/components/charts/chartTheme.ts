'use client'

/**
 * chartTheme – cấu hình dùng chung cho mọi biểu đồ Recharts.
 * - Màu lấy từ biến CSS của theme nên tự đổi theo light/dark, không hard-code hex.
 * - Preset con trỏ (cursor) theo từng loại biểu đồ: đường dọc nét đứt cho line/area,
 *   cột nền bo góc cho bar dọc, dải ngang cho bar ngang.
 * - Hook `usePrefersReducedMotion` để tắt animation khi người dùng yêu cầu giảm chuyển động.
 */
import { createElement, useEffect, useState } from 'react'

/** Bảng màu ngữ nghĩa (chuỗi CSS dùng trực tiếp cho fill/stroke của SVG). */
export const chartColors = {
  primary: 'hsl(var(--primary))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  info: 'hsl(var(--info))',
  destructive: 'hsl(var(--destructive))',
  muted: 'hsl(var(--muted-foreground))',
  /** Nền nhạt cho phần "còn lại" hoặc rãnh của biểu đồ. */
  track: 'hsl(var(--muted))',
  grid: 'hsl(var(--border))',
  /** Màu nền thẻ, dùng làm viền tách lát donut và viền chấm active. */
  surface: 'hsl(var(--card))',
} as const

/** Thứ tự màu cho các chuỗi dữ liệu không có ngữ nghĩa riêng. */
export const seriesPalette: readonly string[] = [
  chartColors.primary,
  chartColors.info,
  chartColors.success,
  chartColors.warning,
  chartColors.destructive,
  chartColors.muted,
]

/** Màu trạng thái task theo token (thay cho hex backend trả về). */
export const statusColors: Record<string, string> = {
  TODO: chartColors.muted,
  IN_PROGRESS: chartColors.info,
  IN_REVIEW: chartColors.warning,
  DONE: chartColors.success,
  BLOCKED: chartColors.destructive,
}

/** Trả màu token cho trạng thái; không biết trạng thái thì lấy theo bảng màu tuần tự. */
export function colorForStatus(status: string, index = 0): string {
  return statusColors[status.toUpperCase()] ?? seriesPalette[index % seriesPalette.length]
}

/** Kiểu chữ cho nhãn trục. */
export const axisTick = { fill: 'hsl(var(--muted-foreground))', fontSize: 12 } as const

/** Props chung cho XAxis/YAxis: không vạch, không đường trục, chữ muted. */
export const axisProps = {
  tick: axisTick,
  tickLine: false,
  axisLine: false,
} as const

/** Props chung cho CartesianGrid. */
export const gridProps = {
  stroke: chartColors.grid,
  strokeDasharray: '3 3',
} as const

/** Con trỏ dọc nét đứt cho biểu đồ đường/vùng. */
export const lineCursor = {
  stroke: chartColors.primary,
  strokeWidth: 1,
  strokeDasharray: '4 4',
} as const

/** Chấm nổi bật khi hover điểm trên đường. */
export const lineActiveDot = { r: 6, strokeWidth: 2, stroke: chartColors.surface } as const

/** Thời lượng animation vào (ms). */
export const ANIMATION_DURATION = 600

/** Độ mờ của các phần tử không được hover. */
export const DIM_OPACITY = 0.45

/** Chuyển tiếp độ mờ dùng cho Cell khi hover. */
export const opacityTransition = { transition: 'opacity 200ms' } as const

interface CursorShapeProps {
  x?: number
  y?: number
  width?: number
  height?: number
}

/**
 * Con trỏ dạng cột nền bo góc (Recharts tự truyền x/y/width/height).
 * Bọc bằng hàm để dùng: `cursor={<BandCursor />}`.
 */
export function BandCursor({ x = 0, y = 0, width = 0, height = 0 }: CursorShapeProps) {
  if (width <= 0 || height <= 0) return null
  return createElement('rect', {
    x,
    y,
    width,
    height,
    rx: 6,
    ry: 6,
    fill: 'hsl(var(--muted))',
    opacity: 0.6,
    pointerEvents: 'none',
    className: 'recharts-tooltip-cursor',
  })
}

/** Truy vấn media cho giảm chuyển động. */
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Trả true khi người dùng bật giảm chuyển động.
 * An toàn với SSR: mặc định false trên server, cập nhật sau khi mount.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const media = window.matchMedia(REDUCED_MOTION_QUERY)
    setReduced(media.matches)
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    // Safari cũ chỉ có addListener.
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    }
    media.addListener(onChange)
    return () => media.removeListener(onChange)
  }, [])
  return reduced
}

/** Props animation cho series Recharts theo trạng thái giảm chuyển động. */
export function animationProps(reducedMotion: boolean) {
  return {
    isAnimationActive: !reducedMotion,
    animationDuration: ANIMATION_DURATION,
    animationEasing: 'ease-out' as const,
  }
}
