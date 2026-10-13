import { api } from '@/services/api'
import type { ReportLanguage, XlsxExportResponse } from '@/features/reports/types'

export const reportService = {
  async requestXlsx(projectId: number, language: ReportLanguage): Promise<XlsxExportResponse> {
    const { data } = await api.post<XlsxExportResponse>(`/projects/${projectId}/reports/xlsx`, { language })
    return data
  },
  /** Tải tệp XLSX qua client có xác thực, trả về blob. */
  async downloadXlsx(projectId: number, jobId: number): Promise<Blob> {
    const { data } = await api.get<Blob>(`/projects/${projectId}/reports/xlsx/${jobId}/download`, { responseType: 'blob' })
    return data
  },
}

const storageKey = (projectId: number) => `xlsx-export-job:${projectId}`

/** Đọc job id gần nhất của dự án; trả null nếu không có hoặc localStorage không dùng được. */
export function readStoredJobId(projectId: number): number | null {
  try {
    const raw = window.localStorage.getItem(storageKey(projectId))
    const value = raw === null ? NaN : Number(raw)
    return Number.isInteger(value) && value > 0 ? value : null
  } catch {
    return null
  }
}

export function writeStoredJobId(projectId: number, jobId: number) {
  try {
    window.localStorage.setItem(storageKey(projectId), String(jobId))
  } catch {
    // Bỏ qua: chỉ mất khả năng khôi phục sau khi tải lại trang.
  }
}
