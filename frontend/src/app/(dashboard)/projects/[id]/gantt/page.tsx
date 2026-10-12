'use client'
import { useLocale, useTranslations } from 'next-intl'

import { AlertTriangle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { Button } from '@/components/common/Button'
import { EmptyState, LoadingState } from '@/components/common/PageState'
import { GanttChart, type GanttChartLabels } from '@/components/gantt/GanttChart'
import { useCPM } from '@/features/gantt/hooks/useCPM'
import { useNumericParam } from '@/hooks/useNumericParam'

/**
 * Tab Gantt của dự án: hiển thị lịch tính từ CPM, phân biệt các trạng thái
 * đang tải, rỗng, vòng phụ thuộc, vượt giới hạn, đang tính lại và lỗi chung.
 */
export default function ProjectGanttPage() {
  const projectId = useNumericParam()
  const locale = useLocale()
  const t = useTranslations('gantt')
  const cpm = useCPM(projectId)

  const labels = useMemo<GanttChartLabels>(() => ({
    chart: t('chart'), zoom: t('zoom'), zoomDay: t('zoomDay'), zoomWeek: t('zoomWeek'), zoomMonth: t('zoomMonth'),
    task: t('task'), critical: t('critical'), nonCritical: t('nonCritical'), milestone: t('milestone'), float: t('float'),
    floatDays: (days: number) => t('floatDays', { days }),
    unscheduledTitle: t('unscheduledTitle'), unscheduledHint: t('unscheduledHint'), empty: t('empty'),
  }), [t])

  const tasksHref = `/projects/${projectId}/tasks`
  let body: React.ReactNode
  if (cpm.isLoading) {
    body = <LoadingState label={t('loading')} />
  } else if (cpm.error?.kind === 'cycle') {
    // 409: có vòng phụ thuộc, hướng dẫn người dùng sang trang task để gỡ một phụ thuộc.
    body = <Notice message={t('errorCycle')}><Link href={tasksHref} className="inline-flex min-h-11 items-center rounded-md border px-4 text-sm font-medium hover:bg-accent">{t('goToTasks')}</Link></Notice>
  } else if (cpm.error?.kind === 'resource_limit' || (!cpm.data && cpm.jobLimitExceeded)) {
    body = <Notice message={t('errorLimit')} hint={t('errorLimitHint')} />
  } else if (cpm.error || !cpm.data) {
    body = <Notice message={t('errorGeneric')}><Button type="button" variant="outline" onClick={cpm.refetch}><RefreshCw className="mr-2 h-4 w-4" />{t('retry')}</Button></Notice>
  } else if (cpm.data.tasks.length === 0) {
    body = <EmptyState title={t('empty')} description={t('emptyHint')} />
  } else {
    body = <GanttChart data={cpm.data} labels={labels} locale={locale} viewportHeight={480} />
  }

  return (
    // min-w-0 giữ khung không bị nội dung rộng đẩy tràn ngang; biểu đồ tự cuộn ngang bên trong.
    <div className="min-w-0 max-w-full space-y-4">
      <h2 className="text-xl font-semibold">{t('title')}</h2>
      {cpm.isRecalculating && <p role="status" className="text-sm text-muted-foreground">{t('recalculating')}</p>}
      {cpm.jobLimitExceeded && cpm.data && <p role="status" className="text-sm text-destructive">{t('errorLimit')}</p>}
      {body}
    </div>
  )
}

function Notice({ message, hint, children }: { message: string; hint?: string; children?: React.ReactNode }) {
  return (
    <div role="alert" className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <AlertTriangle className="h-7 w-7 text-destructive" />
      <p className="max-w-lg text-sm text-destructive">{message}</p>
      {hint && <p className="max-w-lg text-sm text-muted-foreground">{hint}</p>}
      {children}
    </div>
  )
}
