'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Số đếm tăng dần từ 0 tới `value` trong `duration` ms (easing out-cubic).
 * Dùng requestAnimationFrame nên không chặn luồng chính; tôn trọng
 * prefers-reduced-motion bằng cách hiện ngay giá trị cuối. Khi `value` đổi do
 * refetch, số chạy tiếp từ giá trị đang hiển thị chứ không quay về 0.
 */
export function CountUp({ value, duration = 600, format }: { value: number; duration?: number; format?: (n: number) => string }) {
  const [display, setDisplay] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || duration <= 0) {
      setDisplay(value)
      fromRef.current = value
      return
    }
    const from = fromRef.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = from + (value - from) * eased
      setDisplay(current)
      if (t < 1) frame = requestAnimationFrame(tick)
      else fromRef.current = value
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      fromRef.current = value
    }
  }, [value, duration])

  const rounded = Number.isInteger(value) ? Math.round(display) : Math.round(display * 10) / 10
  return <span className="tabular-nums">{format ? format(rounded) : rounded}</span>
}
