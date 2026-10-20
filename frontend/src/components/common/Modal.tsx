'use client'

import { X } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

/** Phần tử có thể nhận focus bên trong dialog, theo thứ tự tab của tài liệu. */
const FOCUSABLE =
  'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]'

function canReceiveFocus(element: HTMLElement) {
  if (element.tabIndex < 0 || element.matches(':disabled') || element.closest('[hidden], [inert], [aria-hidden="true"]')) return false
  for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
    const style = getComputedStyle(ancestor)
    if (style.display === 'none' || style.visibility === 'hidden') return false
  }
  return true
}

const activePanels = new Set<HTMLElement>()
let originalBodyOverflow = ''

function topPanel() {
  // Retain the layer order until cleanup, even after React removes a portal's DOM.
  return Array.from(activePanels).at(-1)
}

export function Modal({ open, onClose, title, description, children, footer, className }: ModalProps) {
  const t = useTranslations('common')
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { onCloseRef.current = onClose }, [onClose])
  // ID phải duy nhất cho từng instance vì nhiều modal có thể render cùng lúc (TaskCreateModal và
  // TaskDrawer).
  const titleId = useId()
  const descriptionId = useId()

  const focusables = useCallback(
    () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
      .filter(canReceiveFocus),
    []
  )

  useEffect(() => {
    const panel = panelRef.current
    if (!mounted || !open || !panel) return

    // Nhớ nơi focus đang đứng để trả nó về khi đóng; nếu không, focus rơi về
    // <body> và người dùng bàn phím phải tab lại từ đầu trang.
    const previouslyFocused = document.activeElement as HTMLElement | null
    if (activePanels.size === 0) {
      originalBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    activePanels.add(panel)
    const orderedPanels = Array.from(document.querySelectorAll<HTMLElement>('[data-modal-panel]'))
      .filter(element => activePanels.has(element))
    activePanels.clear()
    orderedPanels.forEach(element => activePanels.add(element))
    const items = focusables()
    if (topPanel() === panel) (items[0] ?? panel).focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (topPanel() !== panel) return
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      // Bẫy focus: nếu không có bước này, Tab sẽ đi ra khỏi dialog vào trang nền
      // đang bị che — nội dung mà người dùng chuột không hề tương tác được.
      const current = focusables()
      if (current.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }
      const first = current[0]
      const last = current[current.length - 1]
      const outside = !panel.contains(document.activeElement) || document.activeElement === panel
      if (event.shiftKey && (document.activeElement === first || outside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || outside)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      const wasTop = topPanel() === panel || panel.contains(document.activeElement)
      activePanels.delete(panel)
      if (activePanels.size === 0) document.body.style.overflow = originalBodyOverflow
      const remaining = topPanel()
      if (wasTop && previouslyFocused?.isConnected && (!remaining || remaining.contains(previouslyFocused))) {
        previouslyFocused.focus()
      } else if (wasTop) {
        remaining?.focus()
      }
    }
  }, [focusables, mounted, open])

  if (!mounted || !open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex h-dvh items-center justify-center p-3 sm:p-4" role="presentation">
      {/* Lớp phủ là div chứ không phải button: một button toàn màn hình nằm trong
          tab order và được screen reader đọc lên như một điều khiển thật. Escape
          và nút đóng ở trên đã là đường thoát cho người dùng bàn phím. */}
      <div className="absolute inset-0 bg-slate-950/50" onClick={() => { if (topPanel() === panelRef.current) onClose() }} />
      <section
        ref={panelRef}
        role="dialog"
        data-modal-panel=""
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft-lg sm:max-h-[calc(100dvh-2rem)]',
          className
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 p-4 pb-3 sm:p-6 sm:pb-4">
          <div className="min-w-0">
            <h2 id={titleId} className="break-words text-h3">
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
            aria-label={t('close')}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-6 sm:pb-6">{children}</div>
        {footer && <div className="shrink-0 border-t border-border bg-card p-4 sm:px-6">{footer}</div>}
      </section>
    </div>,
    document.body
  )
}
