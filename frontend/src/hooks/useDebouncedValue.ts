'use client'

import { useEffect, useState } from 'react'

/**
 * Trả về `value` sau khi nó đã ngừng thay đổi trong `delay` mili-giây.
 *
 * Các ô tìm kiếm đưa thẳng giá trị đang gõ vào query key của TanStack Query, nên
 * mỗi ký tự tạo ra một khoá mới và một request mới. Gõ "nguyen" là sáu request,
 * trong đó năm cái vô dụng ngay khi vừa bay đi.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
