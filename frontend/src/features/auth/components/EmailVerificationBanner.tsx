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
    <section
      aria-labelledby="email-verification-title"
      className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <MailWarning className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <h2 id="email-verification-title" className="font-semibold">
              Verify your email address
            </h2>
            <p className="mt-1 text-sm text-amber-900 dark:text-amber-200">
              We sent a verification link to {email}. You can continue using your account while
              you verify it.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full shrink-0 border-amber-400 bg-white text-amber-950 hover:bg-amber-100 sm:w-auto dark:bg-transparent dark:text-amber-100"
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
