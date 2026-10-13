'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react'
import { useXlsxExport } from '@/features/reports/hooks/useXlsxExport'
import type { ReportLanguage } from '@/features/reports/types'

/** Nút xuất báo cáo XLSX của dự án: chọn ngôn ngữ, theo dõi job, tải tệp khi xong. */
export function XlsxExportButton({ projectId }: { projectId: number }) {
  const t = useTranslations('reports')
  const locale = useLocale()
  const [language, setLanguage] = useState<ReportLanguage>(locale === 'en' ? 'en' : 'vi')
  const { state, error, errorCode, exportXlsx, downloadXlsx, isDownloading } = useXlsxExport(projectId)
  const running = state === 'running'

  return (
    <div className="flex flex-col gap-2 sm:items-end">
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor={`xlsx-lang-${projectId}`}>{t('language')}</label>
        <select
          id={`xlsx-lang-${projectId}`}
          value={language}
          onChange={(event) => setLanguage(event.target.value as ReportLanguage)}
          disabled={running}
          className="h-9 rounded-md border bg-background px-2 text-sm"
        >
          <option value="vi">{t('languages.vi')}</option>
          <option value="en">{t('languages.en')}</option>
        </select>
        <button
          type="button"
          onClick={() => exportXlsx(language)}
          disabled={running}
          className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-muted disabled:opacity-60"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
          {running ? t('generating') : t('export')}
        </button>
        {state === 'ready' && (
          <button
            type="button"
            onClick={downloadXlsx}
            disabled={isDownloading}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {t('download')}
          </button>
        )}
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {errorCode ? t(`errors.${errorCode}`) : t('errors.unknown')}
        </p>
      ) : null}
    </div>
  )
}
