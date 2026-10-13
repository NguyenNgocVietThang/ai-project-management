'use client'

import { X } from 'lucide-react'
import { useCallback, useEffect, useId, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

/** Phần tử có thể nhận focus bên trong dialog, theo thứ tự tab của tài liệu. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  const panelRef = useRef<HTMLElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose }, [onClose])
  // ID phải duy nhất cho từng instance vì nhiều modal có thể render cùng lúc (TaskCreateModal và
  // TaskDrawer).
  const titleId = useId()
  const descriptionId = useId()

  const focusables = useCallback(
    () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
    []
  )

  useEffect(() => {
    if (!open) return

    // Nhớ nơi focus đang đứng để trả nó về khi đóng; nếu không, focus rơi về
    // <body> và người dùng bàn phím phải tab lại từ đầu trang.
    const previouslyFocused = document.activeElement as HTMLElement | null
    const items = focusables()
    ;(items[0] ?? panelRef.current)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      // Bẫy focus: nếu không có bước này, Tab sẽ đi ra khỏi dialog vào trang nền
      // đang bị che — nội dung mà người dùng chuột không hề tương tác được.
      const current = focusables()
      if (current.length === 0) {
        event.preventDefault()
        return
      }
      const first = current[0]
      const last = current[current.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [focusables, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      {/* Lớp phủ là div chứ không phải button: một button toàn màn hình nằm trong
          tab order và được screen reader đọc lên như một điều khiển thật. Escape
          và nút đóng ở trên đã là đường thoát cho người dùng bàn phím. */}
      <div className="absolute inset-0 animate-fade-in bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 max-h-[90dvh] w-full max-w-2xl animate-scale-in overflow-y-auto rounded-2xl border border-border/80 bg-card p-6 shadow-soft-lg sm:p-8',
          className
        )}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-h3">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 max-w-prose-ui text-body-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 -mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}
