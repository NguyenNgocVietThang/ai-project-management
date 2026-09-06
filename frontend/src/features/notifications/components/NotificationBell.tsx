'use client'
import { useTranslations } from 'next-intl'

import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useUnreadCount } from '../hooks/useNotifications'
import { NotificationPanel } from './NotificationPanel'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { data } = useUnreadCount()
  const unread = data?.unread_count ?? 0
  const t = useTranslations('notifications')

  // Đóng khi click ra ngoài, hoặc khi nhấn Escape. Trước đây chỉ có `mousedown`,
  // nên người dùng bàn phím mở được bảng này mà không có cách nào đóng nó lại.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick)
      document.addEventListener('keydown', handleKey)
    }
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        id="notif-bell-btn"
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? 'notif-panel' : undefined}
        aria-label={unread > 0 ? t('bellLabelUnread', { count: unread }) : t('bellLabel')}
        className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-accent"
      >
        <Bell className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {/* Bảng dropdown */}
      {open && (
        <div
          id="notif-panel"
          role="dialog"
          aria-label={t('bellLabel')}
          // max-w thay vì chiều rộng cứng: bảng 380px cố định tràn ra ngoài
          // viewport 360px.
          className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border bg-popover shadow-xl"
        >
          <NotificationPanel onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}
