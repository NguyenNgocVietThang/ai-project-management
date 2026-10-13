'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { VersionDiffView } from '@/features/versions/components/VersionDiffView'
import { useRollbackVersion, useVersionDiff } from '@/features/versions/hooks/useVersions'
import type { ProjectVersion } from '@/features/versions/types'
import { getApiErrorMessage } from '@/types/api.types'

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
          <p role="status" className="text-sm font-medium">
            {t('rollbackDone', { number: result.version.version_number, changes: result.summary.total_changes })}
          </p>
          {result.summary.warnings.length > 0 && (
            <div role="alert" className="space-y-1 rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-sm">
              <p className="font-medium">{t('rollbackWarnings', { count: result.summary.warnings.length })}</p>
              <ul className="list-disc pl-5">
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
            <Button type="button" className="w-auto" onClick={onClose}>{t('rollbackClose')}</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm">{t('rollbackChangesHeading', { number })}</p>
          <div className="max-h-[50vh] overflow-y-auto">
            {diff.isLoading ? (
              <LoadingState label={t('comparing')} />
            ) : diff.isError ? (
              <ErrorState message={getApiErrorMessage(diff.error, t('compareError'))} />
            ) : diff.data ? (
              <VersionDiffView diff={diff.data} />
            ) : null}
          </div>
          {rollback.isError && (
            <p role="alert" className="text-sm text-destructive">{getApiErrorMessage(rollback.error, t('rollbackError'))}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" className="w-auto" onClick={onClose} disabled={rollback.isPending}>{t('rollbackCancel')}</Button>
            <Button type="button" variant="destructive" className="w-auto" onClick={confirm} isLoading={rollback.isPending} disabled={diff.isLoading}>
              {t('rollbackConfirm', { number })}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
