'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { DiffTarget } from '@/features/versions/types'
import { taskKeys } from '@/features/tasks/hooks/useTasks'
import { versionService } from '@/features/versions/versions'

export const versionKeys = {
  all: ['project-versions'] as const,
  project: (projectId: number) => [...versionKeys.all, projectId] as const,
  list: (projectId: number) => [...versionKeys.all, projectId, 'list'] as const,
  diff: (projectId: number, baseId: number, target: DiffTarget) => [...versionKeys.all, projectId, 'diff', baseId, target] as const,
}

export function useProjectVersions(projectId: number) {
  return useQuery({
    queryKey: versionKeys.list(projectId),
    queryFn: () => versionService.list(projectId),
    enabled: Number.isFinite(projectId),
  })
}

/** Diff chỉ chạy khi đã chọn đủ hai phía và khác nhau. */
export function useVersionDiff(projectId: number, baseId: number | null, target: DiffTarget | null) {
  const ready = Number.isFinite(projectId) && baseId !== null && target !== null && baseId !== target
  return useQuery({
    queryKey: versionKeys.diff(projectId, baseId ?? -1, target ?? 'current'),
    queryFn: () => versionService.diff(projectId, baseId as number, target as DiffTarget),
    enabled: ready,
    // Diff giữa hai phiên bản đã lưu không đổi; so với hiện trạng thì luôn tải mới.
    staleTime: target === 'current' ? 0 : Infinity,
  })
}

export function useCreateBaseline(projectId: number) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: { label: string; description: string | null }) => versionService.createBaseline(projectId, body),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: versionKeys.list(projectId) })
    },
  })
}

/**
 * Khôi phục về phiên bản. Sau khi xong làm mới danh sách/diff phiên bản và mọi truy vấn task
 * của dự án; khóa CPM nằm dưới taskKeys.project nên cũng được làm mới.
 */
export function useRollbackVersion(projectId: number) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (versionId: number) => versionService.rollback(projectId, versionId),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: versionKeys.project(projectId) })
      void client.invalidateQueries({ queryKey: taskKeys.project(projectId) })
    },
  })
}
