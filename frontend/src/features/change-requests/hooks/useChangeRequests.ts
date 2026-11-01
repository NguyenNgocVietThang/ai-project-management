'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { changeRequestService, type ChangeRequestCreateInput } from '@/services/change-request.service'
import type {
  ImpactAnalysisJobResponse,
  ImpactAnalysisJobResult,
  ImpactLevel,
  ManualImpactReportInput,
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
  impactReport: (id: number) => [...changeRequestKeys.all, 'impact-report', id] as const,
  approvals: (id: number) => [...changeRequestKeys.all, 'approvals', id] as const,
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
      queryClient.invalidateQueries({ queryKey: changeRequestKeys.approvals(data.id) })
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

/** Báo cáo tác động đã lưu của CR (null khi chưa có) — không mất khi tải lại trang. */
export function useImpactReport(id: number | null) {
  return useQuery({
    queryKey: changeRequestKeys.impactReport(id ?? 0),
    queryFn: () => changeRequestService.getImpactReport(id as number),
    enabled: id !== null && Number.isFinite(id),
  })
}

/** Làm mới mọi dữ liệu phụ thuộc mức tác động / báo cáo của một CR. */
function invalidateImpactData(client: ReturnType<typeof useQueryClient>, id: number, projectId?: number) {
  void client.invalidateQueries({ queryKey: changeRequestKeys.detail(id) })
  void client.invalidateQueries({ queryKey: changeRequestKeys.impactReport(id) })
  void client.invalidateQueries({ queryKey: changeRequestKeys.approvals(id) })
  void client.invalidateQueries({
    queryKey: projectId === undefined ? changeRequestKeys.lists() : changeRequestKeys.list(projectId),
  })
}

/** PM chốt hoặc đổi mức tác động. */
export function useSetImpactLevel(id: number) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ level, reason }: { level: ImpactLevel; reason: string | null }) =>
      changeRequestService.setImpactLevel(id, level, reason),
    onSuccess: (data) => {
      client.setQueryData(changeRequestKeys.detail(id), data)
      invalidateImpactData(client, id, data.project_id)
    },
  })
}

/** PM nhập đánh giá tác động thủ công khi chưa có báo cáo AI. */
export function useSetManualImpactReport(id: number) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: ManualImpactReportInput) => changeRequestService.setManualImpactReport(id, body),
    onSuccess: (report) => {
      client.setQueryData(changeRequestKeys.impactReport(id), report)
      invalidateImpactData(client, id)
    },
  })
}

/** Gọi khi job phân tích tác động hoàn tất: tải lại báo cáo đã lưu và chuỗi duyệt (revision mới). */
export function useRefreshImpactData(id: number) {
  const client = useQueryClient()
  return () => invalidateImpactData(client, id)
}
