'use client'

import { useTranslations } from 'next-intl'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { useAuth } from '@/hooks/useAuth'
import { SocialLoginButtons } from './SocialLoginButtons'

const loginSchema = z.object({
  email: z.string().min(1, 'emailIsRequired').email('enterAValidEmailAddress'),
  password: z.string().min(1, 'passwordIsRequired'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const tAccount = useTranslations('accountUi')
  const t = useTranslations('login')
  const { login, isLoggingIn, loginError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values)
    } catch {
      // Được hiển thị qua `loginError` bên dưới.
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {loginError && <Alert>{loginError}</Alert>}

      <div>
        <Label htmlFor="email"> {tAccount('email')} </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          hasError={Boolean(errors.email)}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="mt-2 text-body-sm text-destructive">
            {errors.email.message && tAccount(errors.email.message)}
          </p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <Label htmlFor="password" className="mb-0">{t('password')}</Label>
          <Link
            href="/forgot-password"
            className="inline-flex min-h-11 items-center text-body-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {t('forgot')}
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          hasError={Boolean(errors.password)}
          {...register('password')}
        />
        {errors.password && (
          <p id="password-error" className="mt-2 text-body-sm text-destructive">
            {errors.password.message && tAccount(errors.password.message)}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" isLoading={isLoggingIn}>
        {isLoggingIn ? t('signingIn') : t('signIn')}
      </Button>

      <SocialLoginButtons dividerText={t('social')} />

      <p className="text-center text-body-sm text-muted-foreground">
        {t('noAccount')}{' '}
        <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
          {t('signUp')}
        </Link>
      </p>
    </form>
  )
}
