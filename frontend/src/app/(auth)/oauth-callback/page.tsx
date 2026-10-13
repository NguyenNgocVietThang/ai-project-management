'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Alert } from '@/components/common/Alert'
import { ButtonLink } from '@/components/common/Button'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'

/** Trạng thái chờ: khung xương thay cho spinner, kèm nhãn cho trình đọc màn hình. */
function OAuthPendingState({ label }: { label: string }) {
  return (
    <SkeletonRegion label={label} className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-12 w-full" />
      <p className="text-center text-body-sm text-muted-foreground" aria-hidden="true">
        {label}
      </p>
    </SkeletonRegion>
  )
}

function OAuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setTokens, setUser } = useAuthStore()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    async function processCallback() {
      const code = searchParams.get('code')
      const error = searchParams.get('error')

      if (error) {
        setErrorMessage(decodeURIComponent(error))
        setIsProcessing(false)
        return
      }

      if (!code) {
        setErrorMessage('Invalid response from authentication server.')
        setIsProcessing(false)
        return
      }

      try {
        // URL callback mang theo một code dùng một lần, không phải bản thân các token,
        // nên không có gì nhạy cảm bị để lại trong lịch sử hay header Referer.
        const tokens = await authService.exchangeOAuthCode(code)
        setTokens(tokens)
        const user = await authService.me()
        setUser(user)
        router.replace('/dashboard')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to complete login.'
        setErrorMessage(message)
        setIsProcessing(false)
      }
    }

    processCallback()
  }, [searchParams, router, setTokens, setUser])

  if (isProcessing) {
    return <OAuthPendingState label="Completing sign in…" />
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-h2 text-foreground">Authentication Failed</h1>
        <p className="text-body-sm text-muted-foreground">
          We encountered an issue while signing you in with your social account.
        </p>
      </div>

      {errorMessage && <Alert>{errorMessage}</Alert>}

      {/* Liên kết mang hình thức nút: tránh lồng <button> trong <a> như trước. */}
      <ButtonLink href="/login" size="lg" fullWidth>
        Return to Sign in
      </ButtonLink>
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={<OAuthPendingState label="Loading authentication status…" />}
    >
      <OAuthCallbackContent />
    </Suspense>
  )
}
