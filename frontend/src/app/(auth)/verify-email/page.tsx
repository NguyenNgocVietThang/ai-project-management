'use client'

import { useTranslations } from 'next-intl'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { ButtonLink } from '@/components/common/Button'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'

type VerificationState =
  | { status: 'loading'; message: string }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string; error?: unknown }

/** Khung xương giữ chỗ cho ô biểu tượng, tiêu đề và mô tả trong lúc chờ. */
function VerifyEmailSkeleton({ label }: { label: string }) {
  return (
    <SkeletonRegion label={label} className="flex flex-col items-center gap-6 text-center">
      <Skeleton className="h-14 w-14 rounded-2xl" />
      <div className="flex w-full flex-col items-center gap-2">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </SkeletonRegion>
  )
}

function VerifyEmailContent() {
  const getApiErrorMessage = useApiErrorMessage()
  const tAccount = useTranslations('accountUi')
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) => state.accessToken)
  const setUser = useAuthStore((state) => state.setUser)
  const started = useRef(false)
  const [state, setState] = useState<VerificationState>({
    status: 'loading',
    message: 'verifyingYourEmailAddress',
  })

  useEffect(() => {
    if (started.current) return
    started.current = true

    const token = searchParams.get('token')
    if (!token) {
      setState({
        status: 'error',
        message: 'thisVerificationLinkIsInvalidOrHasExpired',
      })
      return
    }

    async function verify() {
      try {
        await authService.verifyEmail(token as string)

        if (accessToken) {
          try {
            const me = await authService.me()
            setUser(me)
            queryClient.setQueryData(['auth', 'me'], me)
          } catch {
            // Việc xác minh vẫn thành công ngay cả khi làm mới hồ sơ cục bộ thất bại.
          }
        }

        setState({ status: 'success', message: 'verificationComplete' })
      } catch (error) {
        setState({
          status: 'error',
          message: 'thisVerificationLinkIsInvalidOrHasExpired',
          error,
        })
      }
    }

    void verify()
  }, [accessToken, queryClient, searchParams, setUser])

  const isSuccess = state.status === 'success'
  const destination = accessToken ? '/dashboard' : '/login'

  return (
    <div className="flex flex-col items-center gap-6 text-center" aria-live="polite">
      {state.status === 'loading' ? (
        <Skeleton className="h-14 w-14 rounded-2xl" />
      ) : (
        // Ô biểu tượng trạng thái: nền nhạt cùng tông với biểu tượng.
        <span
          className={
            isSuccess
              ? 'flex h-14 w-14 animate-scale-in items-center justify-center rounded-2xl bg-success-soft ring-8 ring-success-soft/40'
              : 'flex h-14 w-14 animate-scale-in items-center justify-center rounded-2xl bg-destructive/10 ring-8 ring-destructive/5'
          }
        >
          {isSuccess ? (
            <CheckCircle2 className="h-6 w-6 text-success" aria-hidden="true" />
          ) : (
            <XCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
          )}
        </span>
      )}

      <div className="space-y-2">
        <h1 className="text-h2 text-foreground">
          {state.status === 'loading' && tAccount('verifyingEmail')}
          {state.status === 'success' && tAccount('emailVerified')}
          {state.status === 'error' && tAccount('verificationFailed')}
        </h1>
        <p className="text-body-sm text-muted-foreground">{state.status === 'error' && state.error ? getApiErrorMessage(state.error, tAccount(state.message)) : tAccount(state.message)}</p>
        {state.status === 'error' && accessToken && (
          <p className="text-body-sm text-muted-foreground">
             {tAccount('returnToTheDashboardToRequestAFreshVerificationEmail')} </p>
        )}
      </div>

      {state.status !== 'loading' && (
        <ButtonLink href={destination} size="lg" fullWidth>
          {accessToken ? tAccount('goToDashboard') : isSuccess ? tAccount('signIn') : tAccount('backToSignIn')}
        </ButtonLink>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  const tAccount = useTranslations('accountUi')
  return (
    <Suspense
      fallback={<VerifyEmailSkeleton label={tAccount('loadingVerificationLink')} />}
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
