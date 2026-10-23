import { getTranslations } from 'next-intl/server'

import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('accountUi')
  return { title: t('createYourAccount') }
}

export default function RegisterPage() {
  const tAccount = useTranslations('accountUi')
  return (
    <div>
      <div className="mb-8 space-y-2">
        <h1 className="text-h2 text-foreground"> {tAccount('createAnAccount')} </h1>
        <p className="text-body-sm text-muted-foreground"> {tAccount('enterYourDetailsBelowToCreateYourAccount')} </p>
      </div>
      <RegisterForm />
    </div>
  )
}
