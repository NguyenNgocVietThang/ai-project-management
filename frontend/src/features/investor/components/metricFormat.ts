import { chartColors } from '@/components/charts/chartTheme'
import type { HealthKey } from '../types/investor.types'

/** Màu theo ngưỡng health; khớp ngưỡng 0.95 / 0.85 ở backend app/services/evm.py. */
export const HEALTH_COLORS: Record<HealthKey, string> = {
  on_track: chartColors.success,
  at_risk: chartColors.warning,
  off_track: chartColors.destructive,
  unknown: chartColors.muted,
}

export const HEALTH_TEXT_CLASS: Record<HealthKey, string> = {
  on_track: 'text-success',
  at_risk: 'text-warning',
  off_track: 'text-destructive',
  unknown: 'text-muted-foreground',
}

/** Tỷ số như CPI/SPI, 2 chữ số thập phân theo locale. */
export function formatRatio(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

/** ROI dạng tỷ lệ (0.5) hiển thị thành phần trăm (50%). */
export function formatPercent(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(value)
}
