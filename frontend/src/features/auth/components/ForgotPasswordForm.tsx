'use client'

import { useTranslations } from 'next-intl'

import Link from 'next/link'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert } from '@/components/common/Alert'
import { Button, buttonClasses } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { useAuth } from '@/hooks/useAuth'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'emailIsRequired').email('enterAValidEmailAddress'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const tAccount = useTranslations('accountUi')
  const { forgotPassword, isRequestingPasswordReset, forgotPasswordError } = useAuth()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      await forgotPassword(email)
      setSuccessMessage('resetLinkSent')
    } catch {
      // Lỗi của mutation được hiển thị bên dưới.
    }
  })

  if (successMessage) {
    return (
      <div className="space-y-6">
        <Alert variant="success">{tAccount(successMessage)}</Alert>
        <p className="text-body-sm text-muted-foreground">
           {tAccount('checkYourInboxAndFollowTheLinkWithinOneHourYouCanCloseThisPageSafely')} </p>
        <Link
          href="/login"
          className={buttonClasses({ size: 'lg', fullWidth: true })}
        >
           {tAccount('backToSignIn')} </Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {forgotPasswordError && <Alert>{forgotPasswordError}</Alert>}

      <div>
        <Label htmlFor="email"> {tAccount('email')} </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          hasError={Boolean(errors.email)}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="mt-2 text-body-sm text-destructive">
            {errors.email.message && tAccount(errors.email.message)}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" isLoading={isRequestingPasswordReset}>
        {isRequestingPasswordReset ? tAccount('sendingResetLink') : tAccount('sendResetLink')}
      </Button>

      <p className="text-center text-body-sm text-muted-foreground">
         {tAccount('rememberYourPassword')} {' '}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
           {tAccount('signIn')} </Link>
      </p>
    </form>
  )
}
