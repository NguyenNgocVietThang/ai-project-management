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
        className="relative flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unread > 0 && (
          // Huy hiệu định vị tuyệt đối, cao cố định và min-w cố định nên số đổi
          // từ 1 lên 99+ không làm xô lệch nút hay header.
          <span
            aria-hidden="true"
            className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-overline tabular-nums tracking-normal text-destructive-foreground ring-2 ring-background"
          >
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
          // Mobile: cố định cách hai mép 16px ngay dưới header (chuông không nằm sát
          // mép phải nên neo right-0 sẽ tràn ra trái màn hình 375px).
          // Từ sm: neo dưới nút chuông, rộng 22rem.
          className="fixed inset-x-4 top-[4.5rem] z-50 origin-top-right animate-scale-in overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-soft-lg sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[22rem]"
        >
          <NotificationPanel onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}
