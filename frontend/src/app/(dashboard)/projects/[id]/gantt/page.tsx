'use client'
import { useLocale, useTranslations } from 'next-intl'

import { AlertTriangle, GanttChartSquare, ListTodo, RefreshCw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button, ButtonLink } from '@/components/common/Button'
import { EmptyState } from '@/components/common/PageState'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/PageHeader'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { GanttChart, type GanttChartLabels } from '@/components/gantt/GanttChart'
import { useCPM } from '@/features/gantt/hooks/useCPM'
import { useNumericParam } from '@/hooks/useNumericParam'
import { ScheduleList, type ScheduleListLabels } from '@/features/gantt/components/ScheduleList'
import { cn } from '@/lib/utils'

/**
 * Tab Gantt của dự án: hiển thị lịch tính từ CPM, phân biệt các trạng thái
 * đang tải, rỗng, vòng phụ thuộc, vượt giới hạn, đang tính lại và lỗi chung.
 */
export default function ProjectGanttPage() {
  const projectId = useNumericParam()
  const locale = useLocale()
  const t = useTranslations('gantt')
  const cpm = useCPM(projectId)
  const [isMobile, setIsMobile] = useState(false)
  const [chosenView, setChosenView] = useState<'schedule' | 'chart' | null>(null)
  const view = chosenView ?? (isMobile ? 'schedule' : 'chart')

  useEffect(() => {
    if (!window.matchMedia) return
    const media = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const labels = useMemo<GanttChartLabels>(() => ({
    chart: t('chart'), zoom: t('zoom'), zoomDay: t('zoomDay'), zoomWeek: t('zoomWeek'), zoomMonth: t('zoomMonth'),
    task: t('task'), critical: t('critical'), nonCritical: t('nonCritical'), milestone: t('milestone'), float: t('float'),
    floatDays: (days: number) => t('floatDays', { days }),
    unscheduledTitle: t('unscheduledTitle'), unscheduledHint: t('unscheduledHint'), empty: t('empty'),
    timeline: t('timeline'), scrollHint: t('scrollHint'), nameColumnWidth: t('nameColumnWidth'),
    widthStandard: t('widthStandard'), widthWide: t('widthWide'), widthExtraWide: t('widthExtraWide'),
    taskDetails: t('taskDetails'), selectionHint: t('selectionHint'),
  }), [t])
  const scheduleLabels = useMemo<ScheduleListLabels>(() => ({
    title: t('scheduleTitle'), hint: t('scheduleHint'), grouping: t('scheduleGrouping'), day: t('zoomDay'), week: t('zoomWeek'),
    weekOf: (date) => t('weekOf', { date }), critical: t('critical'), milestone: t('milestone'),
    unscheduledTitle: t('unscheduledTitle'), unscheduledHint: t('unscheduledHint'),
  }), [t])

  const tasksHref = `/projects/${projectId}/tasks`
  let body: React.ReactNode
  if (cpm.isLoading) {
    body = <GanttSkeleton label={t('loading')} />
  } else if (cpm.error?.kind === 'cycle') {
    // 409: có vòng phụ thuộc, hướng dẫn người dùng sang trang task để gỡ một phụ thuộc.
    body = <Notice message={t('errorCycle')}><ButtonLink href={tasksHref} variant="outline">{t('goToTasks')}</ButtonLink></Notice>
  } else if (cpm.error?.kind === 'resource_limit' || (!cpm.data && cpm.jobLimitExceeded)) {
    body = <Notice message={t('errorLimit')} hint={t('errorLimitHint')} />
  } else if (cpm.error || !cpm.data) {
    body = <Notice message={t('errorGeneric')}><Button type="button" variant="outline" fullWidth={false} onClick={cpm.refetch}><RefreshCw className="h-4 w-4" aria-hidden="true" />{t('retry')}</Button></Notice>
  } else if (cpm.data.tasks.length === 0) {
    body = <EmptyState icon={GanttChartSquare} title={t('empty')} description={t('emptyHint')} action={<ButtonLink href={tasksHref}><ListTodo className="h-4 w-4" aria-hidden="true" />{t('goToTasks')}</ButtonLink>} />
  } else {
    body = <Card flush className="min-w-0 overflow-hidden p-3 sm:p-4">
      <div role="group" aria-label={t('view')} className="mb-4 flex w-fit max-w-full flex-wrap gap-1 rounded-lg border border-border p-1">
        {(['schedule', 'chart'] as const).map((option) => <button key={option} type="button" aria-pressed={view === option} onClick={() => setChosenView(option)}
          className={cn('min-h-11 min-w-11 rounded-md px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', view === option ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>
          {t(option === 'schedule' ? 'viewSchedule' : 'viewChart')}
        </button>)}
      </div>
      {view === 'schedule' ? <ScheduleList data={cpm.data} labels={scheduleLabels} locale={locale} /> : <GanttChart data={cpm.data} labels={labels} locale={locale} viewportHeight={560} />}
    </Card>
  }

  return (
    // min-w-0 giữ khung không bị nội dung rộng đẩy tràn ngang; biểu đồ tự cuộn ngang bên trong.
    <div className="min-w-0 max-w-full space-y-4">
      <SectionHeader title={t('title')} className="mb-0" />
      {(cpm.isRecalculating || (cpm.jobLimitExceeded && cpm.data)) && (
        <div className="flex flex-wrap gap-2">
          {cpm.isRecalculating && <p role="status" className="inline-flex items-center gap-2 rounded-lg border border-info/20 bg-info-soft px-3 py-2 text-body-sm text-info"><RefreshCw className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />{t('recalculating')}</p>}
          {cpm.jobLimitExceeded && cpm.data && <p role="status" className="inline-flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-body-sm text-destructive"><AlertTriangle className="h-4 w-4" aria-hidden="true" />{t('errorLimit')}</p>}
        </div>
      )}
      {body}
    </div>
  )
}

function Notice({ message, hint, children }: { message: string; hint?: string; children?: React.ReactNode }) {
  return (
    <div role="alert" className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-xl border border-destructive/25 bg-destructive/5 p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
      </span>
      <p className="max-w-prose-ui text-body-sm text-destructive">{message}</p>
      {hint && <p className="max-w-prose-ui text-body-sm text-muted-foreground">{hint}</p>}
      {children}
    </div>
  )
}

/** Khung xương giống biểu đồ Gantt: cột tên task bên trái, các thanh lệch nhau bên phải. */
function GanttSkeleton({ label }: { label: string }) {
  const bars = [['w-1/3', 'ml-0'], ['w-1/4', 'ml-[20%]'], ['w-2/5', 'ml-[30%]'], ['w-1/5', 'ml-[55%]'], ['w-1/3', 'ml-[45%]']] as const
  return (
    <SkeletonRegion label={label}>
      <Card flush className="space-y-4 p-4" aria-hidden="true">
        <div className="flex justify-end gap-2"><Skeleton className="h-9 w-48" /></div>
        {bars.map(([width, offset], i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-24 shrink-0 sm:w-40" />
            <div className="min-w-0 flex-1"><Skeleton className={`h-6 rounded-md ${width} ${offset}`} /></div>
          </div>
        ))}
      </Card>
    </SkeletonRegion>
  )
}
