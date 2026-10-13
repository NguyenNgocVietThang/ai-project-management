'use client'

import { useEffect, useRef } from 'react'

import { createFireworks, isInteractiveTarget, type FireworksMode } from './fireworks'
import { useFireworksPreference } from './useFireworksPreference'

/* Ảnh nền sáng/tối được chọn bằng --app-bg-image trong globals.css.
 * Lớp phủ bg-background làm dịu ảnh để nội dung phía trước dễ đọc hơn. */

/** Đọc chế độ trực tiếp từ class trên <html> để không phụ thuộc ThemeProvider. */
function currentMode(): FireworksMode {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/** Người dùng đang bôi đen văn bản: bấm lúc này là để bỏ chọn, không bắn pháo hoa. */
function hasTextSelection(): boolean {
  const selection = typeof window.getSelection === 'function' ? window.getSelection() : null
  return !!selection && !selection.isCollapsed && selection.toString().length > 0
}

export function AppBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { effectiveEnabled } = useFireworksPreference()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!effectiveEnabled || !canvas) return

    const engine = createFireworks(canvas, { getMode: currentMode })

    const onPointerDown = (event: PointerEvent) => {
      // Chỉ nút chính của chuột, chạm hoặc bút; bỏ qua khi giữ phím bổ trợ.
      if (!event.isPrimary || event.button !== 0) return
      if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return
      if (isInteractiveTarget(event.target) || hasTextSelection()) return
      // Không gọi preventDefault: hành vi mặc định của trang giữ nguyên.
      engine.burst(event.clientX, event.clientY)
    }

    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      engine.destroy()
    }
  }, [effectiveEnabled])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'var(--app-bg-image)' }}
      />
      <div className="absolute inset-0 bg-background" style={{ opacity: 'var(--app-bg-overlay)' }} />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  )
}
