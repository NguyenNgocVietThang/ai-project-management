import type { Metadata } from 'next'
import { Alert } from '@/components/common/Alert'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const metadata: Metadata = {
  title: 'Sign in',
}

interface LoginPageProps {
  searchParams: Promise<{ reset?: string | string[] }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const passwordWasReset = params.reset === 'success'

  return (
    <div>
      <div className="mb-8 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account to continue.</p>
      </div>
      {passwordWasReset && (
        <Alert variant="success" className="mb-5">
          Your password has been reset successfully. You can now sign in.
        </Alert>
      )}
      <LoginForm />
    </div>
  )
}
