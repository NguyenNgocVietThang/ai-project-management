import { api } from '@/services/api'
import type { DocumentLanguage, DocumentType, GenerateDocumentResponse, GeneratedDocument } from '@/features/documents/types'

export const documentService = {
  async list(projectId: number): Promise<GeneratedDocument[]> {
    const { data } = await api.get<GeneratedDocument[]>(`/projects/${projectId}/documents`)
    return data
  },
  async generate(projectId: number, body: { doc_type: DocumentType; language: DocumentLanguage }): Promise<GenerateDocumentResponse> {
    const { data } = await api.post<GenerateDocumentResponse>(`/projects/${projectId}/documents`, body)
    return data
  },
  /** Tải tệp qua client có xác thực (proxy kiểm tra quyền dự án), trả blob. */
  async download(projectId: number, documentId: number): Promise<Blob> {
    const { data } = await api.get<Blob>(`/projects/${projectId}/documents/${documentId}/download`, { responseType: 'blob' })
    return data
  },
}

/** Lưu blob thành tệp trên trình duyệt bằng thẻ <a download> tạm thời. */
export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Thu hồi URL sau khi trình duyệt đã bắt đầu tải.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function documentFilename(doc: Pick<GeneratedDocument, 'doc_type' | 'version' | 'language'>) {
  return `${doc.doc_type}-v${doc.version}-${doc.language}.docx`
}
