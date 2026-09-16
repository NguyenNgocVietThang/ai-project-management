'use client'

// SOP-AI-003: mirror pattern của features/ai/hooks/useAIGenerator.ts (poll job
// đang chạy nền bằng refetchInterval) nhưng viết bản riêng để không đụng file
// dùng chung của pillar 1.
import { useMutation, useQuery } from '@tanstack/react-query'
import { scheduleOptimizationService } from '@/services/schedule-optimization.service'
import type { ScheduleOptimizationJobStatus } from '@/types/schedule-optimization.types'

const IN_PROGRESS: ScheduleOptimizationJobStatus[] = ['PENDING', 'PROCESSING']

export const scheduleOptimizationJobKeys = {
  job: (jobId: string) => ['schedule-optimization', 'jobs', jobId] as const,
}

export function useOptimizeSchedule() {
  return useMutation({
    mutationFn: ({ projectId, constraints }: { projectId: number; constraints?: Record<string, unknown> }) =>
      scheduleOptimizationService.requestScheduleOptimization(projectId, constraints),
  })
}

export function useScheduleOptimizationJob(jobId: string | null) {
  return useQuery({
    queryKey: scheduleOptimizationJobKeys.job(jobId ?? ''),
    queryFn: () => scheduleOptimizationService.getJob(jobId!),
    enabled: jobId !== null,
    // Job AI chạy nền qua Celery — poll thay vì bắt người dùng tự bấm refresh,
    // dừng ngay khi có kết quả cuối cùng (COMPLETED/FAILED) hoặc query lỗi.
    refetchInterval: (query) =>
      query.state.status === 'error'
        ? false
        : !query.state.data || IN_PROGRESS.includes(query.state.data.status)
          ? 2_000
          : false,
  })
}
