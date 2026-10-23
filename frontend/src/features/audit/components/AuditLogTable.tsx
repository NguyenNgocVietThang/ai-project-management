'use client'

import { useLocale, useTranslations } from 'next-intl'

import { ChevronRight, ScrollText } from 'lucide-react'
import { Fragment, useState } from 'react'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/PageState'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AuditLog } from '@/types/admin.types'

// Tông màu ngữ nghĩa cho từng loại hành động (không hard-code bảng màu Tailwind).
const ACTION_TONES: Record<string, BadgeTone> = {
  CREATE: 'success',
  UPDATE: 'info',
  DELETE: 'danger',
  DEACTIVATE: 'warning',
  REACTIVATE: 'success',
}

function actionTone(action: string): BadgeTone {
  return ACTION_TONES[action] ?? 'neutral'
}

function formatTimestamp(value: string, locale: string): string {
  return `${formatDate(value, locale)} ${new Date(value).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`
}

export function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  const locale = useLocale()
  const tAccount = useTranslations('accountUi')
  const [expanded, setExpanded] = useState<number | null>(null)

  if (logs.length === 0) {
    return (
      <EmptyState icon={ScrollText} title={tAccount('noAuditLogEntries')} description={tAccount('nothingMatchesTheCurrentFiltersYet')} />
    )
  }

  return (
    <Card flush className="overflow-hidden">
      {/* Bảng tự cuộn bên trong wrapper, thead dính khi cuộn dọc */}
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full min-w-[820px] text-left text-body-sm">
          <thead className="sticky top-0 z-10 bg-card text-caption uppercase text-muted-foreground">
            <tr className="bg-muted/50">
              <th scope="col" className="w-12 px-2 py-3">
                <span className="sr-only"> {tAccount('details')} </span>
              </th>
              <th scope="col" className="px-4 py-3 font-medium"> {tAccount('when')} </th>
              <th scope="col" className="px-4 py-3 font-medium"> {tAccount('actor')} </th>
              <th scope="col" className="px-4 py-3 font-medium"> {tAccount('action')} </th>
              <th scope="col" className="px-4 py-3 font-medium"> {tAccount('entity')} </th>
              <th scope="col" className="px-4 py-3 font-medium"> {tAccount('description')} </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const hasDetails = Boolean(log.old_values || log.new_values)
              const isOpen = expanded === log.id
              const toggle = () => setExpanded(isOpen ? null : log.id)
              return (
                <Fragment key={log.id}>
                  <tr
                    className={cn(
                      'border-t transition-colors hover:bg-muted/40',
                      hasDetails && 'cursor-pointer',
                      isOpen && 'bg-muted/40'
                    )}
                    onClick={() => hasDetails && toggle()}
                  >
                    <td className="px-2 py-2 text-muted-foreground">
                      {hasDetails && (
                        // Nút riêng cho người dùng bàn phím; chặn nổi bọt để không bật/tắt hai lần
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          fullWidth={false}
                          aria-expanded={isOpen}
                          aria-label={isOpen ? tAccount('hideChangeDetails') : tAccount('showChangeDetails')}
                          className="text-muted-foreground"
                          onClick={(event) => {
                            event.stopPropagation()
                            toggle()
                          }}
                        >
                          <ChevronRight
                            className={cn('h-4 w-4 transition-transform duration-200 ease-out-soft', isOpen && 'rotate-90')}
                            aria-hidden="true"
                          />
                        </Button>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatTimestamp(log.created_at, locale)}</td>
                    <td className="px-4 py-3">
                      {log.user ? (
                        <div>
                          <p className="font-medium text-foreground">{log.user.full_name}</p>
                          <p className="text-caption text-muted-foreground">{log.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-caption text-muted-foreground"> {tAccount('system')} </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={actionTone(log.action)}>{tAccount.has(`auditActions.${log.action}`) ? tAccount(`auditActions.${log.action}`) : log.action}</Badge>
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
                              <p className="mb-1 text-overline uppercase text-muted-foreground"> {tAccount('before')} </p>
                              <pre className="max-h-48 overflow-auto rounded-lg border bg-background p-3 text-caption">
                                {JSON.stringify(log.old_values, null, 2)}
                              </pre>
                            </div>
                          )}
                          {log.new_values && (
                            <div>
                              <p className="mb-1 text-overline uppercase text-muted-foreground"> {tAccount('after')} </p>
                              <pre className="max-h-48 overflow-auto rounded-lg border bg-background p-3 text-caption">
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
    </Card>
  )
}
