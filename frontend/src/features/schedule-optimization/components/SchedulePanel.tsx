'use client'

// SOP-AI-003: panel tối ưu lịch trình bằng AI (fast-track / crash / cân bằng workload). Nhận
// `tasks` từ component cha để tra tên task theo task_id.
import { useId, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Label } from '@/components/common/Label'
import { Spinner } from '@/components/common/Spinner'
import {
  useOptimizeSchedule,
  useScheduleOptimizationJob,
} from '@/features/schedule-optimization/hooks/useScheduleOptimization'
import { getApiErrorMessage } from '@/types/api.types'
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

export interface SchedulePanelTask {
  id: number
  name: string
}

export interface SchedulePanelProps {
  projectId: number
  tasks?: SchedulePanelTask[]
  className?: string
}

/** Panel tự chứa: nút chạy tối ưu, ô nhập ràng buộc tự do, spinner khi đang
 * chạy, và bảng đề xuất khi có kết quả. PM xem xét rồi tự áp dụng thủ công
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
    <div className={`space-y-4 rounded-lg border bg-card p-4 ${className ?? ''}`}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="text-base font-semibold">Tối ưu lịch trình bằng AI</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        AI đề xuất rút ngắn (crash), chạy song song (fast-track) hoặc phân công lại dựa trên
        đường găng (CPM) hiện tại của dự án. Đây chỉ là gợi ý tham khảo — bạn xem xét và tự áp
        dụng qua các màn hình chỉnh sửa task như bình thường.
      </p>

      {!jobId && (
        <div className="space-y-3">
          {optimizeMutation.isError && <Alert>{getApiErrorMessage(optimizeMutation.error)}</Alert>}
          <div>
            <Label htmlFor={constraintsId}>Ràng buộc bổ sung (tuỳ chọn)</Label>
            <textarea
              id={constraintsId}
              rows={3}
              value={constraintsText}
              onChange={(event) => setConstraintsText(event.target.value)}
              placeholder="Ví dụ: không được rút ngắn giai đoạn kiểm thử, ưu tiên giữ nguyên nhóm backend"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button type="button" className="sm:w-auto" isLoading={optimizeMutation.isPending} onClick={() => void run()}>
            <Sparkles className="h-4 w-4" />
            Chạy tối ưu lịch trình
          </Button>
        </div>
      )}

      {jobId && job.isError && (
        <div className="space-y-3">
          <Alert>{getApiErrorMessage(job.error)}</Alert>
          <Button type="button" variant="outline" className="sm:w-auto" isLoading={job.isFetching} onClick={() => void job.refetch()}>
            Thử kiểm tra lại
          </Button>
        </div>
      )}

      {jobId && !job.isError && isRunning && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-sm text-muted-foreground">{STATUS_LABEL[job.data?.status ?? 'PENDING']}</p>
        </div>
      )}

      {jobId && job.data?.status === 'FAILED' && (
        <div className="space-y-3">
          <Alert>{job.data.error ?? 'Tối ưu lịch trình bằng AI thất bại.'}</Alert>
          <Button type="button" variant="outline" className="sm:w-auto" onClick={reset}>
            Thử lại
          </Button>
        </div>
      )}

      {jobId && job.data?.status === 'COMPLETED' && result && (
        <div className="space-y-4">
          <Alert variant="success">
            {result.summary || 'Đã có đề xuất tối ưu lịch trình.'}
            {result.estimated_days_saved > 0 && (
              <> Ước tính tiết kiệm khoảng {result.estimated_days_saved} ngày nếu áp dụng toàn bộ.</>
            )}
          </Alert>

          {result.suggestions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              AI không tìm thấy đề xuất nào phù hợp cho lịch trình hiện tại.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Task</th>
                    <th className="py-2 pr-3 font-medium">Hành động</th>
                    <th className="py-2 pr-3 font-medium">Chi tiết</th>
                    <th className="py-2 font-medium">Ngày tiết kiệm</th>
                  </tr>
                </thead>
                <tbody>
                  {result.suggestions.map((suggestion, index) => (
                    <tr key={`${suggestion.task_id}-${index}`} className="border-b last:border-0">
                      <td className="py-2 pr-3 align-top">
                        {taskNameById.get(suggestion.task_id) ?? `Task #${suggestion.task_id}`}
                      </td>
                      <td className="py-2 pr-3 align-top">{ACTION_LABEL[suggestion.action]}</td>
                      <td className="py-2 pr-3 align-top">{suggestion.detail}</td>
                      <td className="py-2 align-top">{suggestion.estimated_days_saved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="button" variant="outline" className="sm:w-auto" onClick={reset}>
              Chạy lại
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
