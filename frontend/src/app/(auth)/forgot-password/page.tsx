import { getTranslations } from 'next-intl/server'

import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('accountUi')
  return { title: t('forgotPassword') }
}

export default function ForgotPasswordPage() {
  const tAccount = useTranslations('accountUi')
  return (
    <div>
      <div className="mb-8 space-y-2">
        <h1 className="text-h2 text-foreground">
           {tAccount('forgotYourPassword')} </h1>
        <p className="text-body-sm text-muted-foreground">
           {tAccount('enterYourEmailAndWeWillSendYouASecureResetLink')} </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
