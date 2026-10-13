'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { approvalService, type ApprovalChain } from '@/features/change-requests/approvals'
import { changeRequestKeys } from '@/features/change-requests/hooks/useChangeRequests'

export const approvalKeys = {
  chain: (crId: number) => [...changeRequestKeys.all, 'approvals', crId] as const,
}

export function useApprovalChain(crId: number) {
  return useQuery({
    queryKey: approvalKeys.chain(crId),
    queryFn: () => approvalService.get(crId),
    enabled: Number.isFinite(crId),
  })
}

type Decision =
  | { kind: 'approve'; stepOrder: number; comment: string | null }
  | { kind: 'reject'; stepOrder: number; reason: string }

/** Duyệt/từ chối một bước: ghi ngay response vào cache, rồi làm mới chi tiết và danh sách CR. */
export function useDecideApproval(crId: number) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (d: Decision): Promise<ApprovalChain> =>
      d.kind === 'approve'
        ? approvalService.approve(crId, d.stepOrder, d.comment)
        : approvalService.reject(crId, d.stepOrder, d.reason),
    // Lỗi (ví dụ 409 bước đã được người khác quyết định): tải lại chuỗi duyệt mới nhất.
    onError: () => {
      void client.invalidateQueries({ queryKey: approvalKeys.chain(crId) })
    },
    onSuccess: (chain) => {
      client.setQueryData(approvalKeys.chain(crId), chain)
      void client.invalidateQueries({ queryKey: changeRequestKeys.detail(crId) })
      void client.invalidateQueries({ queryKey: changeRequestKeys.lists() })
    },
  })
}
