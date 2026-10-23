'use client'
import { useLocale, useTranslations } from 'next-intl'

import { AlertTriangle, CalendarRange, Clock3 } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { EmptyState, ErrorState } from '@/components/common/PageState'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { Skeleton, SkeletonRegion, SkeletonStatGrid, SkeletonTable } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import { useProjectMembers } from '@/features/projects/hooks/useProjectMembers'
import { useProjectWorklogs, useResourceLeveling } from '@/features/tasks/hooks/useTimesheet'
import { useNumericParam } from '@/hooks/useNumericParam'
import { formatDate } from '@/lib/format'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'

/**
 * Timesheet của dự án và cảnh báo quá tải nhân sự.
 *
 * Backend đã phục vụ `/projects/{id}/worklogs` và `/resource-leveling/{id}` từ
 * đầu Phase 2, nhưng chưa có màn hình nào gọi tới — giờ đã ghi nhận chỉ nhập được
 * trong ngăn chi tiết của từng task, và không có cách nào xem tổng hợp.
 */
export default function TimesheetPage() {
  const getApiErrorMessage = useApiErrorMessage()
  const tw = useTranslations('workflowUi')
  const locale = useLocale()
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
    members.data?.find((member) => member.user.id === id)?.user.full_name ?? tw('userFallback', { id })

  if (worklogs.isLoading) {
    // Khung xương đúng bố cục thật: bộ lọc, 3 chỉ số, bảng ghi nhận.
    return (
      <SkeletonRegion label={tw('loadingTimesheet')} className="space-y-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <SkeletonStatGrid count={3} />
        <SkeletonTable rows={5} cols={4} />
      </SkeletonRegion>
    )
  }
  if (worklogs.isError) return <ErrorState message={getApiErrorMessage(worklogs.error)} onRetry={() => void worklogs.refetch()} />

  const data = worklogs.data
  const warnings = leveling.data ?? []

  return (
    <div className="space-y-6">
      <SectionHeader title={t('title')} description={t('subtitle')} className="mb-0" />

      {/* ===== Thanh bộ lọc: thành viên và khoảng ngày ===== */}
      <Card className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="timesheet-member">{t('member')}</Label>
          <Select
            id="timesheet-member"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
          >
            <option value="">{t('everyone')}</option>
            {members.data?.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {member.user.full_name}
              </option>
            ))}
          </Select>
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
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric icon={<Clock3 className="h-5 w-5" aria-hidden="true" />} label={t('totalHours')} value={tw('hoursValue', { hours: new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(data?.total_hours ?? 0) })} />
        <Metric icon={<CalendarRange className="h-5 w-5" aria-hidden="true" />} label={t('entries')} value={new Intl.NumberFormat(locale).format(data?.items.length ?? 0)} />
        <Metric
          icon={<AlertTriangle className="h-5 w-5" aria-hidden="true" />}
          label={t('overloadWarnings')}
          value={new Intl.NumberFormat(locale).format(warnings.length)}
          alert={warnings.length > 0}
        />
      </div>

      {warnings.length > 0 && (
        <section className="rounded-xl border border-warning/25 bg-warning-soft p-4 sm:p-6">
          <h3 className="mb-3 flex items-center gap-2 text-h4">
            <AlertTriangle className="h-4 w-4 text-warning" aria-hidden="true" />
            {t('resourceWarnings')}
          </h3>
          <ul className="space-y-2 text-body-sm">
            {warnings.map((warning) => (
              <li key={`${warning.user_id}-${warning.date}-${warning.reason}`} className="flex flex-wrap items-center gap-2">
                <Badge tone={warning.reason === 'on_leave' ? 'info' : 'warning'} size="sm" dot>
                  {formatDate(warning.date, locale)}
                </Badge>
                <span>
                  <strong className="font-medium">{nameFor(warning.user_id)}</strong>:{' '}
                  {warning.reason === 'on_leave'
                    ? t('onLeave')
                    : t('overloaded', { hours: new Intl.NumberFormat(locale).format(warning.total_hours), max: new Intl.NumberFormat(locale).format(warning.max_hours) })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!data || data.items.length === 0 ? (
        <EmptyState
          icon={Clock3}
          title={t('noHours')}
          description={t('noHoursMessage')}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* ===== Bảng ghi nhận: tự cuộn ngang/dọc trong khung, tiêu đề cột dính khi cuộn ===== */}
          <Card flush className="order-2 min-w-0 overflow-hidden lg:order-1">
            <div className="max-h-[32rem] overflow-auto">
              <table className="w-full min-w-[640px] text-body-sm">
                <caption className="sr-only">{t('entriesCaption')}</caption>
                <thead className="sticky top-0 z-10 bg-muted text-left text-caption uppercase text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">{t('date')}</th>
                    <th scope="col" className="px-4 py-3 font-medium">{t('member')}</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">{t('hours')}</th>
                    <th scope="col" className="px-4 py-3 font-medium">{t('notes')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.id} className="border-t transition-colors hover:bg-muted/40">
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums">{formatDate(item.log_date, locale)}</td>
                      <td className="px-4 py-3">{item.user?.full_name ?? nameFor(item.user_id)}</td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums">{new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.hours)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.description || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="order-1 h-fit lg:order-2">
            <CardHeader className="mb-3">
              <CardTitle as="h3">{t('hoursByMember')}</CardTitle>
            </CardHeader>
            <ul className="divide-y text-body-sm">
              {Object.entries(data.by_user).map(([id, hours]) => (
                <li key={id} className="flex items-center justify-between gap-3 py-2">
                  <span className="min-w-0 truncate">{nameFor(Number(id))}</span>
                  <span className="font-medium tabular-nums">{tw('hoursValue', { hours: new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(hours) })}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
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
    <Card className={cn(alert && 'border-warning/40')}>
      <div className={cn('flex items-center gap-2', alert ? 'text-warning' : 'text-primary')}>
        {icon}
        <span className="text-overline uppercase text-muted-foreground">{label}</span>
      </div>
      <p className="mt-3 text-h3 tabular-nums">{value}</p>
    </Card>
  )
}
