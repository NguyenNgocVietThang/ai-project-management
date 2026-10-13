'use client'

import { useCallback, useEffect, useState } from 'react'

export const FIREWORKS_STORAGE_KEY = 'fx-fireworks'
/** Sự kiện nội bộ để đồng bộ các thành phần trong cùng một tab
 *  (sự kiện 'storage' chỉ bắn sang các tab khác). */
const SAME_TAB_EVENT = 'fx-fireworks-change'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/** Đọc lựa chọn đã lưu; mặc định bật khi chưa lưu hoặc không truy cập được localStorage. */
export function readFireworksPreference(): boolean {
  try {
    const stored = localStorage.getItem(FIREWORKS_STORAGE_KEY)
    return stored === null ? true : stored !== 'false'
  } catch {
    return true
  }
}

export interface FireworksPreference {
  /** Lựa chọn của người dùng (mặc định true). */
  enabled: boolean
  setEnabled: (value: boolean) => void
  /** Hệ điều hành yêu cầu giảm chuyển động. */
  reducedMotion: boolean
  /** Trạng thái thực tế: enabled && !reducedMotion. */
  effectiveEnabled: boolean
}

export function useFireworksPreference(): FireworksPreference {
  // Giá trị khởi tạo cố định để HTML render phía server khớp với lần hydrate đầu.
  const [enabled, setState] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setState(readFireworksPreference())
    const sync = (event: Event) => {
      if (event instanceof StorageEvent && event.key !== FIREWORKS_STORAGE_KEY && event.key !== null) return
      setState(readFireworksPreference())
    }
    window.addEventListener('storage', sync)
    window.addEventListener(SAME_TAB_EVENT, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(SAME_TAB_EVENT, sync)
    }
  }, [])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia(REDUCED_MOTION_QUERY)
    setReducedMotion(query.matches)
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    // Safari cũ chỉ hỗ trợ addListener.
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', onChange)
      return () => query.removeEventListener('change', onChange)
    }
    query.addListener(onChange)
    return () => query.removeListener(onChange)
  }, [])

  const setEnabled = useCallback((value: boolean) => {
    setState(value)
    try {
      localStorage.setItem(FIREWORKS_STORAGE_KEY, value ? 'true' : 'false')
    } catch {
      /* bỏ qua: chế độ riêng tư hoặc bị chặn lưu trữ */
    }
    window.dispatchEvent(new Event(SAME_TAB_EVENT))
  }, [])

  return { enabled, setEnabled, reducedMotion, effectiveEnabled: enabled && !reducedMotion }
}
