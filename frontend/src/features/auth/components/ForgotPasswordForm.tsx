'use client'

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
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
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
      const response = await forgotPassword(email)
      setSuccessMessage(response.message)
    } catch {
      // Lỗi của mutation được hiển thị bên dưới.
    }
  })

  if (successMessage) {
    return (
      <div className="space-y-6">
        <Alert variant="success">{successMessage}</Alert>
        <p className="text-body-sm text-muted-foreground">
          Check your inbox and follow the link within one hour. You can close this page safely.
        </p>
        <Link
          href="/login"
          className={buttonClasses({ size: 'lg', fullWidth: true })}
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {forgotPasswordError && <Alert>{forgotPasswordError}</Alert>}

      <div>
        <Label htmlFor="email">Email</Label>
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
            {errors.email.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" isLoading={isRequestingPasswordReset}>
        {isRequestingPasswordReset ? 'Sending reset link…' : 'Send reset link'}
      </Button>

      <p className="text-center text-body-sm text-muted-foreground">
        Remember your password?{' '}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
