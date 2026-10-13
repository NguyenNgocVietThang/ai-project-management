'use client'

/**
 * GanttChart: biểu đồ Gantt chỉ đọc vẽ bằng SVG từ kết quả CPM.
 * - Đường găng phân biệt bằng hoa văn sọc + viền đậm + nhãn chữ, không chỉ dựa màu.
 * - Ảo hóa theo hàng: chỉ dựng các hàng (và mũi tên) nằm trong khung nhìn.
 * - Màu lấy từ token theme (primary, destructive, border...) nên tự theo light/dark.
 * Chuỗi hiển thị nhận qua `labels` để trang gọi tự lo i18n.
 */
import { useId, useMemo, useState, type UIEvent } from 'react'
import { cn } from '@/lib/utils'
import type { CPMResponse } from '@/types/cpm.types'
import {
  computeGanttLayout,
  ROW_HEIGHT,
  visibleRowRange,
  type GanttRow,
  type GanttZoom,
} from '@/features/gantt/lib/layout'

export interface GanttChartLabels {
  /** aria-label cho toàn bộ biểu đồ. */
  chart: string
  /** Nhãn nhóm nút zoom. */
  zoom: string
  zoomDay: string
  zoomWeek: string
  zoomMonth: string
  /** Tiêu đề cột tên task. */
  task: string
  /** Nhãn đường găng (hiển thị thành chữ cạnh tên task và trong chú giải). */
  critical: string
  /** Nhãn task không thuộc đường găng (chú giải). */
  nonCritical: string
  milestone: string
  float: string
  /** Mô tả số ngày dự trữ, ví dụ "Float 2 days". */
  floatDays: (days: number) => string
  /** Tiêu đề nhóm task chưa có ngày. */
  unscheduledTitle: string
  unscheduledHint: string
  /** Nội dung khi dự án không có task. */
  empty: string
}

export interface GanttChartProps {
  data: CPMResponse
  labels: GanttChartLabels
  /** Zoom có kiểm soát; bỏ trống thì component tự giữ trạng thái. */
  zoom?: GanttZoom
  defaultZoom?: GanttZoom
  onZoomChange?: (zoom: GanttZoom) => void
  /** Chiều cao khung cuộn (px), cũng là cơ sở tính số hàng hiển thị. */
  viewportHeight?: number
  /** Locale định dạng ngày trên trục và trong aria-label. */
  locale?: string
  className?: string
}

const NAME_COLUMN_WIDTH = 240
const HEADER_HEIGHT = 36
const BAR_HEIGHT = 18
const RIGHT_PADDING = 24
const ZOOMS: GanttZoom[] = ['day', 'week', 'month']

function formatterFor(zoom: GanttZoom, locale: string): Intl.DateTimeFormat {
  const options: Intl.DateTimeFormatOptions =
    zoom === 'day'
      ? { day: 'numeric', timeZone: 'UTC' }
      : zoom === 'week'
        ? { day: 'numeric', month: 'short', timeZone: 'UTC' }
        : { month: 'short', year: 'numeric', timeZone: 'UTC' }
  return new Intl.DateTimeFormat(locale, options)
}

function utcDate(iso: string): Date {
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`)
}

export function GanttChart({
  data,
  labels,
  zoom: controlledZoom,
  defaultZoom = 'week',
  onZoomChange,
  viewportHeight = 480,
  locale = 'en',
  className,
}: GanttChartProps) {
  const [internalZoom, setInternalZoom] = useState<GanttZoom>(defaultZoom)
  const zoom = controlledZoom ?? internalZoom
  const [scrollTop, setScrollTop] = useState(0)
  // useId trả về dạng ":r0:"; bỏ ký tự đặc biệt để dùng được trong url(#...).
  const idPrefix = `gantt-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const criticalPatternId = `${idPrefix}-critical`
  const arrowId = `${idPrefix}-arrow`
  const criticalArrowId = `${idPrefix}-arrow-critical`

  const layout = useMemo(() => computeGanttLayout(data, zoom), [data, zoom])
  const tickFormatter = useMemo(() => formatterFor(zoom, locale), [zoom, locale])
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }),
    [locale]
  )

  const bodyViewport = Math.max(ROW_HEIGHT, viewportHeight - HEADER_HEIGHT)
  const range = visibleRowRange(Math.max(0, scrollTop - HEADER_HEIGHT), bodyViewport, layout.rows.length)
  const visibleRows = layout.rows.slice(range.start, range.end)

  const rowIndexById = useMemo(
    () => new Map(layout.rows.map((row) => [row.task.id, row.index])),
    [layout.rows]
  )
  // Mũi tên có đoạn dọc đi qua khung nhìn thì mới vẽ.
  const visibleLinks = layout.links.filter((link) => {
    const a = rowIndexById.get(link.fromId) ?? 0
    const b = rowIndexById.get(link.toId) ?? 0
    return Math.min(a, b) < range.end && Math.max(a, b) >= range.start
  })

  const changeZoom = (next: GanttZoom) => {
    if (controlledZoom === undefined) setInternalZoom(next)
    onZoomChange?.(next)
  }

  const onScroll = (event: UIEvent<HTMLDivElement>) => setScrollTop(event.currentTarget.scrollTop)

  const describeRow = (row: GanttRow): string => {
    const task = row.task
    const parts = [task.name]
    if (task.early_start && task.early_finish) {
      const start = dateFormatter.format(utcDate(task.early_start))
      const finish = dateFormatter.format(utcDate(task.early_finish))
      parts.push(row.kind === 'milestone' ? start : `${start} - ${finish}`)
    }
    if (row.kind === 'milestone') parts.push(labels.milestone)
    if (row.critical) parts.push(labels.critical)
    else if (task.float_days > 0) parts.push(labels.floatDays(task.float_days))
    return parts.join(', ')
  }

  const zoomLabel: Record<GanttZoom, string> = {
    day: labels.zoomDay,
    week: labels.zoomWeek,
    month: labels.zoomMonth,
  }

  if (data.tasks.length === 0) {
    return (
      <div className={cn('rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground', className)}>
        {labels.empty}
      </div>
    )
  }

  const timelineWidth = (layout.axis?.width ?? 0) + RIGHT_PADDING
  const ticks = layout.axis?.ticks ?? []

  return (
    <section aria-label={labels.chart} className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label={labels.zoom} className="inline-flex rounded-md border border-border bg-card p-0.5">
          {ZOOMS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={zoom === option}
              onClick={() => changeZoom(option)}
              className={cn(
                'rounded px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                zoom === option ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
              )}
            >
              {zoomLabel[option]}
            </button>
          ))}
        </div>
        <ul className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <svg width="22" height="12" aria-hidden="true">
              <rect x="1" y="1" width="20" height="10" rx="2" className="fill-destructive/20 stroke-destructive" strokeWidth={2} />
              <rect x="1" y="1" width="20" height="10" rx="2" fill={`url(#${criticalPatternId})`} />
            </svg>
            {labels.critical}
          </li>
          <li className="flex items-center gap-1.5">
            <svg width="22" height="12" aria-hidden="true">
              <rect x="1" y="1" width="20" height="10" rx="2" className="fill-primary/70 stroke-primary" strokeWidth={1} />
            </svg>
            {labels.nonCritical}
          </li>
          <li className="flex items-center gap-1.5">
            <svg width="14" height="14" aria-hidden="true">
              <path d="M7,1 L13,7 L7,13 L1,7 Z" className="fill-foreground" />
            </svg>
            {labels.milestone}
          </li>
          <li className="flex items-center gap-1.5">
            <svg width="22" height="12" aria-hidden="true">
              <line x1="1" y1="6" x2="21" y2="6" className="stroke-muted-foreground" strokeWidth={2} strokeDasharray="3 2" />
            </svg>
            {labels.float}
          </li>
        </ul>
      </div>

      {/* Định nghĩa dùng chung: hoa văn sọc cho đường găng và đầu mũi tên. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <pattern id={criticalPatternId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" className="stroke-destructive" strokeWidth={2} />
          </pattern>
          <marker id={arrowId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-muted-foreground" />
          </marker>
          <marker id={criticalArrowId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-destructive" />
          </marker>
        </defs>
      </svg>

      {layout.rows.length > 0 && (
        <div
          data-testid="gantt-scroll"
          onScroll={onScroll}
          className="relative overflow-auto rounded-lg border border-border bg-card"
          style={{ height: viewportHeight }}
        >
          <div className="relative" style={{ width: NAME_COLUMN_WIDTH + timelineWidth }}>
            {/* Hàng tiêu đề: cột tên + trục thời gian, dính trên cùng khi cuộn dọc. */}
            <div className="sticky top-0 z-20 flex border-b border-border bg-card" style={{ height: HEADER_HEIGHT }}>
              <div
                className="sticky left-0 z-30 flex items-center border-r border-border bg-card px-3 text-xs font-semibold text-muted-foreground"
                style={{ width: NAME_COLUMN_WIDTH, minWidth: NAME_COLUMN_WIDTH }}
              >
                {labels.task}
              </div>
              <svg width={timelineWidth} height={HEADER_HEIGHT} aria-hidden="true" className="shrink-0">
                {ticks.map((tick) => (
                  <g key={tick.date}>
                    <line
                      x1={tick.x}
                      x2={tick.x}
                      y1={tick.major ? 0 : HEADER_HEIGHT / 2}
                      y2={HEADER_HEIGHT}
                      className="stroke-border"
                    />
                    <text x={tick.x + 3} y={HEADER_HEIGHT - 10} className={cn('fill-muted-foreground text-[10px]', tick.major && 'font-semibold fill-foreground')}>
                      {tickFormatter.format(utcDate(tick.date))}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="relative flex" style={{ height: layout.height }}>
              {/* Cột tên task: chỉ dựng các hàng nhìn thấy, định vị tuyệt đối theo y. */}
              <div
                role="list"
                aria-label={labels.task}
                className="sticky left-0 z-10 border-r border-border bg-card"
                style={{ width: NAME_COLUMN_WIDTH, minWidth: NAME_COLUMN_WIDTH, height: layout.height }}
              >
                {visibleRows.map((row) => (
                  <div
                    key={row.task.id}
                    role="listitem"
                    aria-setsize={layout.rows.length}
                    aria-posinset={row.index + 1}
                    aria-label={describeRow(row)}
                    data-testid="gantt-row"
                    className="absolute left-0 right-0 flex items-center gap-2 border-b border-border/60 px-3 text-xs"
                    style={{ top: row.y, height: ROW_HEIGHT }}
                  >
                    <span className={cn('truncate', row.critical ? 'font-semibold text-foreground' : 'text-foreground')} title={row.task.name}>
                      {row.task.name}
                    </span>
                    {row.critical && (
                      <span className="shrink-0 rounded border border-destructive px-1 text-[10px] font-semibold uppercase tracking-wide text-destructive">
                        {labels.critical}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <svg width={timelineWidth} height={layout.height} className="shrink-0" aria-hidden="true">
                {/* Lưới dọc theo vạch trục. */}
                {ticks.map((tick) => (
                  <line
                    key={tick.date}
                    x1={tick.x}
                    x2={tick.x}
                    y1={0}
                    y2={layout.height}
                    className={tick.major ? 'stroke-border' : 'stroke-border/50'}
                  />
                ))}

                {visibleLinks.map((link) => (
                  <path
                    key={`${link.fromId}-${link.toId}`}
                    d={link.path}
                    fill="none"
                    data-testid="gantt-link"
                    data-critical={link.critical || undefined}
                    className={link.critical ? 'stroke-destructive' : 'stroke-muted-foreground'}
                    strokeWidth={link.critical ? 2 : 1}
                    strokeDasharray={link.critical ? undefined : '4 3'}
                    markerEnd={`url(#${link.critical ? criticalArrowId : arrowId})`}
                  />
                ))}

                {visibleRows.map((row) => {
                  const centerY = row.y + ROW_HEIGHT / 2
                  if (row.kind === 'milestone') {
                    const half = BAR_HEIGHT / 2
                    return (
                      <g key={row.task.id} data-testid="gantt-milestone" data-critical={row.critical || undefined}>
                        <title>{describeRow(row)}</title>
                        <path
                          d={`M${row.x},${centerY - half} L${row.x + half},${centerY} L${row.x},${centerY + half} L${row.x - half},${centerY} Z`}
                          className={row.critical ? 'fill-destructive stroke-foreground' : 'fill-foreground stroke-card'}
                          strokeWidth={row.critical ? 2 : 1}
                        />
                      </g>
                    )
                  }
                  const top = centerY - BAR_HEIGHT / 2
                  return (
                    <g key={row.task.id} data-testid="gantt-bar" data-critical={row.critical || undefined}>
                      <title>{describeRow(row)}</title>
                      {row.floatWidth > 0 && (
                        <line
                          x1={row.x + row.width}
                          x2={row.x + row.width + row.floatWidth}
                          y1={centerY}
                          y2={centerY}
                          className="stroke-muted-foreground"
                          strokeWidth={2}
                          strokeDasharray="3 2"
                        />
                      )}
                      <rect
                        x={row.x}
                        y={top}
                        width={row.width}
                        height={BAR_HEIGHT}
                        rx={3}
                        className={row.critical ? 'fill-destructive/20 stroke-destructive' : 'fill-primary/70 stroke-primary'}
                        strokeWidth={row.critical ? 2 : 1}
                      />
                      {row.critical && (
                        <rect x={row.x} y={top} width={row.width} height={BAR_HEIGHT} rx={3} fill={`url(#${criticalPatternId})`} />
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        </div>
      )}

      {layout.unscheduled.length > 0 && (
        <div className="rounded-lg border border-dashed border-border bg-card p-4" data-testid="gantt-unscheduled">
          <h3 className="text-sm font-semibold text-foreground">{labels.unscheduledTitle}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{labels.unscheduledHint}</p>
          <ul className="mt-2 space-y-1 text-xs text-foreground">
            {layout.unscheduled.map((task) => (
              <li key={task.id}>{task.name}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
