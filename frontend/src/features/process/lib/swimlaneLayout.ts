// Hàm bố cục swimlane thuần: không phụ thuộc React/DOM để kiểm thử độc lập và để
// phía server (B4) có thể vẽ PNG theo cùng quy tắc.
//
// Quy tắc:
// 1. Mỗi lane là một dải ngang, theo thứ tự `lanes`; node có lane_id lạ được gom
//    vào một lane phụ cuối cùng (tên = lane_id).
// 2. Hạng (cột) = đường dài nhất từ gốc trên đồ thị đã bỏ cạnh ngược. Gốc là các
//    start_event (theo thứ tự nodes); node chưa thăm được duyệt tiếp như gốc mới.
//    Cạnh ngược = cạnh tới node đang nằm trên ngăn xếp DFS (kể cả tự lặp); cạnh
//    ngược không làm tăng hạng.
// 3. Trong một lane, các node cùng hạng xếp chồng thành các hàng con theo thứ tự
//    nodes; chiều cao lane = số hàng con lớn nhất * ROW_H.
// 4. Tâm node: x = LANE_HEADER_W + rank*COL_W + COL_W/2; y = đỉnh lane + slot*ROW_H + ROW_H/2.
// 5. Cạnh xuôi: ra cạnh phải nguồn, gấp khúc tại giữa hai node, vào cạnh trái đích.
//    Cạnh cùng cột: đi dọc từ đáy/đỉnh. Cạnh ngược: ra đáy nguồn, đi xuống dưới
//    rồi vòng về đáy đích. Nhãn đặt ở giữa đoạn giữa.
import type { ProcessFlow, ProcessModelGraph, ProcessNode, ProcessNodeType } from '@/features/process/types'

export const LANE_HEADER_W = 120
export const COL_W = 180
export const ROW_H = 96
export const TASK_W = 140
export const TASK_H = 56
export const EVENT_D = 36
export const GATEWAY_D = 48
/** Khoảng đi vòng dưới node cho cạnh ngược. */
export const BACK_EDGE_DROP = 14

export type NodeShape = 'circle' | 'rect' | 'diamond'

export interface LaidOutNode {
  id: string
  type: ProcessNodeType
  name: string
  laneId: string
  shape: NodeShape
  rank: number
  slot: number
  /** Tâm node. */
  x: number
  y: number
  width: number
  height: number
}

export interface LaidOutLane {
  id: string
  name: string
  y: number
  height: number
}

export interface Point { x: number; y: number }

export interface LaidOutEdge {
  id: string
  source: string
  target: string
  label: string
  isBackEdge: boolean
  points: Point[]
  labelPos: Point
}

export interface SwimlaneLayout {
  width: number
  height: number
  lanes: LaidOutLane[]
  nodes: LaidOutNode[]
  edges: LaidOutEdge[]
}

export function shapeOf(type: ProcessNodeType): NodeShape {
  if (type === 'task') return 'rect'
  if (type === 'exclusive_gateway' || type === 'parallel_gateway') return 'diamond'
  return 'circle'
}

function sizeOf(shape: NodeShape): { width: number; height: number } {
  if (shape === 'rect') return { width: TASK_W, height: TASK_H }
  if (shape === 'diamond') return { width: GATEWAY_D, height: GATEWAY_D }
  return { width: EVENT_D, height: EVENT_D }
}

/** Tìm tập id cạnh ngược bằng DFS lặp (không đệ quy để an toàn với đồ thị lớn). */
export function findBackEdges(nodes: ProcessNode[], flows: ProcessFlow[]): Set<string> {
  const ids = new Set(nodes.map(n => n.id))
  const out = new Map<string, ProcessFlow[]>()
  for (const flow of flows) {
    if (!ids.has(flow.source) || !ids.has(flow.target)) continue
    const list = out.get(flow.source) ?? []
    list.push(flow)
    out.set(flow.source, list)
  }
  const roots = [...nodes.filter(n => n.type === 'start_event'), ...nodes]
  const state = new Map<string, 'onStack' | 'done'>()
  const back = new Set<string>()
  for (const root of roots) {
    if (state.has(root.id)) continue
    const stack: Array<{ id: string; i: number }> = [{ id: root.id, i: 0 }]
    state.set(root.id, 'onStack')
    while (stack.length) {
      const frame = stack[stack.length - 1]
      const edges = out.get(frame.id) ?? []
      if (frame.i >= edges.length) {
        state.set(frame.id, 'done')
        stack.pop()
        continue
      }
      const edge = edges[frame.i++]
      const s = state.get(edge.target)
      if (s === 'onStack') back.add(edge.id)
      else if (!s) {
        state.set(edge.target, 'onStack')
        stack.push({ id: edge.target, i: 0 })
      }
    }
  }
  return back
}

/** Hạng = đường dài nhất trên DAG (đã bỏ cạnh ngược), tính theo thứ tự topo Kahn. */
export function computeRanks(nodes: ProcessNode[], flows: ProcessFlow[], backEdges: Set<string>): Map<string, number> {
  const ids = new Set(nodes.map(n => n.id))
  const forward = flows.filter(f => !backEdges.has(f.id) && ids.has(f.source) && ids.has(f.target))
  const indeg = new Map(nodes.map(n => [n.id, 0]))
  for (const f of forward) indeg.set(f.target, (indeg.get(f.target) ?? 0) + 1)
  const rank = new Map(nodes.map(n => [n.id, 0]))
  const queue = nodes.filter(n => indeg.get(n.id) === 0).map(n => n.id)
  while (queue.length) {
    const id = queue.shift() as string
    for (const f of forward) {
      if (f.source !== id) continue
      rank.set(f.target, Math.max(rank.get(f.target) ?? 0, (rank.get(id) ?? 0) + 1))
      const d = (indeg.get(f.target) ?? 0) - 1
      indeg.set(f.target, d)
      if (d === 0) queue.push(f.target)
    }
  }
  return rank
}

export function layoutSwimlanes(model: ProcessModelGraph): SwimlaneLayout {
  const nodes = model.nodes
  const backEdges = findBackEdges(nodes, model.flows)
  const ranks = computeRanks(nodes, model.flows, backEdges)

  // Lane khai báo + lane phụ cho lane_id không khớp.
  const laneDefs = [...model.lanes]
  const known = new Set(laneDefs.map(l => l.id))
  for (const n of nodes) {
    if (!known.has(n.lane_id)) {
      known.add(n.lane_id)
      laneDefs.push({ id: n.lane_id, name: n.lane_id })
    }
  }

  // Gán hàng con trong mỗi (lane, hạng).
  const slotCount = new Map<string, number>()
  const slotOf = new Map<string, number>()
  const laneRows = new Map<string, number>()
  for (const n of nodes) {
    const key = `${n.lane_id}\u0000${ranks.get(n.id) ?? 0}`
    const slot = slotCount.get(key) ?? 0
    slotCount.set(key, slot + 1)
    slotOf.set(n.id, slot)
    laneRows.set(n.lane_id, Math.max(laneRows.get(n.lane_id) ?? 1, slot + 1))
  }

  let y = 0
  const lanes: LaidOutLane[] = laneDefs.map(l => {
    const height = (laneRows.get(l.id) ?? 1) * ROW_H
    const lane = { id: l.id, name: l.name, y, height }
    y += height
    return lane
  })
  const laneTop = new Map(lanes.map(l => [l.id, l.y]))

  const laidNodes: LaidOutNode[] = nodes.map(n => {
    const shape = shapeOf(n.type)
    const rank = ranks.get(n.id) ?? 0
    const slot = slotOf.get(n.id) ?? 0
    return {
      id: n.id, type: n.type, name: n.name, laneId: n.lane_id, shape, rank, slot,
      x: LANE_HEADER_W + rank * COL_W + COL_W / 2,
      y: (laneTop.get(n.lane_id) ?? 0) + slot * ROW_H + ROW_H / 2,
      ...sizeOf(shape),
    }
  })
  const byId = new Map(laidNodes.map(n => [n.id, n]))

  const edges: LaidOutEdge[] = []
  for (const f of model.flows) {
    const s = byId.get(f.source)
    const t = byId.get(f.target)
    if (!s || !t) continue
    const isBackEdge = backEdges.has(f.id)
    let points: Point[]
    if (isBackEdge) {
      const low = Math.max(s.y + s.height / 2, t.y + t.height / 2) + BACK_EDGE_DROP
      points = [{ x: s.x, y: s.y + s.height / 2 }, { x: s.x, y: low }, { x: t.x, y: low }, { x: t.x, y: t.y + t.height / 2 }]
    } else if (s.rank === t.rank) {
      const down = t.y > s.y
      const sy = s.y + (down ? s.height / 2 : -s.height / 2)
      const ty = t.y + (down ? -t.height / 2 : t.height / 2)
      points = [{ x: s.x, y: sy }, { x: s.x, y: (sy + ty) / 2 }, { x: t.x, y: (sy + ty) / 2 }, { x: t.x, y: ty }]
    } else {
      const sx = s.x + s.width / 2
      const tx = t.x - t.width / 2
      const mx = (sx + tx) / 2
      points = [{ x: sx, y: s.y }, { x: mx, y: s.y }, { x: mx, y: t.y }, { x: tx, y: t.y }]
    }
    const labelPos = { x: (points[1].x + points[2].x) / 2, y: (points[1].y + points[2].y) / 2 }
    edges.push({ id: f.id, source: f.source, target: f.target, label: f.label ?? '', isBackEdge, points, labelPos })
  }

  const maxRank = laidNodes.reduce((m, n) => Math.max(m, n.rank), 0)
  return {
    width: LANE_HEADER_W + (maxRank + 1) * COL_W,
    height: Math.max(y, ROW_H),
    lanes,
    nodes: laidNodes,
    edges,
  }
}
