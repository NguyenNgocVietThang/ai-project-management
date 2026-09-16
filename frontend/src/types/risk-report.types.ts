/** Kiểu dữ liệu cho SOP-AI-005 (Phân tích rủi ro bằng AI). Khớp với
 * `backend/app/schemas/risk_report.py::RiskReportResponse`. */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface RiskFactor {
  factor: string
  severity: RiskLevel
  explanation: string
}

export interface RiskReport {
  id: number
  project_id: number
  risk_score: number
  risk_level: RiskLevel
  // Backend cho phép AI trả list hoặc dict tuỳ model, nhưng bình thường là list
  // các RiskFactor / list chuỗi gợi ý — giữ union rộng để không vỡ khi model lệch shape.
  risk_factors_json: RiskFactor[] | Record<string, unknown> | null
  mitigation_suggestions_json: string[] | Record<string, unknown> | null
  summary: string | null
  created_at: string
}

/** Màu badge theo mức rủi ro — dùng Tailwind class, LOW=xanh lá, MEDIUM=vàng/hổ
 * phách, HIGH=cam, CRITICAL=đỏ. */
export const RISK_LEVEL_COLOR: Record<RiskLevel, string> = {
  LOW: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-300',
  MEDIUM: 'bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-300',
  HIGH: 'bg-orange-500/10 text-orange-700 border-orange-500/30 dark:text-orange-300',
  CRITICAL: 'bg-red-500/10 text-red-700 border-red-500/30 dark:text-red-300',
}

/** risk_factors_json / mitigation_suggestions_json chỉ thật sự hữu dụng khi là
 * list — hàm gác cổng nhỏ này cho component tránh phải lặp lại kiểm tra kiểu.
 * Nhận `unknown` (không riêng kiểu field trong RiskReport) để dùng lại được cả
 * cho `result` chung chung của job AI, vốn chưa được gõ kiểu cụ thể. */
export function asRiskFactorList(value: unknown): RiskFactor[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (item): item is RiskFactor =>
      typeof item === 'object' && item !== null && typeof (item as RiskFactor).factor === 'string'
  )
}

export function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}
