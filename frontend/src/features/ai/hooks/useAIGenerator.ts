'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { aiService } from '@/services/ai.service'
import type { AIJobStatus } from '@/types/ai.types'

const IN_PROGRESS: AIJobStatus[] = ['PENDING', 'PROCESSING']

export const aiJobKeys = {
  job: (jobId: string) => ['ai', 'jobs', jobId] as const,
}

export function useGenerateProject() {
  return useMutation({ mutationFn: (prompt: string) => aiService.generateProject(prompt) })
}

export function useAIJob(jobId: string | null) {
  return useQuery({
    queryKey: aiJobKeys.job(jobId ?? ''),
    queryFn: () => aiService.getJob(jobId!),
    enabled: jobId !== null,
    // Job AI chạy vài giây tới vài chục giây trong Celery — poll thay vì bắt
    // người dùng tự bấm refresh, nhưng dừng ngay khi có kết quả cuối cùng.
    refetchInterval: (query) => (query.state.status === 'error' ? false : !query.state.data || IN_PROGRESS.includes(query.state.data.status) ? 2_000 : false),
  })
}
