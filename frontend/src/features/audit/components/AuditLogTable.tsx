'use client'

import { ChevronDown, ChevronRight } from 'lucide-react'
import { Fragment, useState } from 'react'
import { EmptyState } from '@/components/common/PageState'
import { formatDate } from '@/lib/format'
import type { AuditLog } from '@/types/admin.types'

const ACTION_CLASSES: Record<string, string> = {
  CREATE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  UPDATE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  DEACTIVATE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  REACTIVATE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
}

function actionBadgeClass(action: string): string {
  return ACTION_CLASSES[action] ?? 'bg-muted text-muted-foreground'
}

function formatTimestamp(value: string): string {
  return `${formatDate(value)} ${new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

export function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  if (logs.length === 0) {
    return <EmptyState title="No audit log entries" description="Nothing matches the current filters yet." />
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="w-8 px-2 py-3" />
            <th className="px-4 py-3">When</th>
            <th className="px-4 py-3">Actor</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Entity</th>
            <th className="px-4 py-3">Description</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            const hasDetails = Boolean(log.old_values || log.new_values)
            const isOpen = expanded === log.id
            return (
              <Fragment key={log.id}>
                <tr
                  className={hasDetails ? 'cursor-pointer border-t hover:bg-accent/50' : 'border-t'}
                  onClick={() => hasDetails && setExpanded(isOpen ? null : log.id)}
                >
                  <td className="px-2 py-3 text-muted-foreground">
                    {hasDetails && (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatTimestamp(log.created_at)}</td>
                  <td className="px-4 py-3">
                    {log.user ? (
                      <div>
                        <p className="font-medium">{log.user.full_name}</p>
                        <p className="text-xs text-muted-foreground">{log.user.email}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">System</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${actionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {log.entity_type}
                    {log.entity_id !== null && ` #${log.entity_id}`}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{log.description ?? '—'}</td>
                </tr>
                {isOpen && (
                  <tr className="border-t bg-muted/30">
                    <td />
                    <td colSpan={5} className="px-4 py-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {log.old_values && (
                          <div>
                            <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Before</p>
                            <pre className="max-h-48 overflow-auto rounded-md bg-background p-2 text-xs">
                              {JSON.stringify(log.old_values, null, 2)}
                            </pre>
                          </div>
                        )}
                        {log.new_values && (
                          <div>
                            <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">After</p>
                            <pre className="max-h-48 overflow-auto rounded-md bg-background p-2 text-xs">
                              {JSON.stringify(log.new_values, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
