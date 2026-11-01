'use client'

import { useEffect, useId, useState } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Label } from '@/components/common/Label'
import { CardDescription, CardTitle } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { parseImpactError } from '@/features/change-requests/approvals'
import { ImpactLevelBadge } from '@/features/change-requests/components/ChangeRequestStatusBadge'
import { useSetImpactLevel } from '@/features/change-requests/hooks/useChangeRequests'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'
import {
  IMPACT_LEVELS,
  type ChangeRequest,
  type ChangeRequestStatus,
  type ImpactLevel,
  type ImpactReport,
} from '@/types/change-request.types'

// CR còn mở mới được đổi mức (khớp OPEN_CR_STATUSES ở backend).
export const OPEN_CR_STATUSES: readonly ChangeRequestStatus[] = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW']
const RANK: Record<ImpactLevel, number> = { MINOR: 0, MODERATE: 1, MAJOR: 2 }
const REASON_MAX = 2000

const TEXTAREA_CLASSES =
  'w-full rounded-lg border border-input bg-card px-3 py-2 text-body sm:text-body-sm shadow-xs transition-[border-color,box-shadow] duration-150 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-destructive'

/**
 * Mức tác động của CR: hiển thị mức hiện hành, trạng thái PM chốt, gợi ý của AI (chỉ tham khảo).
 * Chỉ PM của dự án (`canManage`) thấy ô chốt/đổi mức; hạ từ MAJOR bắt buộc lý do.
 */
export function ImpactLevelPanel({
  changeRequest,
  report,
  canManage,
  headingAs = 'h3',
}: {
  changeRequest: ChangeRequest
  report: ImpactReport | null
  canManage: boolean
  headingAs?: 'h3' | 'h4'
}) {
  const t = useTranslations('impactControl')
  const format = useFormatter()
  const getApiErrorMessage = useApiErrorMessage()
  const selectId = useId()
  const reasonId = useId()
  const reasonErrorId = useId()
  const mutation = useSetImpactLevel(changeRequest.id)
  const [level, setLevel] = useState<ImpactLevel>(changeRequest.impact_level)
  const [reason, setReason] = useState('')
  const [touched, setTouched] = useState(false)

  // Đổi CR hoặc mức được cập nhật từ máy chủ: đồng bộ lại ô chọn.
  useEffect(() => {
    setLevel(changeRequest.impact_level)
    setReason('')
    setTouched(false)
  }, [changeRequest.id, changeRequest.impact_level])

  const current = changeRequest.impact_level
  const lowersMajor = current === 'MAJOR' && level !== 'MAJOR'
  const raises = RANK[level] > RANK[current]
  const reasonInvalid = touched && lowersMajor && !reason.trim()
  const isOpen = OPEN_CR_STATUSES.includes(changeRequest.status)
  // Không đổi gì và đã chốt thì nút không có tác dụng.
  const unchanged = level === current && changeRequest.impact_level_confirmed && !reason.trim()

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (lowersMajor && !reason.trim()) return
    mutation.mutate({ level, reason: reason.trim() || null })
  }

  const errorText = (error: unknown) => {
    const code = parseImpactError(error)
    return code ? t(`errors.${code}`) : getApiErrorMessage(error)
  }

  return (
    <section aria-labelledby={`impact-level-${changeRequest.id}`} className="space-y-4">
      <div>
        <CardTitle as={headingAs} id={`impact-level-${changeRequest.id}`}>{t('panelTitle')}</CardTitle>
        <CardDescription className="mt-1">{t('panelDescription')}</CardDescription>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ImpactLevelBadge level={current} confirmed={changeRequest.impact_level_confirmed} />
      </div>

      {changeRequest.impact_level_confirmed ? (
        <p className="text-caption text-muted-foreground">
          {changeRequest.impact_level_confirmed_by_id === null
            ? t('confirmedBySystem')
            : t('confirmedAt', {
              time: format.dateTime(new Date(changeRequest.impact_level_confirmed_at as string), { dateStyle: 'medium', timeStyle: 'short' }),
            })}
        </p>
      ) : (
        <Alert>{t('notConfirmedNotice')}</Alert>
      )}

      {changeRequest.impact_level_change_reason && (
        <p className="break-words text-body-sm text-foreground">
          <span className="font-medium">{t('changeReason')}: </span>
          {changeRequest.impact_level_change_reason}
        </p>
      )}

      {report?.suggested_impact_level && (
        <div className="rounded-lg border border-dashed p-3">
          <p className="text-body-sm font-medium text-foreground">
            {/* Ghi rõ nguồn gợi ý: AI hay PM nhập thủ công, tránh nhầm là AI quyết định. */}
            {t(report.source === 'MANUAL' ? 'manualSuggestion' : 'aiSuggestion', {
              level: t(`level.${report.suggested_impact_level}`),
            })}
          </p>
          {report.impact_level_rationale && (
            <p className="mt-1 break-words text-body-sm text-muted-foreground">{report.impact_level_rationale}</p>
          )}
          <p className="mt-1 text-caption text-muted-foreground">{t('aiSuggestionNote')}</p>
        </div>
      )}

      {canManage && isOpen && (
        <form className="space-y-3" noValidate onSubmit={submit}>
          {mutation.isError && <Alert>{errorText(mutation.error)}</Alert>}
          <div>
            <Label htmlFor={selectId}>{t('selectLevel')}</Label>
            <Select id={selectId} value={level} onChange={(event) => setLevel(event.target.value as ImpactLevel)}>
              {IMPACT_LEVELS.map((item) => (
                <option key={item} value={item}>{t(`level.${item}`)}</option>
              ))}
            </Select>
            <p className="mt-1 text-caption text-muted-foreground">{t(`levelHint.${level}`)}</p>
          </div>
          {(lowersMajor || level !== current) && (
            <div>
              <Label htmlFor={reasonId}>{t('reasonLabel')}</Label>
              <textarea
                id={reasonId}
                className={TEXTAREA_CLASSES}
                rows={2}
                maxLength={REASON_MAX}
                aria-invalid={reasonInvalid}
                aria-describedby={reasonInvalid ? reasonErrorId : undefined}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
              {reasonInvalid && (
                <p id={reasonErrorId} role="alert" className="mt-1 text-body-sm text-destructive">{t('reasonMissing')}</p>
              )}
            </div>
          )}
          {raises && changeRequest.status !== 'DRAFT' && (
            <p className="text-caption text-warning">{t('raiseWarning')}</p>
          )}
          <Button type="submit" fullWidth={false} className="w-full sm:w-auto" isLoading={mutation.isPending} disabled={unchanged}>
            {t('confirmButton')}
          </Button>
        </form>
      )}
    </section>
  )
}
