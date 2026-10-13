'use client'

import { useTranslations } from 'next-intl'
import { VERSION_ENTITIES, type DiffItem, type VersionDiff } from '@/features/versions/types'

type ChangeKind = 'added' | 'removed' | 'changed'

// Ký hiệu + nhãn chữ để không phụ thuộc màu sắc.
const SYMBOL: Record<ChangeKind, string> = { added: '+', removed: '−', changed: '~' }
const TONE: Record<ChangeKind, string> = {
  added: 'border-emerald-500/40 bg-emerald-500/5',
  removed: 'border-destructive/40 bg-destructive/5',
  changed: 'border-amber-500/40 bg-amber-500/5',
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
    return <span className="min-w-0 break-words">{t('dependencyLabel', { predecessor, successor })}{detail}</span>
  }
  return <span className="min-w-0 break-words">{item.name || `#${item.id}`}</span>
}

export function VersionDiffView({ diff }: { diff: VersionDiff }) {
  const t = useTranslations('versions')
  const total = diff.summary.total
  const empty = t('emptyValue')
  return (
    <div className="space-y-4">
      <p className="text-sm">{t('summary', { added: total.added, removed: total.removed, changed: total.changed })}</p>
      {diff.truncated && <p role="status" className="rounded-md border border-amber-500/40 p-3 text-sm">{t('truncatedNotice')}</p>}
      {total.added + total.removed + total.changed === 0 && <p className="text-sm text-muted-foreground">{t('noDifferences')}</p>}
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
          <section key={entity} className="rounded-xl border bg-card p-4" aria-labelledby={`diff-${entity}`}>
            <h4 id={`diff-${entity}`} className="font-semibold">{t(`entities.${entity}`)}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{t('summary', { added: counts.added, removed: counts.removed, changed: counts.changed })}</p>
            <ul className="mt-3 space-y-2">
              {rows.map(({ kind, item }, index) => (
                <li key={`${kind}-${index}`} className={`rounded-md border p-3 text-sm ${TONE[kind]}`}>
                  <div className="flex flex-wrap items-start gap-2">
                    <span aria-hidden="true" className="font-mono font-bold">{SYMBOL[kind]}</span>
                    <span className="shrink-0 rounded bg-muted px-1.5 text-xs font-medium uppercase">{t(`kind.${kind}`)}</span>
                    <ItemTitle item={item} isDependency={isDependency} />
                  </div>
                  {kind === 'changed' && item.changes && (
                    <dl className="mt-2 space-y-1 text-xs">
                      {item.changes.map((change) => (
                        <div key={change.field} className="flex flex-wrap gap-x-2">
                          <dt className="font-mono text-muted-foreground">{change.field}:</dt>
                          <dd className="min-w-0 break-all">{t('changeValue', { old: formatValue(change.old, empty), new: formatValue(change.new, empty) })}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </li>
              ))}
            </ul>
            {group.truncated && <p className="mt-2 text-xs text-muted-foreground">{t('groupTruncated')}</p>}
          </section>
        )
      })}
    </div>
  )
}
