'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { durableJobKeys } from '@/features/jobs/hooks/useJobs'
import { requirementBriefService } from '@/features/ai/services/requirementBrief.service'
import type {
  BriefItemKey,
  ItemUpdate,
  RequirementBriefDetail,
} from '@/features/ai/types/requirementBrief.types'

export const briefKeys = {
  all: ['requirement-briefs'] as const,
  list: () => ['requirement-briefs', 'list'] as const,
  detail: (id: number) => ['requirement-briefs', 'detail', id] as const,
}

// Khóa localStorage lưu hồ sơ đang làm để tải lại trang vẫn khôi phục được.
const ACTIVE_BRIEF_KEY = 'ai.requirementBrief.activeId'
const ACTIVE_GEN_JOB_KEY = 'ai.requirementBrief.generationJobId'

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {
    // Trình duyệt chặn storage: bỏ qua, chỉ mất khả năng khôi phục.
  }
}

export function loadActiveBriefId(): number | null {
  const raw = readStorage(ACTIVE_BRIEF_KEY)
  const id = raw ? Number(raw) : NaN
  return Number.isInteger(id) && id > 0 ? id : null
}

export function saveActiveBriefId(id: number | null) {
  writeStorage(ACTIVE_BRIEF_KEY, id === null ? null : String(id))
}

export function loadGenerationJobId(): string | null {
  return readStorage(ACTIVE_GEN_JOB_KEY)
}

export function saveGenerationJobId(id: string | null) {
  writeStorage(ACTIVE_GEN_JOB_KEY, id)
}

/** Lượt hỏi còn đang chạy (chưa thành công, chưa thất bại). */
export function isTurnRunning(brief?: RequirementBriefDetail): boolean {
  const status = brief?.pending_turn?.status
  return status !== undefined && status !== 'failed' && status !== 'succeeded'
}

export function isTurnFailed(brief?: RequirementBriefDetail): boolean {
  return brief?.pending_turn?.status === 'failed'
}

export function useRequirementBrief(id: number | null) {
  return useQuery({
    queryKey: briefKeys.detail(id ?? 0),
    queryFn: ({ signal }) => requirementBriefService.get(id!, signal),
    enabled: id !== null,
    retry: false,
    // Khi lượt AI đang chạy thì đọc lại hồ sơ định kỳ; pending_turn phản ánh trạng thái job.
    refetchInterval: (query) => (isTurnRunning(query.state.data) ? 3000 : false),
  })
}

export function useRecentBriefs(enabled: boolean) {
  return useQuery({
    queryKey: briefKeys.list(),
    queryFn: ({ signal }) => requirementBriefService.list(5, signal),
    enabled,
    retry: false,
  })
}

/** Gom các thao tác thay đổi hồ sơ; kết quả trả về ghi thẳng vào cache chi tiết. */
export function useBriefActions() {
  const client = useQueryClient()
  const store = (brief: RequirementBriefDetail) => {
    client.setQueryData(briefKeys.detail(brief.id), brief)
    void client.invalidateQueries({ queryKey: briefKeys.list() })
  }
  const onTurn = { onSuccess: (r: { brief: RequirementBriefDetail }) => {
    store(r.brief)
    void client.invalidateQueries({ queryKey: durableJobKeys.all })
  } }

  return {
    create: useMutation({ mutationFn: (idea: string) => requirementBriefService.create(idea), ...onTurn }),
    answer: useMutation({
      mutationFn: ({ id, answer }: { id: number; answer: string | null }) => requirementBriefService.answer(id, answer),
      ...onTurn,
    }),
    accept: useMutation({
      mutationFn: ({ id, key, value }: { id: number; key: BriefItemKey; value?: string }) =>
        requirementBriefService.acceptAssumption(id, key, value),
      onSuccess: store,
    }),
    reject: useMutation({
      mutationFn: ({ id, key }: { id: number; key: BriefItemKey }) => requirementBriefService.rejectAssumption(id, key),
      onSuccess: store,
    }),
    patch: useMutation({
      mutationFn: ({ id, key, update }: { id: number; key: BriefItemKey; update: ItemUpdate }) =>
        requirementBriefService.patchItem(id, key, update),
      onSuccess: store,
    }),
    // "Bỏ qua, tạo luôn" hoặc "Tạo dự án": chốt hồ sơ rồi xếp job sinh dự án.
    generate: useMutation({
      mutationFn: async ({ id, mode }: { id: number; mode: 'skip' | 'finalize' | 'ready' }) => {
        // Hồ sơ đã ở trạng thái ready (ví dụ tải lại trang sau khi chốt) thì sinh luôn.
        if (mode !== 'ready') {
          const brief = mode === 'skip' ? await requirementBriefService.skip(id) : await requirementBriefService.finalize(id)
          store(brief)
        }
        return requirementBriefService.generateProject(id)
      },
      onSuccess: () => { void client.invalidateQueries({ queryKey: durableJobKeys.all }) },
    }),
  }
}
