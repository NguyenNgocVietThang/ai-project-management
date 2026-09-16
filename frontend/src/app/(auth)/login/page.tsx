import { getTranslations } from 'next-intl/server'
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
  const t = await getTranslations('login')
  const params = await searchParams
  const passwordWasReset = params.reset === 'success'

  return (
    <div>
      <div className="mb-8 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>
      {passwordWasReset && (
        <Alert variant="success" className="mb-5">
          {t('resetSuccess')}
        </Alert>
      )}
      <LoginForm />
    </div>
  )
}
