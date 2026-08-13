/** Shape of FastAPI error responses (HTTPException + RequestValidationError). */

export interface ApiFieldError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface ApiErrorBody {
  detail?: string | ApiFieldError[]
}

/**
 * Extracts a human-readable message from an Axios error hitting our FastAPI backend.
 */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: ApiErrorBody } }).response
    const detail = response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((d) => d.msg).join(', ')
    }
    // Axios error with no `response` means the request never reached the server
    // (server down, CORS, offline) rather than a rejected login.
    if (!response) {
      return 'Unable to reach the server. Please check your connection and try again.'
    }
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
