'use client'

/** SOP-AI-004 / SOP-RM-001: panel gợi ý nhân sự cho một Task cụ thể.
 *
 * Chỉ mang tính tham khảo - component này KHÔNG tạo Assignment, chỉ hiển thị
 * xếp hạng của AI để PM tự quyết định và tự tạo Assignment qua màn hình assignment
 * hiện có. Panel không tự vẽ khung Card: trang cha đặt nó bên trong Card của mục
 * "Đề xuất nhân sự" để tránh card lồng card. */
import { Sparkles, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/types/api.types'
import { JobConnectionNotice } from '@/features/jobs/components/JobConnectionNotice'
import {
  useRequestResourceRecommendation,
  useResourceRecommendationJob,
} from '@/features/resource-recommendation/hooks/useResourceRecommendation'

export interface ResourceRecommendationPanelProps {
  taskId: number
  /** Nhãn hiển thị tuỳ chọn, ví dụ tên task - chỉ dùng để hiển thị, không ảnh hưởng logic. */
  taskLabel?: string
  className?: string
}

export function ResourceRecommendationPanel({ taskId, taskLabel, className }: ResourceRecommendationPanelProps) {
  const [jobId, setJobId] = useState<string | null>(null)
  const requestMutation = useRequestResourceRecommendation()
  const job = useResourceRecommendationJob(jobId)

  const isRunning = jobId !== null && (job.data === undefined || job.data.status === 'PENDING' || job.data.status === 'PROCESSING')
  const isFailed = (jobId !== null && job.data?.status === 'FAILED') || requestMutation.isError
  const isCompleted = job.data?.status === 'COMPLETED' && job.data.result !== null
  const busy = requestMutation.isPending || isRunning

  const suggest = async () => {
    try {
      const response = await requestMutation.mutateAsync(taskId)
      setJobId(response.job_id)
    } catch {
      // Trạng thái lỗi của mutation đã được hiển thị bên dưới.
    }
  }

  return (
    <div className={cn('space-y-4 rounded-xl border bg-muted/30 p-4', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h4 className="text-overline uppercase text-muted-foreground">Suggest assignees</h4>
          {taskLabel && <p className="mt-1 break-words text-body-sm font-medium text-foreground">{taskLabel}</p>}
        </div>
        <Button
          type="button"
          fullWidth={false}
          className="w-full sm:w-auto"
          onClick={() => void suggest()}
          isLoading={busy}
          disabled={busy}
        >
          {!busy && <Sparkles className="h-4 w-4" aria-hidden="true" />}
          Suggest assignees
        </Button>
      </div>

      {isFailed && (
        <Alert>
          {job.data?.error ?? getApiErrorMessage(requestMutation.error, 'AI resource recommendation failed.')}
        </Alert>
      )}

      {jobId && job.isError && <JobConnectionNotice error={job.error} />}
      {isRunning && !job.isError && (
        // Khung xương có hình dạng danh sách ứng viên (hạng, tên, thanh điểm phù hợp).
        <div role="status" className="space-y-3">
          <p className="text-body-sm text-muted-foreground">
            {job.data?.status === 'PROCESSING' ? 'AI is ranking candidates…' : 'Queued…'}
          </p>
          <div aria-hidden="true" className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isCompleted && job.data?.result && (
        <div className="space-y-3 animate-fade-up">
          {job.data.result.summary && (
            <p className="max-w-prose-ui text-body-sm text-muted-foreground">{job.data.result.summary}</p>
          )}
          <ul className="grid gap-3 md:grid-cols-2">
            {job.data.result.recommendations.map((item) => (
              <li key={item.user_id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-caption font-semibold text-accent-foreground">
                      #{item.rank}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 break-words text-body-sm font-medium text-foreground">
                        <UserIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        {item.full_name}
                      </p>
                      {item.skills.length > 0 && (
                        <p className="break-words text-caption text-muted-foreground">{item.skills.join(', ')}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {item.on_leave && <Badge tone="warning" size="sm">On leave</Badge>}
                    <span className="text-h4 tabular-nums text-foreground">{Math.round(item.fit_score)}%</span>
                  </div>
                </div>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted" role="presentation">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(0, Math.min(100, item.fit_score))}%` }}
                  />
                </div>

                {item.reason && <p className="mt-2 text-caption text-muted-foreground">{item.reason}</p>}

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted-foreground">
                  <span>Workload: {item.current_workload_hours}h</span>
                  <span>Rate: {formatMoney(item.hourly_rate)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
