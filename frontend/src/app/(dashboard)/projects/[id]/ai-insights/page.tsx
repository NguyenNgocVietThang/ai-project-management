'use client'

// Gộp Risk Analysis (SOP-AI-005), Schedule Optimization (SOP-AI-003) và Resource Recommendation
// (SOP-AI-004). AI Impact Analysis (SOP-AI-002) có trang riêng ở /change-requests.
import { useMemo, useState } from 'react'
import { useNumericParam } from '@/hooks/useNumericParam'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { Label } from '@/components/common/Label'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { RiskWidget } from '@/features/risk-analysis/components/RiskWidget'
import { SchedulePanel } from '@/features/schedule-optimization/components/SchedulePanel'
import { ResourceRecommendationPanel } from '@/features/resource-recommendation/components/ResourceRecommendationPanel'
import { getApiErrorMessage } from '@/types/api.types'

export default function AIInsightsPage() {
  const projectId = useNumericParam()
  const tasksQuery = useTasks(projectId, useMemo(() => ({ page_size: 200 }), []))
  const [selectedTaskId, setSelectedTaskId] = useState<number | ''>('')

  if (tasksQuery.isLoading) return <LoadingState label="Đang tải công việc của dự án…" />
  if (tasksQuery.isError) return <ErrorState message={getApiErrorMessage(tasksQuery.error)} />

  const tasks = tasksQuery.data?.items ?? []
  const selectedTask = tasks.find((task) => task.id === selectedTaskId)

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-5">
        <h2 className="mb-4 text-lg font-semibold">Phân tích rủi ro dự án</h2>
        <RiskWidget projectId={projectId} />
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="mb-4 text-lg font-semibold">Tối ưu lịch trình</h2>
        <SchedulePanel projectId={projectId} tasks={tasks.map((task) => ({ id: task.id, name: task.name }))} />
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="mb-1 text-lg font-semibold">Đề xuất nhân sự</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Chọn một công việc để AI đề xuất người phù hợp nhất theo kỹ năng, khối lượng công việc hiện tại và chi phí.
        </p>
        <div className="mb-4 max-w-md">
          <Label htmlFor="resource-recommendation-task">Công việc</Label>
          <select
            id="resource-recommendation-task"
            value={selectedTaskId}
            onChange={(event) => setSelectedTaskId(event.target.value ? Number(event.target.value) : '')}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">— Chọn công việc —</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>{task.name}</option>
            ))}
          </select>
        </div>
        {selectedTask && (
          <ResourceRecommendationPanel taskId={selectedTask.id} taskLabel={selectedTask.name} />
        )}
      </section>
    </div>
  )
}
