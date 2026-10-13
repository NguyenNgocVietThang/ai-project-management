'use client'

import { useId, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { LANE_HEADER_W, layoutSwimlanes, type LaidOutNode } from '@/features/process/lib/swimlaneLayout'
import type { ProcessModelGraph, ProcessStep } from '@/features/process/types'

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5]

/** Cắt chữ dài để vừa trong hình; tên đầy đủ nằm trong <title>. */
function clip(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

/** Tách tên task thành tối đa 2 dòng (~20 ký tự/dòng). */
function wrap(text: string): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = ['']
  for (const word of words) {
    const current = lines[lines.length - 1]
    if (current && (current + ' ' + word).length > 20) {
      if (lines.length === 2) { lines[1] = clip(`${current} ${word}`, 20); break }
      lines.push(word)
    } else lines[lines.length - 1] = current ? `${current} ${word}` : word
  }
  return lines.map(line => clip(line, 20))
}

function NodeShape({ node, typeLabel }: { node: LaidOutNode; typeLabel: string }) {
  const { x, y, width, height } = node
  const title = <title>{`${typeLabel}: ${node.name}`}</title>
  if (node.shape === 'rect') {
    const lines = wrap(node.name)
    return (
      <g data-node-id={node.id} data-node-type={node.type}>
        {title}
        <rect x={x - width / 2} y={y - height / 2} width={width} height={height} rx={10} className="fill-card stroke-primary" strokeWidth={1.5} />
        {lines.map((line, i) => (
          <text key={i} x={x} y={y + (i - (lines.length - 1) / 2) * 14 + 4} textAnchor="middle" className="fill-foreground text-[11px]">{line}</text>
        ))}
      </g>
    )
  }
  if (node.shape === 'diamond') {
    const h = width / 2
    const s = 8
    return (
      <g data-node-id={node.id} data-node-type={node.type}>
        {title}
        <polygon points={`${x},${y - h} ${x + h},${y} ${x},${y + h} ${x - h},${y}`} className="fill-card stroke-amber-600 dark:stroke-amber-400" strokeWidth={1.5} />
        {node.type === 'exclusive_gateway' ? (
          <path d={`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`} className="stroke-foreground" strokeWidth={2.5} />
        ) : (
          <path d={`M${x - s - 2} ${y} L${x + s + 2} ${y} M${x} ${y - s - 2} L${x} ${y + s + 2}`} className="stroke-foreground" strokeWidth={2.5} />
        )}
        {node.name && <text x={x} y={y - h - 6} textAnchor="middle" className="fill-muted-foreground text-[10px]">{clip(node.name, 24)}</text>}
      </g>
    )
  }
  // Sự kiện: bắt đầu viền mảnh, kết thúc viền dày, trung gian viền đôi.
  const r = width / 2
  const strokeWidth = node.type === 'end_event' ? 4 : 1.5
  const tone = node.type === 'end_event' ? 'stroke-destructive' : node.type === 'start_event' ? 'stroke-emerald-600 dark:stroke-emerald-400' : 'stroke-primary'
  return (
    <g data-node-id={node.id} data-node-type={node.type}>
      {title}
      <circle cx={x} cy={y} r={r} className={`fill-card ${tone}`} strokeWidth={strokeWidth} />
      {node.type === 'intermediate_event' && <circle cx={x} cy={y} r={r - 4} className={`fill-none ${tone}`} strokeWidth={1.5} />}
      {node.name && <text x={x} y={y + r + 13} textAnchor="middle" className="fill-muted-foreground text-[10px]">{clip(node.name, 24)}</text>}
    </g>
  )
}

export function ProcessDiagram({ model, steps }: { model: ProcessModelGraph; steps: ProcessStep[] }) {
  const t = useTranslations('process')
  const layout = useMemo(() => layoutSwimlanes(model), [model])
  const [zoomIndex, setZoomIndex] = useState(2)
  const markerId = `process-arrow-${useId().replace(/:/g, '')}`
  const zoom = ZOOM_STEPS[zoomIndex]
  const typeLabel = (type: string) => {
    const known = ['start_event', 'end_event', 'task', 'exclusive_gateway', 'parallel_gateway', 'intermediate_event']
    return known.includes(type) ? t(`nodeTypes.${type as 'task'}`) : type
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-muted-foreground" aria-live="polite">{t('zoomLevel', { percent: Math.round(zoom * 100) })}</span>
        <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-md border disabled:opacity-50" onClick={() => setZoomIndex(i => i - 1)} disabled={zoomIndex === 0} aria-label={t('zoomOut')}>
          <ZoomOut className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-md border disabled:opacity-50" onClick={() => setZoomIndex(i => i + 1)} disabled={zoomIndex === ZOOM_STEPS.length - 1} aria-label={t('zoomIn')}>
          <ZoomIn className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="max-w-full overflow-x-auto rounded-xl border bg-background" tabIndex={0} aria-label={t('diagramScroll')}>
        <svg
          role="img"
          aria-label={t('diagramLabel', { name: model.name, lanes: layout.lanes.length, nodes: layout.nodes.length })}
          width={layout.width * zoom}
          height={layout.height * zoom}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          className="block"
        >
          <defs>
            <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" className="fill-muted-foreground" />
            </marker>
          </defs>
          {layout.lanes.map((lane, i) => (
            <g key={lane.id} data-lane-id={lane.id}>
              <rect x={0} y={lane.y} width={layout.width} height={lane.height} className={i % 2 ? 'fill-muted/40 stroke-border' : 'fill-background stroke-border'} />
              <rect x={0} y={lane.y} width={LANE_HEADER_W} height={lane.height} className="fill-muted stroke-border" />
              <text x={10} y={lane.y + lane.height / 2 + 4} className="fill-foreground text-[12px] font-medium">
                <title>{lane.name}</title>{clip(lane.name, 16)}
              </text>
            </g>
          ))}
          {layout.edges.map(edge => (
            <g key={edge.id} data-edge-id={edge.id}>
              <polyline
                points={edge.points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                className="stroke-muted-foreground"
                strokeWidth={1.5}
                strokeDasharray={edge.isBackEdge ? '5 4' : undefined}
                markerEnd={`url(#${markerId})`}
              />
              {edge.label && (
                <text x={edge.labelPos.x} y={edge.labelPos.y - 4} textAnchor="middle" className="fill-foreground text-[10px]" paintOrder="stroke" stroke="hsl(var(--background))" strokeWidth={3}>
                  {clip(edge.label, 22)}
                </text>
              )}
            </g>
          ))}
          {layout.nodes.map(node => <NodeShape key={node.id} node={node} typeLabel={typeLabel(node.type)} />)}
        </svg>
      </div>

      <section aria-labelledby="process-steps-title" className="space-y-2">
        <h3 id="process-steps-title" className="text-base font-semibold">{t('stepsTitle')}</h3>
        {steps.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('noSteps')}</p>
        ) : (
          <ol className="space-y-2">
            {steps.map(step => (
              <li key={`${step.order}-${step.node_id}`} className="rounded-lg border bg-card p-3 text-sm">
                <p className="font-medium break-words">{step.order}. {step.step}</p>
                <p className="text-xs text-muted-foreground break-words">
                  {t('stepMeta', { lane: step.lane, type: step.type_label || typeLabel(step.type) })}
                </p>
                {step.next && <p className="text-xs text-muted-foreground break-words">{t('stepNext', { next: step.next })}</p>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
