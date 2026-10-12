// Hàm bố cục Gantt thuần: không phụ thuộc React/DOM để kiểm thử độc lập và để
// component chỉ còn việc vẽ. Mọi phép tính ngày dùng UTC để không lệch múi giờ.
import type { CPMResponse, CPMTask } from '@/types/cpm.types'

export type GanttZoom = 'day' | 'week' | 'month'

/** Số pixel cho một ngày ở từng mức zoom. */
export const PX_PER_DAY: Record<GanttZoom, number> = { day: 32, week: 12, month: 4 }

/** Chiều cao một hàng task (px). Component dùng chung giá trị này để ảo hóa hàng. */
export const ROW_HEIGHT = 32

/** Bề rộng tối thiểu của một thanh có thời lượng > 0 để vẫn nhìn và bấm được. */
export const MIN_BAR_PX = 3

const DAY_MS = 86_400_000

/** Đổi 'YYYY-MM-DD' thành số ngày kể từ epoch (UTC). */
export function toDayNumber(iso: string): number {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  return Math.round(Date.UTC(year, month - 1, day) / DAY_MS)
}

/** Đổi số ngày kể từ epoch (UTC) về 'YYYY-MM-DD'. */
export function fromDayNumber(dayNumber: number): string {
  return new Date(dayNumber * DAY_MS).toISOString().slice(0, 10)
}

export interface GanttTick {
  /** Ngày ISO của vạch. */
  date: string
  x: number
  /** Vạch chính (đầu tuần/đầu tháng/đầu năm tùy zoom) được vẽ đậm hơn. */
  major: boolean
}

export interface GanttAxis {
  start: string
  end: string
  totalDays: number
  pxPerDay: number
  width: number
  ticks: GanttTick[]
}

export interface GanttRow {
  task: CPMTask
  index: number
  /** Tọa độ y của mép trên hàng. */
  y: number
  x: number
  width: number
  kind: 'bar' | 'milestone'
  critical: boolean
  /** Phần dự trữ (float) vẽ sau thanh, tính theo px. */
  floatWidth: number
}

export interface GanttLink {
  fromId: number
  toId: number
  /** Đường SVG (thuộc tính `d`) từ cuối task trước tới đầu task sau. */
  path: string
  /** Cả hai đầu đều thuộc đường găng. */
  critical: boolean
}

export interface GanttLayout {
  axis: GanttAxis | null
  rows: GanttRow[]
  /** Task thiếu ngày (chưa tính được lịch): hiển thị thành nhóm riêng, không vẽ thanh. */
  unscheduled: CPMTask[]
  links: GanttLink[]
  /** Tổng chiều cao vùng thanh (px). */
  height: number
}

type ScheduledTask = CPMTask & { early_start: string; early_finish: string }

function isScheduled(task: CPMTask): task is ScheduledTask {
  return Boolean(task.early_start && task.early_finish)
}

/** Mốc là task có thời lượng 0 ngày: vẽ hình kim cương thay vì thanh. */
export function isMilestone(task: CPMTask): boolean {
  return task.duration_days === 0
}

function buildTicks(startDay: number, totalDays: number, pxPerDay: number, zoom: GanttZoom): GanttTick[] {
  const ticks: GanttTick[] = []
  for (let offset = 0; offset <= totalDays; offset += 1) {
    const day = startDay + offset
    const date = new Date(day * DAY_MS)
    const weekday = date.getUTCDay()
    const monthDay = date.getUTCDate()
    let include: boolean
    let major: boolean
    if (zoom === 'day') {
      include = true
      major = weekday === 1
    } else if (zoom === 'week') {
      // Vạch vào thứ Hai; vạch chính ở thứ Hai đầu tiên của tháng.
      include = weekday === 1
      major = include && monthDay <= 7
    } else {
      include = monthDay === 1
      major = include && date.getUTCMonth() === 0
    }
    if (include) ticks.push({ date: fromDayNumber(day), x: offset * pxPerDay, major })
  }
  return ticks
}

/**
 * Dựng bố cục từ kết quả CPM.
 * - Trục chạy từ `anchor_date` tới `anchor_date + project_duration_days` (làm tròn lên,
 *   tối thiểu 1 ngày để trục không rỗng).
 * - Task có đủ ngày được xếp theo early_start rồi id; task thiếu ngày tách vào `unscheduled`.
 * - Mũi tên phụ thuộc chỉ nối giữa các task đã có hàng.
 */
export function computeGanttLayout(cpm: CPMResponse, zoom: GanttZoom): GanttLayout {
  const pxPerDay = PX_PER_DAY[zoom]

  if (!cpm.anchor_date) {
    // Không có mốc neo thì không đặt được task nào lên trục.
    return { axis: null, rows: [], unscheduled: cpm.tasks.slice(), links: [], height: 0 }
  }

  const scheduled = cpm.tasks.filter(isScheduled)
  const unscheduled = cpm.tasks.filter((task) => !isScheduled(task))
  const startDay = toDayNumber(cpm.anchor_date)
  const totalDays = Math.max(1, Math.ceil(cpm.project_duration_days))
  const axis: GanttAxis = {
    start: cpm.anchor_date,
    end: fromDayNumber(startDay + totalDays),
    totalDays,
    pxPerDay,
    width: totalDays * pxPerDay,
    ticks: buildTicks(startDay, totalDays, pxPerDay, zoom),
  }

  const ordered = scheduled
    .slice()
    .sort((a, b) => toDayNumber(a.early_start) - toDayNumber(b.early_start) || a.id - b.id)

  const rows: GanttRow[] = ordered.map((task, index) => {
    const x = (toDayNumber(task.early_start) - startDay) * pxPerDay
    const milestone = isMilestone(task)
    const width = milestone ? 0 : Math.max(task.duration_days * pxPerDay, MIN_BAR_PX)
    return {
      task,
      index,
      y: index * ROW_HEIGHT,
      x,
      width,
      kind: milestone ? 'milestone' : 'bar',
      critical: task.is_critical,
      floatWidth: Math.max(0, task.float_days) * pxPerDay,
    }
  })

  const byId = new Map(rows.map((row) => [row.task.id, row]))
  const links: GanttLink[] = []
  for (const row of rows) {
    for (const predecessorId of row.task.predecessor_ids) {
      const from = byId.get(predecessorId)
      if (!from) continue
      links.push({
        fromId: predecessorId,
        toId: row.task.id,
        path: linkPath(from, row),
        critical: from.critical && row.critical,
      })
    }
  }

  return { axis, rows, unscheduled, links, height: rows.length * ROW_HEIGHT }
}

/** Đường gấp khúc từ cuối task trước tới đầu task sau; mũi tên do marker SVG vẽ. */
export function linkPath(from: GanttRow, to: GanttRow): string {
  const startX = from.x + from.width
  const startY = from.y + ROW_HEIGHT / 2
  const endX = to.x
  const endY = to.y + ROW_HEIGHT / 2
  const gap = 8
  // Nếu task sau bắt đầu đủ xa thì rẽ một lần; nếu không thì vòng qua mép hàng đích.
  if (endX - startX >= gap * 2) {
    const midX = startX + gap
    return `M${startX},${startY} H${midX} V${endY} H${endX}`
  }
  const detourY = to.y > from.y ? to.y : to.y + ROW_HEIGHT
  return `M${startX},${startY} H${startX + gap} V${detourY} H${endX - gap} V${endY} H${endX}`
}

/** Khoảng chỉ số hàng [start, end) cần dựng cho vùng cuộn hiện tại, có đệm. */
export function visibleRowRange(
  scrollTop: number,
  viewportHeight: number,
  rowCount: number,
  overscan = 5
): { start: number; end: number } {
  const first = Math.floor(Math.max(0, scrollTop) / ROW_HEIGHT)
  const count = Math.ceil(Math.max(0, viewportHeight) / ROW_HEIGHT)
  return {
    start: Math.max(0, first - overscan),
    end: Math.min(rowCount, first + count + overscan),
  }
}
