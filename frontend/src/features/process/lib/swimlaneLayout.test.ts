import { describe, expect, it } from 'vitest'
import type { ProcessModelGraph } from '@/features/process/types'
import { COL_W, LANE_HEADER_W, ROW_H, layoutSwimlanes } from './swimlaneLayout'

// Quy trình mẫu: vòng lặp "Sửa" -> "Duyệt" là cạnh ngược.
const model: ProcessModelGraph = {
  name: 'Duyệt đơn',
  lanes: [{ id: 'kh', name: 'Khách hàng' }, { id: 'nv', name: 'Nhân viên' }],
  nodes: [
    { id: 's', type: 'start_event', name: 'Bắt đầu', lane_id: 'kh' },
    { id: 'gui', type: 'task', name: 'Gửi đơn', lane_id: 'kh' },
    { id: 'duyet', type: 'task', name: 'Duyệt', lane_id: 'nv' },
    { id: 'g', type: 'exclusive_gateway', name: 'Hợp lệ?', lane_id: 'nv' },
    { id: 'sua', type: 'task', name: 'Sửa', lane_id: 'kh' },
    { id: 'p', type: 'parallel_gateway', name: '', lane_id: 'nv' },
    { id: 'e', type: 'end_event', name: 'Kết thúc', lane_id: 'nv' },
  ],
  flows: [
    { id: 'f1', source: 's', target: 'gui', label: '' },
    { id: 'f2', source: 'gui', target: 'duyet', label: '' },
    { id: 'f3', source: 'duyet', target: 'g', label: '' },
    { id: 'f4', source: 'g', target: 'sua', label: 'Không' },
    { id: 'f5', source: 'sua', target: 'duyet', label: '' },
    { id: 'f6', source: 'g', target: 'p', label: 'Có' },
    { id: 'f7', source: 'p', target: 'e', label: '' },
  ],
}

const node = (layout: ReturnType<typeof layoutSwimlanes>, id: string) => layout.nodes.find(n => n.id === id)!

describe('layoutSwimlanes', () => {
  it('xếp cột theo hạng topo và đặt node vào đúng lane', () => {
    const layout = layoutSwimlanes(model)
    expect(['s', 'gui', 'duyet', 'g', 'sua', 'p', 'e'].map(id => node(layout, id).rank)).toEqual([0, 1, 2, 3, 4, 4, 5])
    expect(node(layout, 'duyet').x).toBe(LANE_HEADER_W + 2 * COL_W + COL_W / 2)
    expect(node(layout, 'gui').y).toBe(ROW_H / 2)
    expect(node(layout, 'duyet').y).toBe(ROW_H + ROW_H / 2)
    expect(layout.lanes.map(l => [l.id, l.y])).toEqual([['kh', 0], ['nv', ROW_H]])
  })

  it('nhận diện cạnh ngược và không tăng hạng cho vòng lặp', () => {
    const layout = layoutSwimlanes(model)
    const back = layout.edges.filter(e => e.isBackEdge).map(e => e.id)
    expect(back).toEqual(['f5'])
    // Cạnh ngược đi vòng phía dưới cả hai node.
    const f5 = layout.edges.find(e => e.id === 'f5')!
    expect(f5.points[1].y).toBeGreaterThan(node(layout, 'sua').y)
    expect(layout.edges.find(e => e.id === 'f4')!.label).toBe('Không')
  })

  it('tính đúng kích thước tổng và hình dạng', () => {
    const layout = layoutSwimlanes(model)
    expect(layout.width).toBe(LANE_HEADER_W + 6 * COL_W)
    expect(layout.height).toBe(2 * ROW_H)
    expect(node(layout, 's').shape).toBe('circle')
    expect(node(layout, 'gui').shape).toBe('rect')
    expect(node(layout, 'g').shape).toBe('diamond')
    // Mọi cạnh xuôi khác cột kết thúc ở mép trái node đích.
    const f2 = layout.edges.find(e => e.id === 'f2')!
    const d = node(layout, 'duyet')
    expect(f2.points.at(-1)).toEqual({ x: d.x - d.width / 2, y: d.y })
  })

  it('không chồng node cùng lane cùng cột và tăng chiều cao lane', () => {
    const layout = layoutSwimlanes({
      name: 'Song song',
      lanes: [{ id: 'a', name: 'A' }],
      nodes: [
        { id: 's', type: 'start_event', name: '', lane_id: 'a' },
        { id: 't1', type: 'task', name: 'T1', lane_id: 'a' },
        { id: 't2', type: 'task', name: 'T2', lane_id: 'a' },
      ],
      flows: [{ id: 'a1', source: 's', target: 't1' }, { id: 'a2', source: 's', target: 't2' }],
    })
    const [t1, t2] = [node(layout, 't1'), node(layout, 't2')]
    expect(t1.rank).toBe(t2.rank)
    expect(t2.y - t1.y).toBe(ROW_H)
    expect(layout.lanes[0].height).toBe(2 * ROW_H)
    expect(layout.height).toBe(2 * ROW_H)
  })

  it('ổn định với lane lạ, tự lặp và kết quả lặp lại giống nhau', () => {
    const odd: ProcessModelGraph = {
      name: 'Lạ',
      lanes: [],
      nodes: [{ id: 'x', type: 'task', name: 'X', lane_id: 'ghost' }],
      flows: [{ id: 'self', source: 'x', target: 'x' }, { id: 'bad', source: 'x', target: 'missing' }],
    }
    const layout = layoutSwimlanes(odd)
    expect(layout.lanes).toEqual([{ id: 'ghost', name: 'ghost', y: 0, height: ROW_H }])
    expect(layout.edges.map(e => [e.id, e.isBackEdge])).toEqual([['self', true]])
    expect(layoutSwimlanes(model)).toEqual(layoutSwimlanes(model))
  })
})
