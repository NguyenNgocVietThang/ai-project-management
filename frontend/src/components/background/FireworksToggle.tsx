'use client'

import { Sparkles } from 'lucide-react'

import { useFireworksPreference } from './useFireworksPreference'

interface FireworksToggleProps {
  /** Nhãn đã dịch, ví dụ "Hiệu ứng pháo hoa". */
  label: string
  /** Gợi ý (đã dịch) khi công tắc bị khoá do hệ điều hành yêu cầu giảm chuyển động. */
  reducedMotionHint?: string
}

/** Công tắc bật/tắt pháo hoa nền, cùng kiểu dáng với ThemeToggle. */
export function FireworksToggle({ label, reducedMotionHint = 'Reduced motion is on' }: FireworksToggleProps) {
  const { enabled, setEnabled, reducedMotion, effectiveEnabled } = useFireworksPreference()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={effectiveEnabled}
      aria-label={label}
      title={reducedMotion ? `${label} - ${reducedMotionHint}` : label}
      disabled={reducedMotion}
      onClick={() => setEnabled(!enabled)}
      className="inline-flex h-11 w-11 items-center justify-center rounded-lg border p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span
        className={`inline-flex h-full w-full items-center justify-center rounded-md transition-colors ${
          effectiveEnabled ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/60'
        }`}
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
      </span>
    </button>
  )
}
