'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { saveBlob } from '@/features/documents/documents'
import { useCancelPausedJobQuery, useJobPollingOptions } from '@/features/jobs/hooks/jobPolling'
import { durableJobKeys } from '@/features/jobs/hooks/useJobs'
import { reportService, readStoredJobId, writeStoredJobId } from '@/features/reports/reports'
import { KNOWN_REPORT_ERRORS, type ReportErrorCode, type ReportLanguage, type XlsxReportResult } from '@/features/reports/types'
import { jobsService } from '@/services/jobs.service'

export type XlsxExportState = 'idle' | 'running' | 'ready' | 'failed'

/** Chuyển lỗi API hoặc error_code của job thành mã lỗi đã dịch được. */
export function reportErrorCode(error: unknown): ReportErrorCode | null {
  if (!error) return null
  if (typeof error === 'string') return (KNOWN_REPORT_ERRORS as readonly string[]).includes(error) ? (error as ReportErrorCode) : null
  const response = (error as { response?: { status?: number; data?: { detail?: unknown } } }).response
  const detail = response?.data?.detail
  if (typeof detail === 'string' && (KNOWN_REPORT_ERRORS as readonly string[]).includes(detail)) return detail as ReportErrorCode
  // Phản hồi dạng blob không đọc được detail: suy ra theo mã HTTP.
  if (response?.status === 403) return 'forbidden'
  if (response?.status === 404) return 'not_found'
  if (response?.status === 409) return 'report_not_ready'
  if (response?.status === 503) return 'storage_unavailable'
  return null
}

/** Xuất XLSX: tạo job, theo dõi qua /jobs/{id}, tải blob khi xong; nhớ job gần nhất theo dự án. */
export function useXlsxExport(projectId: number) {
  const client = useQueryClient()
  const [jobId, setJobId] = useState<number | null>(null)
  // Khôi phục sau khi mount để tránh lệch giữa server và client.
  useEffect(() => { setJobId(readStoredJobId(projectId)) }, [projectId])

  const { ownerId, ...options } = useJobPollingOptions(jobId !== null)
  const queryKey = ['report-xlsx-job', jobId, ownerId] as const
  useCancelPausedJobQuery(queryKey, options.enabled)
  const job = useQuery({ ...options, queryKey, queryFn: ({ signal }) => jobsService.get(jobId!, signal) })

  const start = useMutation({
    mutationFn: (language: ReportLanguage) => reportService.requestXlsx(projectId, language),
    onSuccess: (data) => {
      writeStoredJobId(projectId, data.job_id)
      setJobId(data.job_id)
      // JobsPanel nhận job mới.
      void client.invalidateQueries({ queryKey: durableJobKeys.all })
    },
  })

  const download = useMutation({
    mutationFn: async () => {
      if (jobId === null) return
      const blob = await reportService.downloadXlsx(projectId, jobId)
      const result = job.data?.result as Partial<XlsxReportResult> | null | undefined
      saveBlob(blob, result?.filename || `project-${projectId}-report.xlsx`)
    },
  })

  const status = job.data?.status
  let state: XlsxExportState = 'idle'
  if (start.isPending || status === 'queued' || status === 'running' || (jobId !== null && job.isLoading)) state = 'running'
  else if (status === 'succeeded') state = 'ready'
  else if (status === 'failed') state = 'failed'

  const error = start.error ?? download.error ?? (status === 'failed' ? job.data?.error_code ?? 'unknown' : null)
  return {
    state,
    jobId,
    error,
    errorCode: reportErrorCode(error),
    exportXlsx: (language: ReportLanguage) => start.mutate(language),
    downloadXlsx: () => download.mutate(),
    isDownloading: download.isPending,
  }
}
