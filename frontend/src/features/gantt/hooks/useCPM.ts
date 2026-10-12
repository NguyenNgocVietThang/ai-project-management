'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { classifyCPMError, cpmService } from '@/services/cpm.service'
import { taskKeys } from '@/features/tasks/hooks/useTasks'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import type { CPMError, CPMResponse } from '@/types/cpm.types'
import type { DurableJob } from '@/types/job.types'

export const CPM_JOB_KIND = 'scheduling.cpm'

export const cpmKeys = {
  /**
   * Đặt dưới `taskKeys.project` có chủ ý: mọi mutation task/dependency đã invalidate
   * khoá đó (xem useTasks), nên CPM tự tải lại mà không cần sửa từng mutation.
   */
  project: (projectId: number) => [...taskKeys.project(projectId), 'cpm'] as const,
}

/** Lỗi 4xx là kết quả xác định (vòng phụ thuộc, vượt giới hạn, không có quyền): không thử lại. */
function shouldRetry(failureCount: number, error: unknown): boolean {
  const status = (error as { response?: { status?: number } } | null)?.response?.status
  if (status !== undefined && status >= 400 && status < 500) return false
  return failureCount < 2
}

/**
 * Theo dõi các job `scheduling.cpm` của dự án; khi một job chuyển sang `succeeded`
 * (kể cả job được gộp và chạy lại, nhận ra qua `updated_at` mới) thì invalidate CPM.
 * Lần nạp đầu chỉ ghi nhận trạng thái, không invalidate, vì query CPM vừa tải mới.
 */
function useReloadWhenCPMJobSucceeds(projectId: number, jobs: DurableJob[] | undefined) {
  const client = useQueryClient()
  const seen = useRef<Map<number, string> | null>(null)
  useEffect(() => {
    if (!jobs) return
    const succeeded = jobs.filter(
      (job) => job.kind === CPM_JOB_KIND && job.project_id === projectId && job.status === 'succeeded'
    )
    const previous = seen.current
    const next = new Map(succeeded.map((job) => [job.id, job.updated_at]))
    seen.current = next
    if (previous === null) return
    const changed = succeeded.some((job) => previous.get(job.id) !== job.updated_at)
    if (changed) void client.invalidateQueries({ queryKey: cpmKeys.project(projectId) })
  }, [client, jobs, projectId])
}

export interface UseCPMResult {
  data: CPMResponse | undefined
  isLoading: boolean
  isFetching: boolean
  /** Lỗi đã phân loại; null khi không có lỗi. */
  error: CPMError | null
  /** Có job tính lại CPM đang chờ/chạy cho dự án: dữ liệu hiện tại có thể đã cũ. */
  isRecalculating: boolean
  /** Job CPM gần nhất của dự án thất bại vì vượt giới hạn tài nguyên. */
  jobLimitExceeded: boolean
  refetch: () => void
}

export function useCPM(projectId: number): UseCPMResult {
  const query = useQuery({
    queryKey: cpmKeys.project(projectId),
    queryFn: ({ signal }) => cpmService.get(projectId, signal),
    enabled: Number.isFinite(projectId) && projectId > 0,
    retry: shouldRetry,
  })
  const jobs = useJobs().data
  useReloadWhenCPMJobSucceeds(projectId, jobs)

  const projectJobs = useMemo(
    () => (jobs ?? []).filter((job) => job.kind === CPM_JOB_KIND && job.project_id === projectId),
    [jobs, projectId]
  )
  // Danh sách job sắp theo id giảm dần nên phần tử đầu là job mới nhất.
  const latest = projectJobs[0]
  const error = useMemo(() => (query.error ? classifyCPMError(query.error) : null), [query.error])

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error,
    isRecalculating: projectJobs.some((job) => job.status === 'queued' || job.status === 'running'),
    jobLimitExceeded: latest?.status === 'failed' && latest.error_code === 'resource_limit_exceeded',
    refetch: () => void query.refetch(),
  }
}
