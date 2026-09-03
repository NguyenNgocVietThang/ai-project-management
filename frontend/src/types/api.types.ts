/** Cấu trúc của các response lỗi từ FastAPI (HTTPException + RequestValidationError). */

export interface ApiFieldError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface ApiErrorBody {
  detail?: string | ApiFieldError[]
}

/**
 * Trích xuất một thông điệp dễ đọc từ lỗi Axios khi gọi tới FastAPI backend của chúng ta.
 */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: ApiErrorBody } }).response
    const detail = response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((d) => d.msg).join(', ')
    }
    // Lỗi Axios không có `response` nghĩa là request chưa bao giờ tới được server
    // (server sập, CORS, offline) chứ không phải là login bị từ chối.
    if (!response) {
      return 'Unable to reach the server. Please check your connection and try again.'
    }
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
