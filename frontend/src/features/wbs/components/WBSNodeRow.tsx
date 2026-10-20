'use client'

import { useId, useState, type ReactNode } from 'react'
import { ChevronDown, MoreHorizontal } from 'lucide-react'
import { Badge, type BadgeTone } from '@/components/ui/Badge'

export function WBSNodeRow({ name, kind, status, statusCode, dates, count, actions, actionsLabel, children }: {
  name: string; kind: string; status: string; statusCode?: string; dates: string; count: string
  actions?: ReactNode; actionsLabel?: string; children?: ReactNode
}) {
  const [expanded, setExpanded] = useState(false)
  const contentId = useId()
  const tone: BadgeTone = /COMPLETED|DONE|CLOSED/.test(statusCode ?? '') ? 'success' : /ACTIVE|IN_PROGRESS/.test(statusCode ?? '') ? 'primary' : 'neutral'
  return <li className="min-w-0 rounded-lg border bg-card">
    <div className="flex items-start gap-1 p-3">
      <button type="button" aria-label={`${kind} ${name}`} aria-describedby={`${contentId}-metadata`} aria-expanded={expanded} aria-controls={contentId} onClick={() => setExpanded(value => !value)} className="flex min-h-11 min-w-0 flex-1 items-start gap-2 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ChevronDown className={`mt-1 h-5 w-5 shrink-0 transition-transform ${expanded ? '' : '-rotate-90'}`} aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="mb-1 block text-xs text-muted-foreground">{kind}</span>
          <span className="block break-words text-sm font-semibold [overflow-wrap:anywhere]">{name}</span>
          <span id={`${contentId}-metadata`} className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"><span>{count}</span><span>{dates}</span></span>
          <Badge tone={tone} size="sm" className="mt-2">{status}</Badge>
        </span>
      </button>
      {actions && <details className="relative shrink-0" onKeyDown={event => {
        if (event.key === 'Escape') { event.preventDefault(); event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus() }
      }}>
        <summary aria-label={actionsLabel} title={actionsLabel} className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden"><MoreHorizontal className="h-5 w-5" aria-hidden="true" /></summary>
        <div className="absolute right-0 top-full z-20 min-w-48 max-w-[calc(100vw-3rem)] rounded-lg border bg-popover p-1 shadow-lg" onClick={event => { const details = event.currentTarget.closest('details'); if (details) details.open = false }}>{actions}</div>
      </details>}
    </div>
    <div id={contentId} hidden={!expanded} className="min-w-0 border-t p-3">{children}</div>
  </li>
}
