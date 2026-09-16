'use client'

/** SOP-AI-004 / SOP-RM-001: panel goi y nhan su cho mot Task cu the.
 *
 * Chi mang tinh tham khao - component nay KHONG tao Assignment, chi hien thi
 * xep hang cua AI de PM tu quyet dinh va tu tao Assignment qua man hinh assignment
 * hien co. Component chi export ra day, chua duoc gan vao trang/drawer nao ca -
 * viec do do phia orchestrator quyet dinh sau. */
import { Sparkles, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/types/api.types'
import {
  useRequestResourceRecommendation,
  useResourceRecommendationJob,
} from '@/features/resource-recommendation/hooks/useResourceRecommendation'

export interface ResourceRecommendationPanelProps {
  taskId: number
  /** Nhan hien thi tuy chon, vd ten task - chi dung de hien thi, khong anh huong logic. */
  taskLabel?: string
  className?: string
}

export function ResourceRecommendationPanel({ taskId, taskLabel, className }: ResourceRecommendationPanelProps) {
  const [jobId, setJobId] = useState<string | null>(null)
  const requestMutation = useRequestResourceRecommendation()
  const job = useResourceRecommendationJob(jobId)

  const isRunning = jobId !== null && !job.isError && (job.data === undefined || job.data.status === 'PENDING' || job.data.status === 'PROCESSING')
  const isFailed = (jobId !== null && job.data?.status === 'FAILED') || requestMutation.isError
  const isCompleted = job.data?.status === 'COMPLETED' && job.data.result !== null

  const suggest = async () => {
    try {
      const response = await requestMutation.mutateAsync(taskId)
      setJobId(response.job_id)
    } catch {
      // Trang thai loi cua mutation da duoc hien thi ben duoi.
    }
  }

  return (
    <div className={cn('space-y-4 rounded-md border p-4', className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Suggest assignees</h3>
          {taskLabel && <p className="text-xs text-muted-foreground">{taskLabel}</p>}
        </div>
        <Button
          type="button"
          className="w-auto"
          onClick={() => void suggest()}
          isLoading={requestMutation.isPending || isRunning}
          disabled={requestMutation.isPending || isRunning}
        >
          <Sparkles className="h-4 w-4" />
          Suggest assignees
        </Button>
      </div>

      {isFailed && (
        <Alert>
          {job.data?.error ?? getApiErrorMessage(requestMutation.error, 'AI resource recommendation failed.')}
        </Alert>
      )}

      {isRunning && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <Spinner className="h-6 w-6 text-primary" />
          <p className="text-sm text-muted-foreground">
            {job.data?.status === 'PROCESSING' ? 'AI is ranking candidates…' : 'Queued…'}
          </p>
        </div>
      )}

      {isCompleted && job.data?.result && (
        <div className="space-y-3">
          {job.data.result.summary && (
            <p className="text-sm text-muted-foreground">{job.data.result.summary}</p>
          )}
          <ul className="space-y-2">
            {job.data.result.recommendations.map((item) => (
              <li key={item.user_id} className="rounded-md border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      #{item.rank}
                    </span>
                    <div>
                      <p className="flex items-center gap-1 text-sm font-medium">
                        <UserIcon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                        {item.full_name}
                      </p>
                      {item.skills.length > 0 && (
                        <p className="text-xs text-muted-foreground">{item.skills.join(', ')}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {item.on_leave && (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                        On leave
                      </span>
                    )}
                    <span className="text-sm font-semibold">{Math.round(item.fit_score)}%</span>
                  </div>
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted" role="presentation">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(0, Math.min(100, item.fit_score))}%` }}
                  />
                </div>

                {item.reason && <p className="mt-2 text-xs text-muted-foreground">{item.reason}</p>}

                <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
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
