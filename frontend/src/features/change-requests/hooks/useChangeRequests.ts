'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { changeRequestService, type ChangeRequestCreateInput } from '@/services/change-request.service'
import type {
  ImpactAnalysisJobResponse,
  ImpactAnalysisJobResult,
} from '@/types/change-request.types'

import { useJobPollingOptions, useCancelPausedJobQuery } from '@/features/jobs/hooks/jobPolling'
import { durableJobKeys } from '@/features/jobs/hooks/useJobs'

export const changeRequestKeys = {
  all: ['change-requests'] as const,
  lists: () => [...changeRequestKeys.all, 'list'] as const,
  list: (projectId: number) => [...changeRequestKeys.lists(), projectId] as const,
  detail: (id: number) => [...changeRequestKeys.all, 'detail', id] as const,
  jobs: () => [...changeRequestKeys.all, 'impact-analysis-job'] as const,
  job: (jobId: string) => [...changeRequestKeys.jobs(), jobId] as const,
}

export function useChangeRequests(projectId: number) {
  return useQuery({
    queryKey: changeRequestKeys.list(projectId),
    queryFn: () => changeRequestService.list(projectId),
    enabled: Number.isFinite(projectId),
  })
}

export function useChangeRequest(id: number | null) {
  return useQuery({
    queryKey: changeRequestKeys.detail(id ?? 0),
    queryFn: () => changeRequestService.get(id as number),
    enabled: id !== null && Number.isFinite(id),
  })
}

export function useCreateChangeRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, body }: { projectId: number; body: ChangeRequestCreateInput }) =>
      changeRequestService.create(projectId, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: changeRequestKeys.list(variables.projectId) })
    },
  })
}

export function useSubmitChangeRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => changeRequestService.submit(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: changeRequestKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: changeRequestKeys.list(data.project_id) })
      // Submit tạo chuỗi duyệt mới, cần tải lại dòng thời gian duyệt.
      queryClient.invalidateQueries({ queryKey: [...changeRequestKeys.all, 'approvals', data.id] })
    },
  })
}

/**
 * Kích hoạt SOP-AI-002 cho một change request. Gọi thẳng `/ai/impact-analysis`
 * qua `api` thay vì qua `ai.service.ts` — file đó do phiên điều phối
 * (orchestrator) chỉnh sửa song song ở một worktree khác, đụng vào sẽ gây
 * xung đột merge.
 */
export function useRunImpactAnalysis() {
  const client = useQueryClient()
  return useMutation({
    onSuccess: () => { void client.invalidateQueries({ queryKey: durableJobKeys.all }) },
    mutationFn: async (changeRequestId: number) => {
      const { data } = await api.post<ImpactAnalysisJobResponse>('/ai/impact-analysis', {
        change_request_id: changeRequestId,
      })
      return data
    },
  })
}

/** Bản poll cục bộ của useAIJob (xem features/ai/hooks/useAIGenerator.ts) — nhân
 * bản thay vì import để feature này không phụ thuộc file ai chung. */
export function useImpactAnalysisJob(jobId: string | null) {
  const { ownerId, ...options } = useJobPollingOptions(jobId !== null)
  const queryKey = [...changeRequestKeys.job(jobId ?? ''), ownerId]
  useCancelPausedJobQuery(queryKey, options.enabled)
  return useQuery({
    ...options,
    queryKey,
    queryFn: async ({ signal }) => {
      const { data } = await api.get<ImpactAnalysisJobResult>(`/ai/jobs/${jobId}`, { signal })
      return data
    },
  })
}
