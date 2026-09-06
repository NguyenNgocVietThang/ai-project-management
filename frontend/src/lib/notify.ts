'use client'

import { toast } from 'sonner'
import { getApiErrorMessage } from '@/types/api.types'

/**
 * Phản hồi cho người dùng về kết quả của một hành động.
 *
 * Trước đây không có gì cả: các mutation chỉ rollback optimistic update trong
 * `onError` rồi im lặng. Kéo một thẻ Kanban sang cột mới mà server từ chối thì
 * thẻ lặng lẽ nhảy về chỗ cũ, không một lời giải thích — người dùng chỉ thấy giao
 * diện tự ý đảo ngược thao tác của họ.
 */
export function notifyError(error: unknown, fallback?: string): void {
  toast.error(getApiErrorMessage(error, fallback))
}

export function notifySuccess(message: string): void {
  toast.success(message)
}
