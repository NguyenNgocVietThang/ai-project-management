'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

interface ThemeContextValue {
  preference: ThemePreference
  resolved: 'light' | 'dark'
  setPreference: (value: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/** Script chạy trước lần vẽ đầu tiên để đặt class theme.
 *
 *  Không có nó, trang luôn vẽ theo sáng rồi mới nhảy sang tối khi React hydrate —
 *  một cú chớp trắng vào mặt người dùng ở chế độ tối, mỗi lần tải trang. */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var dark = stored === 'dark' ||
      ((!stored || stored === 'system') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.add(dark ? 'dark' : 'light');
  } catch (e) {
    /* Chế độ riêng tư chặn localStorage — cứ để mặc định sáng. */
  }
})();
`

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function apply(preference: ThemePreference): 'light' | 'dark' {
  const dark = preference === 'dark' || (preference === 'system' && systemPrefersDark())
  const root = document.documentElement
  root.classList.toggle('dark', dark)
  root.classList.toggle('light', !dark)
  return dark ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setStored] = useState<ThemePreference>('system')
  const [resolved, setResolved] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    let initial: ThemePreference = 'system'
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'light' || stored === 'dark' || stored === 'system') initial = stored
    } catch {
      /* bỏ qua: chế độ riêng tư */
    }
    setStored(initial)
    setResolved(apply(initial))
  }, [])

  // Khi để "theo hệ điều hành", theme phải đổi cùng hệ điều hành mà không cần tải lại.
  useEffect(() => {
    if (preference !== 'system') return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setResolved(apply('system'))
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [preference])

  const setPreference = useCallback((value: ThemePreference) => {
    setStored(value)
    setResolved(apply(value))
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* bỏ qua: chế độ riêng tư */
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ preference, resolved, setPreference }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
