// Kiểu dữ liệu API tài liệu SRS/BRD do AI sinh (D3).
export type DocumentType = 'SRS' | 'BRD'
export type DocumentLanguage = 'vi' | 'en'
export type DocumentStatus = 'queued' | 'generating' | 'needs_clarification' | 'ready' | 'failed'

export interface GeneratedDocument {
  id: number
  project_id: number
  brief_id: number | null
  doc_type: DocumentType
  language: DocumentLanguage
  version: number
  status: DocumentStatus
  progress: { completed_groups: number; total_groups: number }
  // Key mục hồ sơ còn thiếu, hoặc "no_brief" khi dự án chưa có hồ sơ.
  missing_items: string[]
  warnings: string[]
  error_code: string | null
  file_size: number | null
  job_id: number | null
  job_status: string | null
  created_by_id: number | null
  created_at: string
  completed_at: string | null
}

export interface GenerateDocumentResponse {
  document: GeneratedDocument
  job_id: number | null
}

export const ACTIVE_DOCUMENT_STATUSES: readonly DocumentStatus[] = ['queued', 'generating']
