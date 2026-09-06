'use client'
import { useTranslations } from 'next-intl'

import { AlertTriangle, CalendarRange, Clock3 } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { useProjectMembers } from '@/features/projects/hooks/useProjectMembers'
import { useProjectWorklogs, useResourceLeveling } from '@/features/tasks/hooks/useTimesheet'
import { useNumericParam } from '@/hooks/useNumericParam'
import { formatDate } from '@/lib/format'
import { getApiErrorMessage } from '@/types/api.types'

/**
 * Timesheet của dự án và cảnh báo quá tải nhân sự.
 *
 * Backend đã phục vụ `/projects/{id}/worklogs` và `/resource-leveling/{id}` từ
 * đầu Phase 2, nhưng chưa có màn hình nào gọi tới — giờ đã ghi nhận chỉ nhập được
 * trong ngăn chi tiết của từng task, và không có cách nào xem tổng hợp.
 */
export default function TimesheetPage() {
  const projectId = useNumericParam()
  const [userId, setUserId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filters = {
    user_id: userId ? Number(userId) : undefined,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  }
  const worklogs = useProjectWorklogs(projectId, filters)
  const leveling = useResourceLeveling(projectId, {
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  })
  const members = useProjectMembers(projectId)
  const t = useTranslations('timesheet')

  const nameFor = (id: number) =>
    members.data?.find((member) => member.user.id === id)?.user.full_name ?? `User #${id}`

  if (worklogs.isLoading) return <LoadingState label="Loading timesheet…" />
  if (worklogs.isError) return <ErrorState message={getApiErrorMessage(worklogs.error)} />

  const data = worklogs.data
  const warnings = leveling.data ?? []

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </header>

      <section className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="timesheet-member">{t('member')}</Label>
          <select
            id="timesheet-member"
            className="h-11 w-full rounded-md border bg-background px-3 text-sm"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
          >
            <option value="">{t('everyone')}</option>
            {members.data?.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {member.user.full_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="timesheet-from">{t('from')}</Label>
          <Input
            id="timesheet-from"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="timesheet-to">{t('to')}</Label>
          <Input
            id="timesheet-to"
            type="date"
            min={startDate || undefined}
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric icon={<Clock3 className="h-5 w-5" />} label={t('totalHours')} value={`${data?.total_hours.toFixed(1) ?? '0.0'}h`} />
        <Metric icon={<CalendarRange className="h-5 w-5" />} label={t('entries')} value={String(data?.items.length ?? 0)} />
        <Metric
          icon={<AlertTriangle className="h-5 w-5" />}
          label={t('overloadWarnings')}
          value={String(warnings.length)}
          alert={warnings.length > 0}
        />
      </div>

      {warnings.length > 0 && (
        <section className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            {t('resourceWarnings')}
          </h3>
          <ul className="space-y-1 text-sm">
            {warnings.map((warning) => (
              <li key={`${warning.user_id}-${warning.date}-${warning.reason}`}>
                <strong>{nameFor(warning.user_id)}</strong> — {formatDate(warning.date)}:{' '}
                {warning.reason === 'on_leave'
                  ? t('onLeave')
                  : t('overloaded', { hours: warning.total_hours, max: warning.max_hours })}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!data || data.items.length === 0 ? (
        <EmptyState
          title={t('noHours')}
          description={t('noHoursMessage')}
        />
      ) : (
        <>
          <section className="rounded-xl border bg-card p-5">
            <h3 className="mb-3 font-semibold">{t('hoursByMember')}</h3>
            <ul className="space-y-2 text-sm">
              {Object.entries(data.by_user).map(([id, hours]) => (
                <li key={id} className="flex items-center justify-between gap-3">
                  <span>{nameFor(Number(id))}</span>
                  <span className="font-medium">{hours.toFixed(1)}h</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[640px] text-sm">
              <caption className="sr-only">{t('entriesCaption')}</caption>
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th scope="col" className="p-3">{t('date')}</th>
                  <th scope="col" className="p-3">{t('member')}</th>
                  <th scope="col" className="p-3">{t('hours')}</th>
                  <th scope="col" className="p-3">{t('notes')}</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="p-3">{formatDate(item.log_date)}</td>
                    <td className="p-3">{item.user?.full_name ?? nameFor(item.user_id)}</td>
                    <td className="p-3">{item.hours.toFixed(2)}</td>
                    <td className="p-3 text-muted-foreground">{item.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function Metric({
  icon,
  label,
  value,
  alert = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  alert?: boolean
}) {
  return (
    <div className={`rounded-xl border bg-card p-5 ${alert ? 'border-amber-500/40' : ''}`}>
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-3 text-lg font-semibold">{value}</p>
    </div>
  )
}
