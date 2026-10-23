'use client'

import { useTranslations } from 'next-intl'

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
  const tAccount = useTranslations('accountUi')
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
               {tAccount('verifyYourEmailAddress')} </h2>
            <p className="mt-1 max-w-prose-ui break-words text-body-sm text-muted-foreground">
               {tAccount('weSentAVerificationLinkTo')} {email} {tAccount('youCanContinueUsingYourAccountWhileYouVerifyIt')} </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="shrink-0 sm:w-auto"
          isLoading={isResending}
          onClick={handleResend}
        >
          {isResending ? tAccount('sending') : tAccount('resendEmail')}
        </Button>
      </div>

      {successMessage && (
        <Alert variant="success" className="mt-4">
          {tAccount('verificationSent')} </Alert>
      )}
      {errorMessage && <Alert className="mt-4">{errorMessage}</Alert>}
    </section>
  )
}
