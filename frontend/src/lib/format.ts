import { parseISO } from 'date-fns'

export function formatMoney(value: number | null, currency = 'VND', locale = 'en'): string {
  if (value === null) return locale === 'vi' ? 'Chưa đặt' : 'Not set'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(value)
}

export function formatDate(value: string | null | undefined, locale = 'en'): string {
  if (!value) return locale === 'vi' ? 'Chưa đặt' : 'Not set'
  const date = parseISO(value)
  if (Number.isNaN(date.getTime())) return locale === 'vi' ? 'Chưa đặt' : 'Not set'
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

const VI_LABELS: Record<string, string> = {
  PLANNING: 'Lập kế hoạch', ACTIVE: 'Đang hoạt động', ARCHIVED: 'Đã lưu trữ',
  ON_HOLD: 'Tạm dừng', COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy',
  TODO: 'Cần làm', IN_PROGRESS: 'Đang thực hiện', IN_REVIEW: 'Đang xem xét',
  DONE: 'Hoàn thành', BLOCKED: 'Bị chặn', BACKLOG: 'Tồn đọng',
  LOW: 'Thấp', MEDIUM: 'Trung bình', HIGH: 'Cao', CRITICAL: 'Trọng yếu',
  DRAFT: 'Bản nháp', SUBMITTED: 'Đã gửi', APPROVED: 'Đã phê duyệt', REJECTED: 'Đã từ chối',
  PENDING: 'Đang chờ', APPLIED: 'Đã áp dụng', OPEN: 'Chưa bắt đầu', CLOSED: 'Đã đóng',
  UNDER_REVIEW: 'Đang xem xét', IMPLEMENTED: 'Đã triển khai', PLANNED: 'Đã lên kế hoạch',
  AGILE: 'Linh hoạt (Agile)', WATERFALL: 'Thác nước (Waterfall)', HYBRID: 'Kết hợp',
  ADMIN: 'Quản trị viên', MEMBER: 'Thành viên', INVESTOR: 'Nhà đầu tư',
  PM: 'Quản lý dự án', PROJECT_MANAGER: 'Quản lý dự án', PORTFOLIO_MANAGER: 'Quản lý danh mục',
  VIEWER: 'Người xem', OWNER: 'Chủ sở hữu',
  BA: 'Chuyên viên phân tích nghiệp vụ', DEV: 'Lập trình viên', QA: 'Kiểm thử viên',
  PO: 'Chủ sản phẩm', CUSTOMER: 'Khách hàng',
  CREATE: 'Tạo', UPDATE: 'Cập nhật', DELETE: 'Xóa', LOGIN: 'Đăng nhập', LOGOUT: 'Đăng xuất',
}

/** Built-in role names are UI labels; custom role names remain user content. */
export function formatRoleName(value: string, locale = 'en'): string {
  return locale === 'vi' ? VI_LABELS[value.toUpperCase().replace(/ /g, '_')] ?? value : value
}

export function formatStatus(value: string, locale = 'en'): string {
  if (locale === 'vi' && VI_LABELS[value.toUpperCase()]) return VI_LABELS[value.toUpperCase()]
  return value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (character: string) => character.toUpperCase())
}
