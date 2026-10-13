'use client'

import { MailWarning } from 'lucide-react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import type { AuthMessageResponse } from '@/types/auth.types'

interface EmailVerificationBannerProps {
  email: string
  onResend: () => Promise<AuthMessageResponse>
  isResending: boolean
  successMessage: string | null
  errorMessage: string | null
}

export function EmailVerificationBanner({
  email,
  onResend,
  isResending,
  successMessage,
  errorMessage,
}: EmailVerificationBannerProps) {
  const handleResend = async () => {
    try {
      await onResend()
    } catch {
      // Mutation bộc lộ thông điệp từ server qua errorMessage.
    }
  }

  return (
    // Banner cảnh báo dùng token warning (tự đổi sáng/tối), không hard-code bảng màu amber.
    <section
      aria-labelledby="email-verification-title"
      className="mb-6 animate-fade-in rounded-xl border border-warning/25 bg-warning-soft p-4 shadow-xs sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
            <MailWarning className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id="email-verification-title" className="text-body font-semibold text-foreground">
              Verify your email address
            </h2>
            <p className="mt-1 max-w-prose-ui break-words text-body-sm text-muted-foreground">
              We sent a verification link to {email}. You can continue using your account while
              you verify it.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="shrink-0 sm:w-auto"
          isLoading={isResending}
          onClick={handleResend}
        >
          {isResending ? 'Sending…' : 'Resend email'}
        </Button>
      </div>

      {successMessage && (
        <Alert variant="success" className="mt-4">
          {successMessage}. Check your inbox for the new link.
        </Alert>
      )}
      {errorMessage && <Alert className="mt-4">{errorMessage}</Alert>}
    </section>
  )
}
