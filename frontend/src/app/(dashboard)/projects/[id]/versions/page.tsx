'use client'

import { useTranslations } from 'next-intl'
import { type FormEvent, useState } from 'react'
import { GitCompare, History, RotateCcw, Save } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/PageHeader'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { useNumericParam } from '@/hooks/useNumericParam'
import { cn } from '@/lib/utils'
import { useProjectDetail } from '@/features/projects/hooks/useProjects'
import { RollbackDialog } from '@/features/versions/components/RollbackDialog'
import { VersionDiffView } from '@/features/versions/components/VersionDiffView'
import { useCreateBaseline, useProjectVersions, useVersionDiff } from '@/features/versions/hooks/useVersions'
import type { DiffTarget, ProjectVersion } from '@/features/versions/types'
import { getApiErrorMessage } from '@/types/api.types'

const KNOWN_KINDS = ['manual_baseline', 'change_request_approved', 'pre_rollback', 'rollback'] as const

// Nút chọn base/so sánh: trạng thái đang chọn tô nền nhấn nhẹ, không dùng nền primary
// để giữ đúng một CTA chính trên trang.
const TOGGLE_ON = 'border-primary/50 bg-accent text-accent-foreground'

function formatDateTime(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

export default function VersionsPage() {
  const projectId = useNumericParam()
  const t = useTranslations('versions')
  const tc = useTranslations('common')
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

  const header = <SectionHeader title={t('title')} description={t('subtitle')} />

  if (versions.isLoading) {
    // Khung xương theo bố cục thật: danh sách phiên bản trái, vùng so sánh phải.
    return (
      <div className="space-y-6">
        {header}
        <SkeletonRegion label={t('loading')} className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-3 rounded-xl border border-border/80 bg-card p-4 shadow-soft">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex gap-2"><Skeleton className="h-9 w-20" /><Skeleton className="h-9 w-24" /></div>
              </div>
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </SkeletonRegion>
      </div>
    )
  }
  if (versions.isError) {
    return (
      <div className="space-y-6">
        {header}
        <ErrorState message={getApiErrorMessage(versions.error, t('loadError'))} onRetry={() => void versions.refetch()} retryLabel={tc('retry')} />
      </div>
    )
  }
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
      {header}

      {/* ===== Thanh tạo baseline: CTA chính duy nhất của trang ===== */}
      {canCreateBaseline && (
        <Card>
          <form onSubmit={submitBaseline} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <Label htmlFor="baseline-label">{t('baselineLabel')}</Label>
              <Input id="baseline-label" value={label} maxLength={100} onChange={(e) => setLabel(e.target.value)} placeholder={t('baselinePlaceholder')} />
            </div>
            <Button type="submit" fullWidth={false} className="w-full sm:w-auto" isLoading={createBaseline.isPending} disabled={!label.trim()}>
              {!createBaseline.isPending && <Save className="h-4 w-4" aria-hidden="true" />}
              {t('createBaseline')}
            </Button>
          </form>
          {createBaseline.isError && <p role="alert" className="mt-3 text-body-sm text-destructive">{getApiErrorMessage(createBaseline.error, t('createError'))}</p>}
        </Card>
      )}

      {list.length === 0 ? (
        <EmptyState icon={History} title={t('emptyTitle')} description={t('emptyDescription')} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
          {/* ===== Lịch sử phiên bản ===== */}
          <section aria-labelledby="version-list" className="min-w-0 space-y-4">
            <div>
              <h3 id="version-list" className="text-h4 text-foreground">{t('listTitle')}</h3>
              <p className="mt-1 text-body-sm text-muted-foreground">{t('selectHint')}</p>
            </div>
            <ul className="space-y-3">
              {list.map((version) => {
                const isBase = baseId === version.id
                const isTarget = target === version.id
                return (
                  <li
                    key={version.id}
                    className={cn(
                      'rounded-xl border border-border/80 bg-card p-4 shadow-soft transition-colors duration-200',
                      (isBase || isTarget) && 'border-primary/40'
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-body-sm font-semibold tabular-nums text-foreground">{t('versionNumber', { number: version.version_number })}</strong>
                      <span className="min-w-0 break-words text-body-sm text-foreground">{version.label}</span>
                      {version.is_baseline && <Badge tone="primary" size="sm">{t('baseline')}</Badge>}
                    </div>
                    <p className="mt-1 text-caption text-muted-foreground">
                      {kindLabel(version.kind)} · {formatDateTime(version.created_at)}
                      {version.change_request_id !== null && <> · {t('relatedCr', { id: version.change_request_id })}</>}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" fullWidth={false} className={cn(isBase && TOGGLE_ON)} aria-pressed={isBase} aria-label={t('setBaseFor', { number: version.version_number })} onClick={() => setBaseId(version.id)}>{t('setBase')}</Button>
                      <Button type="button" variant="outline" size="sm" fullWidth={false} className={cn(isTarget && TOGGLE_ON)} aria-pressed={isTarget} aria-label={t('setTargetFor', { number: version.version_number })} onClick={() => setTarget(version.id)}>{t('setTarget')}</Button>
                      {canCreateBaseline && (
                        <Button type="button" variant="ghost" size="sm" fullWidth={false} className="ml-auto" aria-label={t('rollbackFor', { number: version.version_number })} onClick={() => setRollbackTarget(version)}>
                          <RotateCcw className="h-4 w-4" aria-hidden="true" />
                          {t('rollback')}
                        </Button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
            <Button type="button" variant="outline" fullWidth={false} className={cn('w-full sm:w-auto', target === 'current' && TOGGLE_ON)} aria-pressed={target === 'current'} onClick={() => setTarget('current')}>
              <GitCompare className="h-4 w-4" aria-hidden="true" />
              {t('compareCurrent')}
            </Button>
          </section>

          {/* ===== Vùng so sánh ===== */}
          <Card as="section" aria-labelledby="version-compare" className="min-w-0">
            <CardHeader>
              <div className="min-w-0">
                <CardTitle as="h3" id="version-compare">{t('compareTitle')}</CardTitle>
                {diff.data && baseId !== null && target !== null && baseId !== target && !diff.isLoading && !diff.isError && (
                  <CardDescription>
                    {t('comparingLabel', { base: diff.data.base.version_number, target: diff.data.target ? t('versionNumber', { number: diff.data.target.version_number }) : t('current') })}
                  </CardDescription>
                )}
              </div>
            </CardHeader>
            {baseId === null || target === null ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/30 px-6 py-10 text-center">
                <GitCompare className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                <p className="max-w-prose-ui text-body-sm text-muted-foreground">{t('pickTwo')}</p>
              </div>
            ) : baseId === target ? (
              <p className="rounded-xl border border-dashed bg-muted/30 px-6 py-10 text-center text-body-sm text-muted-foreground">{t('pickDifferent')}</p>
            ) : diff.isLoading ? (
              <LoadingState variant="inline" label={t('comparing')} />
            ) : diff.isError ? (
              <ErrorState message={getApiErrorMessage(diff.error, t('compareError'))} onRetry={() => void diff.refetch()} retryLabel={tc('retry')} />
            ) : diff.data ? (
              <VersionDiffView diff={diff.data} />
            ) : null}
          </Card>
        </div>
      )}

      {rollbackTarget && (
        <RollbackDialog projectId={projectId} version={rollbackTarget} onClose={() => setRollbackTarget(null)} />
      )}
    </div>
  )
}
