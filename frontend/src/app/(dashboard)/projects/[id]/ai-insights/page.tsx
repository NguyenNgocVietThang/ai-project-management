'use client'

// Gộp Risk Analysis (SOP-AI-005), Schedule Optimization (SOP-AI-003) và Resource Recommendation
// (SOP-AI-004). AI Impact Analysis (SOP-AI-002) có trang riêng ở /change-requests.
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Users } from 'lucide-react'
import { useNumericParam } from '@/hooks/useNumericParam'
import { ErrorState } from '@/components/common/PageState'
import { Label } from '@/components/common/Label'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { Skeleton, SkeletonCard, SkeletonRegion } from '@/components/ui/Skeleton'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { RiskWidget } from '@/features/risk-analysis/components/RiskWidget'
import { SchedulePanel } from '@/features/schedule-optimization/components/SchedulePanel'
import { ResourceRecommendationPanel } from '@/features/resource-recommendation/components/ResourceRecommendationPanel'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'

export default function AIInsightsPage() {
  const projectId = useNumericParam()
  const t = useTranslations('project')
  const ui = useTranslations('insightsUi')
  const getApiErrorMessage = useApiErrorMessage()
  const tasksQuery = useTasks(projectId, useMemo(() => ({ page_size: 200 }), []))
  const [selectedTaskId, setSelectedTaskId] = useState<number | ''>('')

  const header = (
    <SectionHeader
      title={t('aiInsights')}
      description={ui('description')}
    />
  )

  if (tasksQuery.isLoading) {
    // Khung xương theo bố cục thật: 2 card AI cạnh nhau + card đề xuất nhân sự.
    return (
      <div className="space-y-6">
        {header}
        <SkeletonRegion label={ui('loadingTasks')} className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <Skeleton className="h-48 rounded-xl" />
        </SkeletonRegion>
      </div>
    )
  }
  if (tasksQuery.isError) {
    return (
      <div className="space-y-6">
        {header}
        <ErrorState message={getApiErrorMessage(tasksQuery.error)} onRetry={() => void tasksQuery.refetch()} retryLabel={ui('retry')} />
      </div>
    )
  }

  const tasks = tasksQuery.data?.items ?? []
  const selectedTask = tasks.find((task) => task.id === selectedTaskId)

  return (
    <div className="space-y-6">
      {header}

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <RiskWidget projectId={projectId} />
        <SchedulePanel projectId={projectId} tasks={tasks.map((task) => ({ id: task.id, name: task.name }))} />
      </div>

      {/* ===== Đề xuất nhân sự theo công việc ===== */}
      <Card as="section" aria-labelledby="resource-recommendation-title">
        <CardHeader>
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent" aria-hidden="true">
              <Users className="h-5 w-5 text-accent-foreground" />
            </span>
            <div className="min-w-0">
              <CardTitle as="h3" id="resource-recommendation-title">{ui('resourceTitle')}</CardTitle>
              <CardDescription>
                {ui('resourceDescription')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="space-y-4">
          <div className="max-w-md">
            <Label htmlFor="resource-recommendation-task">{ui('task')}</Label>
            <Select
              id="resource-recommendation-task"
              value={selectedTaskId}
              onChange={(event) => setSelectedTaskId(event.target.value ? Number(event.target.value) : '')}
            >
              <option value="">{ui('selectTask')}</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>{task.name}</option>
              ))}
            </Select>
          </div>
          {selectedTask && (
            <ResourceRecommendationPanel taskId={selectedTask.id} taskLabel={selectedTask.name} />
          )}
        </div>
      </Card>
    </div>
  )
}
