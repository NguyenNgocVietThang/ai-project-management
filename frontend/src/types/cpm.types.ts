// Kiểu dữ liệu cho phân tích đường găng, khớp với backend/app/schemas/cpm.py.

export interface CPMTask {
  id: number
  name: string
  status: string
  duration_days: number
  /** Ngày ISO (YYYY-MM-DD) hoặc null khi chưa tính được lịch. */
  early_start: string | null
  early_finish: string | null
  late_start: string | null
  late_finish: string | null
  float_days: number
  is_critical: boolean
  predecessor_ids: number[]
}

export interface CPMResponse {
  project_id: number
  /** Tổng thời gian dự án tính bằng ngày lịch kể từ `anchor_date`. */
  project_duration_days: number
  /** Ngày neo của mọi offset; null khi dự án chưa có task. */
  anchor_date: string | null
  critical_path: number[]
  tasks: CPMTask[]
}

/**
 * Phân loại lỗi khi đọc CPM để giao diện hiển thị hướng dẫn phù hợp:
 * - `cycle`: 409, đồ thị phụ thuộc có vòng nên không tính được đường găng.
 * - `resource_limit`: 422 `resource_limit_exceeded`, dự án vượt giới hạn task/dependency.
 * - `forbidden` / `not_found`: không có quyền hoặc dự án không tồn tại.
 * - `network`: request không tới được server.
 * - `unknown`: mọi lỗi còn lại.
 */
export type CPMErrorKind = 'cycle' | 'resource_limit' | 'forbidden' | 'not_found' | 'network' | 'unknown'

export interface CPMError {
  kind: CPMErrorKind
  status: number | null
  /** Thông điệp gốc từ server (nếu có), chỉ để ghi log/hiển thị phụ. */
  message: string
}
