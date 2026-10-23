'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react'
import { VersionDiffView } from '@/features/versions/components/VersionDiffView'
import { useRollbackVersion, useVersionDiff } from '@/features/versions/hooks/useVersions'
import type { ProjectVersion } from '@/features/versions/types'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'

interface RollbackDialogProps {
  projectId: number
  version: ProjectVersion
  onClose: () => void
}

/**
 * Hộp thoại xác nhận khôi phục về một phiên bản.
 *
 * Diff lấy theo chiều phiên bản -> hiện trạng: đó là các thay đổi kể từ phiên bản này, và
 * khôi phục sẽ hoàn tác chúng. Task có worklog/comment không bị xóa mà được lưu trữ.
 */
export function RollbackDialog({ projectId, version, onClose }: RollbackDialogProps) {
  const getApiErrorMessage = useApiErrorMessage()
  const t = useTranslations('versions')
  const diff = useVersionDiff(projectId, version.id, 'current')
  const rollback = useRollbackVersion(projectId)
  const result = rollback.data
  const number = version.version_number

  const confirm = () => {
    rollback.mutate(version.id)
  }

  return (
    <Modal open onClose={onClose} title={t('rollbackTitle', { number })} description={t('rollbackDescription')} className="max-w-3xl">
      {result ? (
        <div className="space-y-3">
          <p role="status" className="flex items-start gap-2 rounded-lg border border-success/25 bg-success-soft p-3 text-body-sm font-medium text-foreground">
            <span className="flex h-5 shrink-0 items-center" aria-hidden="true"><CheckCircle2 className="h-4 w-4 text-success" /></span>
            {t('rollbackDone', { number: result.version.version_number, changes: result.summary.total_changes })}
          </p>
          {result.summary.warnings.length > 0 && (
            <div role="alert" className="space-y-1 rounded-lg border border-warning/25 bg-warning-soft p-3 text-body-sm text-foreground">
              <p className="flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
                {t('rollbackWarnings', { count: result.summary.warnings.length })}</p>
              <ul className="list-disc pl-6">
                {result.summary.warnings.map((warning, index) => (
                  <li key={`${warning.code}-${warning.task_id ?? index}`}>
                    {warning.code === 'assignee_not_member'
                      ? t('warningAssigneeNotMember', { task: warning.task_name ?? `#${warning.task_id}` })
                      : warning.code}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end">
            <Button type="button" fullWidth={false} className="w-full sm:w-auto" onClick={onClose}>{t('rollbackClose')}</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-body-sm font-medium text-foreground">{t('rollbackChangesHeading', { number })}</p>
          <div className="max-h-[50vh] overflow-y-auto rounded-xl border bg-muted/30 p-3">
            {diff.isLoading ? (
              <LoadingState variant="inline" label={t('comparing')} />
            ) : diff.isError ? (
              <ErrorState message={getApiErrorMessage(diff.error, t('compareError'))} onRetry={() => void diff.refetch()} />
            ) : diff.data ? (
              <VersionDiffView diff={diff.data} />
            ) : null}
          </div>
          {rollback.isError && (
            <p role="alert" className="text-body-sm text-destructive">{getApiErrorMessage(rollback.error, t('rollbackError'))}</p>
          )}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" fullWidth={false} className="w-full sm:w-auto" onClick={onClose} disabled={rollback.isPending}>{t('rollbackCancel')}</Button>
            <Button type="button" variant="destructive" fullWidth={false} className="w-full sm:w-auto" onClick={confirm} isLoading={rollback.isPending} disabled={diff.isLoading}>
              {!rollback.isPending && <RotateCcw className="h-4 w-4" aria-hidden="true" />}
              {t('rollbackConfirm', { number })}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
