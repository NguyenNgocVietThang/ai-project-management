'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { durableJobKeys } from '@/features/jobs/hooks/useJobs'
import { documentFilename, documentService, saveBlob } from '@/features/documents/documents'
import { ACTIVE_DOCUMENT_STATUSES, type DocumentLanguage, type DocumentType, type GeneratedDocument } from '@/features/documents/types'

export const documentKeys = {
  all: ['generated-documents'] as const,
  list: (projectId: number) => ['generated-documents', projectId, 'list'] as const,
}

export function hasActiveDocument(list?: GeneratedDocument[]) {
  return Boolean(list?.some(doc => ACTIVE_DOCUMENT_STATUSES.includes(doc.status)))
}

/** Danh sách tài liệu; tự poll khi còn tài liệu đang sinh. Dữ liệu từ API nên tải lại trang vẫn khôi phục. */
export function useProjectDocuments(projectId: number) {
  return useQuery({
    queryKey: documentKeys.list(projectId),
    queryFn: () => documentService.list(projectId),
    enabled: Number.isFinite(projectId),
    refetchInterval: (query) => (hasActiveDocument(query.state.data) ? 5000 : false),
  })
}

export function useGenerateDocument(projectId: number) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: { doc_type: DocumentType; language: DocumentLanguage }) => documentService.generate(projectId, body),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: documentKeys.list(projectId) })
      // JobsPanel nhận job mới.
      void client.invalidateQueries({ queryKey: durableJobKeys.all })
    },
  })
}

export function useDownloadDocument(projectId: number) {
  return useMutation({
    mutationFn: async (doc: GeneratedDocument) => {
      const blob = await documentService.download(projectId, doc.id)
      saveBlob(blob, documentFilename(doc))
    },
  })
}
