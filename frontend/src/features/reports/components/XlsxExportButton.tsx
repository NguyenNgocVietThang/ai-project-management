'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { Download, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Select } from '@/components/ui/Select'
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
      {/* Thanh công cụ: chọn ngôn ngữ + xuất (nút phụ); khi có tệp thì nút tải về là CTA chính. */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor={`xlsx-lang-${projectId}`}>{t('language')}</label>
        <Select
          id={`xlsx-lang-${projectId}`}
          value={language}
          onChange={(event) => setLanguage(event.target.value as ReportLanguage)}
          disabled={running}
          wrapperClassName="w-36"
        >
          <option value="vi">{t('languages.vi')}</option>
          <option value="en">{t('languages.en')}</option>
        </Select>
        <Button type="button" variant="outline" fullWidth={false} onClick={() => exportXlsx(language)} isLoading={running}>
          {!running && <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />}
          {running ? t('generating') : t('export')}
        </Button>
        {state === 'ready' && (
          <Button type="button" fullWidth={false} onClick={downloadXlsx} isLoading={isDownloading} className="animate-scale-in">
            {!isDownloading && <Download className="h-4 w-4" aria-hidden="true" />}
            {t('download')}
          </Button>
        )}
      </div>
      {error ? (
        <p role="alert" className="text-body-sm text-destructive">
          {errorCode ? t(`errors.${errorCode}`) : t('errors.unknown')}
        </p>
      ) : null}
    </div>
  )
}
