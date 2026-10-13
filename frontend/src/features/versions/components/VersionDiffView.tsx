'use client'

import { AlertTriangle, Minus, PenLine, Plus, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { VERSION_ENTITIES, type DiffItem, type VersionDiff } from '@/features/versions/types'

type ChangeKind = 'added' | 'removed' | 'changed'

// Mỗi loại thay đổi có biểu tượng + nhãn chữ riêng để không phụ thuộc màu sắc;
// nền dùng token ngữ nghĩa (success / destructive / warning).
const KIND_STYLE: Record<ChangeKind, { icon: LucideIcon; tone: BadgeTone; row: string; marker: string }> = {
  added: { icon: Plus, tone: 'success', row: 'border-success/25 bg-success-soft', marker: 'bg-success text-success-foreground' },
  removed: { icon: Minus, tone: 'danger', row: 'border-destructive/25 bg-destructive/10', marker: 'bg-destructive text-destructive-foreground' },
  changed: { icon: PenLine, tone: 'warning', row: 'border-warning/25 bg-warning-soft', marker: 'bg-warning text-warning-foreground' },
}

function formatValue(value: unknown, empty: string): string {
  if (value === null || value === undefined || value === '') return empty
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function ItemTitle({ item, isDependency }: { item: DiffItem; isDependency: boolean }) {
  const t = useTranslations('versions')
  if (isDependency) {
    const predecessor = item.predecessor_name ?? `#${item.predecessor_id}`
    const successor = item.successor_name ?? `#${item.successor_id}`
    const detail = item.dependency_type ? ` (${item.dependency_type}, ${t('lagDays', { days: item.lag_days ?? 0 })})` : ''
    return <span className="min-w-0 flex-1 break-words font-medium text-foreground">{t('dependencyLabel', { predecessor, successor })}{detail}</span>
  }
  return <span className="min-w-0 flex-1 break-words font-medium text-foreground">{item.name || `#${item.id}`}</span>
}

export function VersionDiffView({ diff }: { diff: VersionDiff }) {
  const t = useTranslations('versions')
  const total = diff.summary.total
  const empty = t('emptyValue')
  return (
    <div className="space-y-4">
      <p className="text-body-sm font-medium text-foreground">{t('summary', { added: total.added, removed: total.removed, changed: total.changed })}</p>
      {diff.truncated && (
        <p role="status" className="flex items-start gap-2 rounded-lg border border-warning/25 bg-warning-soft p-3 text-body-sm text-foreground">
          <span className="flex h-5 shrink-0 items-center" aria-hidden="true"><AlertTriangle className="h-4 w-4 text-warning" /></span>
          {t('truncatedNotice')}
        </p>
      )}
      {total.added + total.removed + total.changed === 0 && <p className="text-body-sm text-muted-foreground">{t('noDifferences')}</p>}
      {VERSION_ENTITIES.map((entity) => {
        const group = diff.entities[entity]
        const counts = diff.summary.by_entity[entity]
        if (!group || !counts || counts.added + counts.removed + counts.changed === 0) return null
        const isDependency = entity === 'dependencies'
        const rows: { kind: ChangeKind; item: DiffItem }[] = [
          ...group.added.map((item) => ({ kind: 'added' as const, item })),
          ...group.removed.map((item) => ({ kind: 'removed' as const, item })),
          ...group.changed.map((item) => ({ kind: 'changed' as const, item })),
        ]
        return (
          <section key={entity} className="rounded-xl border border-border/80 bg-card p-4 shadow-soft" aria-labelledby={`diff-${entity}`}>
            <h4 id={`diff-${entity}`} className="text-h4 text-foreground">{t(`entities.${entity}`)}</h4>
            <p className="mt-1 text-caption text-muted-foreground">{t('summary', { added: counts.added, removed: counts.removed, changed: counts.changed })}</p>
            <ul className="mt-3 space-y-2">
              {rows.map(({ kind, item }, index) => {
                const style = KIND_STYLE[kind]
                const Icon = style.icon
                return (
                  <li key={`${kind}-${index}`} className={cn('rounded-lg border p-3 text-body-sm', style.row)}>
                    <div className="flex flex-wrap items-start gap-2">
                      <span aria-hidden="true" className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full', style.marker)}>
                        <Icon className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <ItemTitle item={item} isDependency={isDependency} />
                      <Badge tone={style.tone} size="sm" className="uppercase">{t(`kind.${kind}`)}</Badge>
                    </div>
                    {kind === 'changed' && item.changes && (
                      <dl className="mt-2 space-y-1 pl-7 text-caption">
                        {item.changes.map((change) => (
                          <div key={change.field} className="flex flex-wrap gap-x-2">
                            <dt className="font-mono text-muted-foreground">{change.field}:</dt>
                            <dd className="min-w-0 break-all text-foreground">{t('changeValue', { old: formatValue(change.old, empty), new: formatValue(change.new, empty) })}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </li>
                )
              })}
            </ul>
            {group.truncated && <p className="mt-2 text-caption text-muted-foreground">{t('groupTruncated')}</p>}
          </section>
        )
      })}
    </div>
  )
}
