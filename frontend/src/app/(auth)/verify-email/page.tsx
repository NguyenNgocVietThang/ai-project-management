'use client'

import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import { getApiErrorMessage } from '@/types/api.types'

type VerificationState =
  | { status: 'loading'; message: string }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

const actionLinkClasses =
  'inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) => state.accessToken)
  const setUser = useAuthStore((state) => state.setUser)
  const started = useRef(false)
  const [state, setState] = useState<VerificationState>({
    status: 'loading',
    message: 'Verifying your email address…',
  })

  useEffect(() => {
    if (started.current) return
    started.current = true

    const token = searchParams.get('token')
    if (!token) {
      setState({
        status: 'error',
        message: 'This verification link is invalid or has expired.',
      })
      return
    }

    async function verify() {
      try {
        const response = await authService.verifyEmail(token as string)

        if (accessToken) {
          try {
            const me = await authService.me()
            setUser(me)
            queryClient.setQueryData(['auth', 'me'], me)
          } catch {
            // Việc xác minh vẫn thành công ngay cả khi làm mới hồ sơ cục bộ thất bại.
          }
        }

        setState({ status: 'success', message: response.message })
      } catch (error) {
        setState({
          status: 'error',
          message: getApiErrorMessage(
            error,
            'This verification link is invalid or has expired.'
          ),
        })
      }
    }

    void verify()
  }, [accessToken, queryClient, searchParams, setUser])

  const isSuccess = state.status === 'success'
  const destination = accessToken ? '/dashboard' : '/login'

  return (
    <div className="space-y-6 text-center" aria-live="polite">
      <div className="flex justify-center">
        {state.status === 'loading' && (
          <Loader2 className="h-12 w-12 animate-spin text-primary" aria-hidden="true" />
        )}
        {state.status === 'success' && (
          <CheckCircle2 className="h-12 w-12 text-emerald-600" aria-hidden="true" />
        )}
        {state.status === 'error' && (
          <XCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {state.status === 'loading' && 'Verifying email'}
          {state.status === 'success' && 'Email verified'}
          {state.status === 'error' && 'Verification failed'}
        </h1>
        <p className="text-sm text-muted-foreground">{state.message}</p>
        {state.status === 'error' && accessToken && (
          <p className="text-sm text-muted-foreground">
            Return to the dashboard to request a fresh verification email.
          </p>
        )}
      </div>

      {state.status !== 'loading' && (
        <Link href={destination} className={actionLinkClasses}>
          {accessToken ? 'Go to dashboard' : isSuccess ? 'Sign in' : 'Back to sign in'}
        </Link>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Loading verification link…</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
