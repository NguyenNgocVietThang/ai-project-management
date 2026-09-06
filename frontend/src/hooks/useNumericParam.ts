'use client'

import { notFound, useParams } from 'next/navigation'

/**
 * ID số lấy từ route, hoặc trang 404 nếu nó không phải là số.
 *
 * `Number(useParams().id)` trên `/projects/abc` cho `NaN`, thứ rồi lặng lẽ chảy
 * vào query key và URL của API. Kết quả là một request hỏng và một trang lỗi
 * chung chung, thay vì thứ đúng đắn: một trang 404.
 */
export function useNumericParam(name = 'id'): number {
  const raw = useParams<Record<string, string>>()[name]
  const value = Number(raw)
  if (!Number.isInteger(value) || value <= 0) notFound()
  return value
}
