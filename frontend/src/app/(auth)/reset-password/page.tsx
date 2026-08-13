'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'

function ResetPasswordContent() {
  const searchParams = useSearchParams()

  return (
    <div>
      <div className="mb-8 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Choose a new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Use at least eight characters and include a number or special character.
        </p>
      </div>
      <ResetPasswordForm token={searchParams.get('token')} />
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading reset link…</p>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
