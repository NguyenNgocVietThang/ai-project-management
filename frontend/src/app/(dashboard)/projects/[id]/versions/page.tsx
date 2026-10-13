'use client'

import { useTranslations } from 'next-intl'
import { type FormEvent, useState } from 'react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { useNumericParam } from '@/hooks/useNumericParam'
import { useProjectDetail } from '@/features/projects/hooks/useProjects'
import { RollbackDialog } from '@/features/versions/components/RollbackDialog'
import { VersionDiffView } from '@/features/versions/components/VersionDiffView'
import { useCreateBaseline, useProjectVersions, useVersionDiff } from '@/features/versions/hooks/useVersions'
import type { DiffTarget, ProjectVersion } from '@/features/versions/types'
import { getApiErrorMessage } from '@/types/api.types'

const KNOWN_KINDS = ['manual_baseline', 'change_request_approved', 'pre_rollback', 'rollback'] as const

function formatDateTime(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

export default function VersionsPage() {
  const projectId = useNumericParam()
  const t = useTranslations('versions')
  const project = useProjectDetail(projectId)
  const versions = useProjectVersions(projectId)
  const createBaseline = useCreateBaseline(projectId)
  const [baseId, setBaseId] = useState<number | null>(null)
  const [target, setTarget] = useState<DiffTarget | null>(null)
  const [label, setLabel] = useState('')
  const [rollbackTarget, setRollbackTarget] = useState<ProjectVersion | null>(null)
  const diff = useVersionDiff(projectId, baseId, target)
  // Backend chỉ cho PM của dự án (hoặc admin) tạo baseline và khôi phục; can_update cùng ngữ nghĩa PM/admin.
  const canCreateBaseline = Boolean(project.data?.capabilities.can_update)

  if (versions.isLoading) return <LoadingState label={t('loading')} />
  if (versions.isError) return <ErrorState message={getApiErrorMessage(versions.error, t('loadError'))} />
  const list = versions.data ?? []

  const submitBaseline = async (event: FormEvent) => {
    event.preventDefault()
    if (!label.trim()) return
    try {
      await createBaseline.mutateAsync({ label: label.trim(), description: null })
      setLabel('')
    } catch {
      // Lỗi hiển thị qua createBaseline.isError.
    }
  }

  const kindLabel = (kind: string | null) =>
    kind && (KNOWN_KINDS as readonly string[]).includes(kind) ? t(`kinds.${kind as (typeof KNOWN_KINDS)[number]}`) : t('kinds.unknown')

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </header>

      {canCreateBaseline && (
        <form onSubmit={submitBaseline} className="flex flex-col gap-2 rounded-xl border bg-card p-4 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-1">
            <label htmlFor="baseline-label" className="text-sm font-medium">{t('baselineLabel')}</label>
            <Input id="baseline-label" value={label} maxLength={100} onChange={(e) => setLabel(e.target.value)} placeholder={t('baselinePlaceholder')} />
          </div>
          <Button type="submit" className="sm:w-auto" isLoading={createBaseline.isPending} disabled={!label.trim()}>{t('createBaseline')}</Button>
          {createBaseline.isError && <p role="alert" className="text-sm text-destructive">{getApiErrorMessage(createBaseline.error, t('createError'))}</p>}
        </form>
      )}

      {list.length === 0 ? (
        <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_1fr]">
          <section aria-labelledby="version-list" className="min-w-0 space-y-2">
            <h3 id="version-list" className="font-semibold">{t('listTitle')}</h3>
            <p className="text-xs text-muted-foreground">{t('selectHint')}</p>
            <ul className="space-y-2">
              {list.map((version) => (
                <li key={version.id} className="rounded-xl border bg-card p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-sm">{t('versionNumber', { number: version.version_number })}</strong>
                    <span className="min-w-0 break-words text-sm">{version.label}</span>
                    {version.is_baseline && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{t('baseline')}</span>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {kindLabel(version.kind)} · {formatDateTime(version.created_at)}
                    {version.change_request_id !== null && <> · {t('relatedCr', { id: version.change_request_id })}</>}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button type="button" variant={baseId === version.id ? 'default' : 'outline'} className="w-auto px-3 text-xs" aria-pressed={baseId === version.id} aria-label={t('setBaseFor', { number: version.version_number })} onClick={() => setBaseId(version.id)}>{t('setBase')}</Button>
                    <Button type="button" variant={target === version.id ? 'default' : 'outline'} className="w-auto px-3 text-xs" aria-pressed={target === version.id} aria-label={t('setTargetFor', { number: version.version_number })} onClick={() => setTarget(version.id)}>{t('setTarget')}</Button>
                    {canCreateBaseline && (
                      <Button type="button" variant="outline" className="w-auto px-3 text-xs" aria-label={t('rollbackFor', { number: version.version_number })} onClick={() => setRollbackTarget(version)}>{t('rollback')}</Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <Button type="button" variant={target === 'current' ? 'default' : 'outline'} className="sm:w-auto" aria-pressed={target === 'current'} onClick={() => setTarget('current')}>{t('compareCurrent')}</Button>
          </section>

          <section aria-labelledby="version-compare" className="min-w-0 space-y-3">
            <h3 id="version-compare" className="font-semibold">{t('compareTitle')}</h3>
            {baseId === null || target === null ? (
              <p className="text-sm text-muted-foreground">{t('pickTwo')}</p>
            ) : baseId === target ? (
              <p className="text-sm text-muted-foreground">{t('pickDifferent')}</p>
            ) : diff.isLoading ? (
              <LoadingState label={t('comparing')} />
            ) : diff.isError ? (
              <ErrorState message={getApiErrorMessage(diff.error, t('compareError'))} />
            ) : diff.data ? (
              <>
                <p className="text-sm font-medium">{t('comparingLabel', { base: diff.data.base.version_number, target: diff.data.target ? t('versionNumber', { number: diff.data.target.version_number }) : t('current') })}</p>
                <VersionDiffView diff={diff.data} />
              </>
            ) : null}
          </section>
        </div>
      )}

      {rollbackTarget && (
        <RollbackDialog projectId={projectId} version={rollbackTarget} onClose={() => setRollbackTarget(null)} />
      )}
    </div>
  )
}
