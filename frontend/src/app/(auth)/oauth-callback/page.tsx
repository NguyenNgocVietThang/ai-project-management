'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'

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
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground">Completing sign in…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Authentication Failed</h1>
        <p className="text-sm text-muted-foreground">
          We encountered an issue while signing you in with your social account.
        </p>
      </div>

      {errorMessage && <Alert>{errorMessage}</Alert>}

      <div className="flex flex-col gap-3">
        <Link href="/login">
          <Button className="w-full">Return to Sign in</Button>
        </Link>
      </div>
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading authentication status…</p>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  )
}
