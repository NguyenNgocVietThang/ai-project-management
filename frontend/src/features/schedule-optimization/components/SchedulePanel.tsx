'use client'

// SOP-AI-003: panel tối ưu lịch trình bằng AI (fast-track / crash / cân bằng workload). Nhận
// `tasks` từ component cha để tra tên task theo task_id.
import { useId, useState } from 'react'
import { CalendarClock, Sparkles } from 'lucide-react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Label } from '@/components/common/Label'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton'
import {
  useOptimizeSchedule,
  useScheduleOptimizationJob,
} from '@/features/schedule-optimization/hooks/useScheduleOptimization'
import { getApiErrorMessage } from '@/types/api.types'
import { JobConnectionNotice } from '@/features/jobs/components/JobConnectionNotice'
import type { ScheduleSuggestion } from '@/types/schedule-optimization.types'

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Đang xếp hàng…',
  PROCESSING: 'AI đang phân tích lịch trình…',
}

const ACTION_LABEL: Record<ScheduleSuggestion['action'], string> = {
  CRASH: 'Rút ngắn (Crash)',
  FAST_TRACK: 'Chạy song song (Fast-track)',
  REASSIGN: 'Phân công lại',
  OTHER: 'Khác',
}

// Loại hành động -> tông Badge (token ngữ nghĩa).
const ACTION_TONE: Record<ScheduleSuggestion['action'], BadgeTone> = {
  CRASH: 'warning',
  FAST_TRACK: 'info',
  REASSIGN: 'primary',
  OTHER: 'neutral',
}

// Ô nhập nhiều dòng cùng kiểu với Input (bo 8px, viền input, focus ring).
const TEXTAREA_CLASSES =
  'w-full rounded-lg border border-input bg-card px-3 py-2 text-body sm:text-body-sm shadow-xs transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export interface SchedulePanelTask {
  id: number
  name: string
}

export interface SchedulePanelProps {
  projectId: number
  tasks?: SchedulePanelTask[]
  className?: string
}

/** Panel tự chứa (dạng Card): nút chạy tối ưu, ô nhập ràng buộc tự do, khung
 * xương khi đang chạy, và bảng đề xuất khi có kết quả. PM xem xét rồi tự áp dụng thủ công
 * qua các API chỉnh sửa task đã có — panel này không ghi gì cả. */
export function SchedulePanel({ projectId, tasks = [], className }: SchedulePanelProps) {
  const constraintsId = useId()
  const [constraintsText, setConstraintsText] = useState('')
  const [jobId, setJobId] = useState<string | null>(null)
  const optimizeMutation = useOptimizeSchedule()
  const job = useScheduleOptimizationJob(jobId)

  const taskNameById = new Map(tasks.map((task) => [task.id, task.name]))

  const run = async () => {
    try {
      const trimmed = constraintsText.trim()
      const response = await optimizeMutation.mutateAsync({
        projectId,
        constraints: trimmed ? { notes: trimmed } : undefined,
      })
      setJobId(response.job_id)
    } catch {
      // Trạng thái lỗi của mutation được hiển thị bên dưới.
    }
  }

  const reset = () => {
    setJobId(null)
    optimizeMutation.reset()
  }

  const isRunning = jobId !== null && !job.isError && job.data?.status !== 'COMPLETED' && job.data?.status !== 'FAILED'
  const result = job.data?.status === 'COMPLETED' ? job.data.result : null

  return (
    <Card as="section" aria-labelledby={`${constraintsId}-title`} className={cn('min-w-0', className)}>
      <CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent" aria-hidden="true">
            <CalendarClock className="h-5 w-5 text-accent-foreground" />
          </span>
          <div className="min-w-0">
            <CardTitle as="h3" id={`${constraintsId}-title`}>Tối ưu lịch trình bằng AI</CardTitle>
            <CardDescription>
              AI đề xuất rút ngắn (crash), chạy song song (fast-track) hoặc phân công lại dựa trên
              đường găng (CPM) hiện tại của dự án. Đây chỉ là gợi ý tham khảo — bạn xem xét và tự áp
              dụng qua các màn hình chỉnh sửa task như bình thường.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <div className="space-y-4">
        {!jobId && (
          <div className="space-y-4">
            {optimizeMutation.isError && <Alert>{getApiErrorMessage(optimizeMutation.error)}</Alert>}
            <div>
              <Label htmlFor={constraintsId}>Ràng buộc bổ sung (tuỳ chọn)</Label>
              <textarea
                id={constraintsId}
                rows={3}
                value={constraintsText}
                onChange={(event) => setConstraintsText(event.target.value)}
                placeholder="Ví dụ: không được rút ngắn giai đoạn kiểm thử, ưu tiên giữ nguyên nhóm backend"
                className={TEXTAREA_CLASSES}
              />
            </div>
            <Button type="button" fullWidth={false} className="w-full sm:w-auto" isLoading={optimizeMutation.isPending} onClick={() => void run()}>
              {!optimizeMutation.isPending && <Sparkles className="h-4 w-4" aria-hidden="true" />}
              Chạy tối ưu lịch trình
            </Button>
          </div>
        )}

        {jobId && job.isError && (
          <div className="space-y-3">
            <JobConnectionNotice error={job.error} />
            <Button type="button" variant="outline" fullWidth={false} className="w-full sm:w-auto" isLoading={job.isFetching} onClick={() => void job.refetch()}>
              Thử kiểm tra lại
            </Button>
          </div>
        )}

        {jobId && !job.isError && isRunning && (
          // Khung xương có hình dạng kết quả: thông báo tóm tắt + bảng đề xuất.
          <div role="status" className="space-y-4">
            <p className="text-body-sm text-muted-foreground">{STATUS_LABEL[job.data?.status ?? 'PENDING']}</p>
            <div aria-hidden="true" className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <SkeletonText lines={4} />
            </div>
          </div>
        )}

        {jobId && job.data?.status === 'FAILED' && (
          <div className="space-y-3">
            <Alert>{job.data.error ?? 'Tối ưu lịch trình bằng AI thất bại.'}</Alert>
            <Button type="button" variant="outline" fullWidth={false} className="w-full sm:w-auto" onClick={reset}>
              Thử lại
            </Button>
          </div>
        )}

        {jobId && job.data?.status === 'COMPLETED' && result && (
          <div className="space-y-4 animate-fade-up">
            <Alert variant="success">
              {result.summary || 'Đã có đề xuất tối ưu lịch trình.'}
              {result.estimated_days_saved > 0 && (
                <> Ước tính tiết kiệm khoảng {result.estimated_days_saved} ngày nếu áp dụng toàn bộ.</>
              )}
            </Alert>

            {result.suggestions.length === 0 ? (
              <p className="text-body-sm text-muted-foreground">
                AI không tìm thấy đề xuất nào phù hợp cho lịch trình hiện tại.
              </p>
            ) : (
              // Bảng tự cuộn ngang trong khung, trang không bị cuộn ngang trên mobile.
              <div className="overflow-hidden rounded-xl border">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-body-sm">
                    <thead className="bg-muted/50 text-caption uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Task</th>
                        <th className="px-4 py-3 font-medium">Hành động</th>
                        <th className="px-4 py-3 font-medium">Chi tiết</th>
                        <th className="px-4 py-3 text-right font-medium">Ngày tiết kiệm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.suggestions.map((suggestion, index) => (
                        <tr key={`${suggestion.task_id}-${index}`} className="border-t transition-colors hover:bg-muted/40">
                          <td className="px-4 py-3 align-top font-medium text-foreground">
                            {taskNameById.get(suggestion.task_id) ?? `Task #${suggestion.task_id}`}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <Badge tone={ACTION_TONE[suggestion.action]} size="sm">{ACTION_LABEL[suggestion.action]}</Badge>
                          </td>
                          <td className="px-4 py-3 align-top text-muted-foreground">{suggestion.detail}</td>
                          <td className="px-4 py-3 text-right align-top tabular-nums">{suggestion.estimated_days_saved}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="button" variant="outline" fullWidth={false} className="w-full sm:w-auto" onClick={reset}>
                Chạy lại
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
