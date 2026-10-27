'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import type { ProjectMethodology } from '@/types/project.types'
import { durableJobKeys } from '@/features/jobs/hooks/useJobs'
import { requirementBriefService } from '@/features/ai/services/requirementBrief.service'
import type {
  BriefItemKey,
  ItemUpdate,
  RequirementBriefDetail,
} from '@/features/ai/types/requirementBrief.types'

export const briefKeys = {
  all: ['requirement-briefs'] as const,
  list: (ownerId?: number | null, sessionId?: number) => ['requirement-briefs', 'list', ownerId, sessionId] as const,
  detail: (id: number, ownerId?: number | null, sessionId?: number) => ['requirement-briefs', 'detail', id, ownerId, sessionId] as const,
}

// Khóa localStorage lưu hồ sơ đang làm để tải lại trang vẫn khôi phục được.
const ACTIVE_BRIEF_KEY = 'ai.requirementBrief.activeId'
const ACTIVE_GEN_JOB_KEY = 'ai.requirementBrief.generationJobId'

function storageKey(key: string, ownerId: number | null) {
  return ownerId === null ? null : `${key}.owner:${ownerId}`
}

function currentOwner() {
  const auth = useAuthStore.getState()
  return auth.hasHydrated && auth.accessToken ? auth.user?.id ?? null : null
}

function readStorage(key: string | null): string | null {
  try {
    return key === null ? null : window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string | null, value: string | null) {
  if (key === null) return
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {
    // Trình duyệt chặn storage: bỏ qua, chỉ mất khả năng khôi phục.
  }
}

export function loadActiveBriefId(ownerId = currentOwner()): number | null {
  const raw = readStorage(storageKey(ACTIVE_BRIEF_KEY, ownerId))
  const id = raw ? Number(raw) : NaN
  return Number.isInteger(id) && id > 0 ? id : null
}

export function saveActiveBriefId(id: number | null, ownerId = currentOwner()) {
  writeStorage(storageKey(ACTIVE_BRIEF_KEY, ownerId), id === null ? null : String(id))
}

export function loadGenerationJobId(ownerId = currentOwner()): string | null {
  return readStorage(storageKey(ACTIVE_GEN_JOB_KEY, ownerId))
}

export function saveGenerationJobId(id: string | null, ownerId = currentOwner()) {
  writeStorage(storageKey(ACTIVE_GEN_JOB_KEY, ownerId), id)
}

/** Lượt hỏi còn đang chạy (chưa thành công, chưa thất bại). */
export function isTurnRunning(brief?: RequirementBriefDetail): boolean {
  const status = brief?.pending_turn?.status
  return status !== undefined && status !== 'failed' && status !== 'succeeded'
}

export function isTurnFailed(brief?: RequirementBriefDetail): boolean {
  return brief?.pending_turn?.status === 'failed'
}

function useBriefOwner() {
  const ownerId = useAuthStore(state => state.user?.id ?? null)
  const sessionId = useAuthStore(state => state.sessionId)
  const authenticated = useAuthStore(state => state.hasHydrated && Boolean(state.accessToken))
  return { ownerId, sessionId, enabled: authenticated && ownerId !== null }
}

export function useRequirementBrief(id: number | null) {
  const { ownerId, sessionId, enabled } = useBriefOwner()
  return useQuery({
    queryKey: briefKeys.detail(id ?? 0, ownerId, sessionId),
    queryFn: ({ signal }) => requirementBriefService.get(id!, signal),
    enabled: enabled && id !== null,
    retry: false,
    // Khi lượt AI đang chạy thì đọc lại hồ sơ định kỳ; pending_turn phản ánh trạng thái job.
    refetchInterval: (query) => (isTurnRunning(query.state.data) ? 3000 : false),
  })
}

export function useRecentBriefs(requested: boolean) {
  const { ownerId, sessionId, enabled } = useBriefOwner()
  return useQuery({
    queryKey: briefKeys.list(ownerId, sessionId),
    queryFn: ({ signal }) => requirementBriefService.list(5, signal),
    enabled: requested && enabled,
    retry: false,
  })
}

/** Gom các thao tác thay đổi hồ sơ; kết quả trả về ghi thẳng vào cache chi tiết. */
export function useBriefActions() {
  const client = useQueryClient()
  const { ownerId, sessionId } = useBriefOwner()
  const store = (brief: RequirementBriefDetail) => {
    const current = useAuthStore.getState()
    if (current.user?.id !== ownerId || current.sessionId !== sessionId || !current.accessToken) return
    client.setQueryData(briefKeys.detail(brief.id, ownerId, sessionId), brief)
    void client.invalidateQueries({ queryKey: briefKeys.list(ownerId, sessionId) })
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
      mutationFn: async ({ id, mode, methodology }: { id: number; mode: 'skip' | 'finalize' | 'ready'; methodology: ProjectMethodology }) => {
        // Hồ sơ đã ở trạng thái ready (ví dụ tải lại trang sau khi chốt) thì sinh luôn.
        if (mode !== 'ready') {
          const brief = mode === 'skip' ? await requirementBriefService.skip(id) : await requirementBriefService.finalize(id)
          store(brief)
        }
        const current = useAuthStore.getState()
        if (current.user?.id !== ownerId || current.sessionId !== sessionId || !current.accessToken) {
          throw new Error('Brief session is no longer active')
        }
        return requirementBriefService.generateProject(id, methodology)
      },
      onSuccess: () => { void client.invalidateQueries({ queryKey: durableJobKeys.all }) },
    }),
  }
}
