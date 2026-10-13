import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot password',
}

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="mb-8 space-y-2">
        <h1 className="text-h2 text-foreground">
          Forgot your password?
        </h1>
        <p className="text-body-sm text-muted-foreground">
          Enter your email and we will send you a secure reset link.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
