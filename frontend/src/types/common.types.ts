/** Phản chiếu backend app/schemas/common.py */

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface MessageResponse {
  message: string
}

export interface IDResponse {
  id: number
}

/** Query param dùng chung cho mọi endpoint danh sách `GET /{resource}`. */
export interface PaginationParams {
  page?: number
  page_size?: number
}
