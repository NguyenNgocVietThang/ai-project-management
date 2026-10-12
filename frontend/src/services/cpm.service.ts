// Service đọc phân tích đường găng (chỉ đọc) của một dự án.
import { api } from '@/services/api'
import { getApiErrorMessage } from '@/types/api.types'
import type { CPMError, CPMErrorKind, CPMResponse } from '@/types/cpm.types'

/** Mã lỗi backend trả khi dự án vượt CPM_MAX_TASKS / CPM_MAX_DEPENDENCIES. */
export const CPM_RESOURCE_LIMIT_CODE = 'resource_limit_exceeded'

export const cpmService = {
  async get(projectId: number, signal?: AbortSignal): Promise<CPMResponse> {
    const { data } = await api.get<CPMResponse>(`/projects/${projectId}/cpm`, { signal })
    return data
  },
}

/** Chuyển lỗi Axios thành lỗi có phân loại để giao diện chọn thông điệp. */
export function classifyCPMError(error: unknown): CPMError {
  const response = (error as { response?: { status?: number; data?: { detail?: unknown } } } | null)?.response
  const status = response?.status ?? null
  const detail = response?.data?.detail
  let kind: CPMErrorKind = 'unknown'
  if (!response) kind = 'network'
  else if (status === 409) kind = 'cycle'
  else if (detail === CPM_RESOURCE_LIMIT_CODE) kind = 'resource_limit'
  else if (status === 401 || status === 403) kind = 'forbidden'
  else if (status === 404) kind = 'not_found'
  return { kind, status, message: getApiErrorMessage(error) }
}
