/** SOP-AI-004 / SOP-RM-001: kieu du lieu cho tinh nang goi y nhan su cho mot Task.
 * Day chi la advisory (tham khao) - khong co kieu nao o day tao Assignment that. */

export type ResourceRecommendationJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

/** Chi so tho, xac dinh (khong-AI) cua mot ung vien - tinh boi server tu
 * skills/Assignment/Worklog/hourly_rate/leaves. */
export interface ResourceCandidate {
  user_id: number
  full_name: string
  skills: string[]
  hourly_rate: number | null
  current_workload_hours: number
  on_leave: boolean
}

/** Phan xep hang do AI sinh ra cho mot ung vien cu the. */
export interface ResourceRecommendationItem {
  user_id: number
  rank: number
  reason: string
  fit_score: number
}

/** Hinh dang hien thi da gop: chi so tho cua ung vien + phan xep hang cua AI. */
export type ResourceRecommendationDisplayItem = ResourceCandidate & ResourceRecommendationItem

export interface ResourceRecommendationResult {
  summary: string
  recommendations: ResourceRecommendationDisplayItem[]
}
