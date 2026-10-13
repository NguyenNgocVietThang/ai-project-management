export type ReportLanguage = 'vi' | 'en'

export interface XlsxExportResponse {
  job_id: number
  status: 'queued' | 'running'
}

/** Kết quả job `report.xlsx` khi thành công. */
export interface XlsxReportResult {
  storage_key: string
  file_size: number
  filename: string
  language: ReportLanguage
}

/** Mã lỗi đã có bản dịch trong namespace `reports.errors`. */
export const KNOWN_REPORT_ERRORS = [
  'storage_error', 'project_unavailable', 'resource_limit_exceeded', 'invalid_payload',
  'report_not_ready', 'report_failed', 'storage_unavailable', 'forbidden', 'not_found',
] as const
export type ReportErrorCode = (typeof KNOWN_REPORT_ERRORS)[number]
