'use client'

import Link from 'next/link'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { getPasswordStrength, passwordSchema } from '@/features/auth/auth.validation'
import { useAuth } from '@/hooks/useAuth'

const resetPasswordSchema = z
  .object({
    new_password: passwordSchema,
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

interface ResetPasswordFormProps {
  token: string | null
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { resetPassword, isResettingPassword, resetPasswordError } = useAuth()
  const [passwordInput, setPasswordInput] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const strength = getPasswordStrength(passwordInput)

  if (!token) {
    return (
      <div className="space-y-5">
        <Alert>This password reset link is missing its token.</Alert>
        <Link
          href="/forgot-password"
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Request a new link
        </Link>
      </div>
    )
  }

  const onSubmit = handleSubmit(async ({ new_password }) => {
    try {
      await resetPassword({ token, new_password })
    } catch {
      // Lỗi của mutation được hiển thị bên dưới.
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {resetPasswordError && <Alert>{resetPasswordError}</Alert>}

      <div>
        <Label htmlFor="new_password">New password</Label>
        <Input
          id="new_password"
          type="password"
          autoComplete="new-password"
          hasError={Boolean(errors.new_password)}
          aria-describedby={errors.new_password ? 'new-password-error' : undefined}
          {...register('new_password', {
            onChange: (event) => setPasswordInput(event.target.value),
          })}
        />
        {passwordInput && (
          <div className="mt-2 space-y-1">
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${(strength.score / 3) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Password strength: <span className="font-medium">{strength.label}</span>
            </p>
          </div>
        )}
        {errors.new_password && (
          <p id="new-password-error" className="mt-1.5 text-sm text-destructive">
            {errors.new_password.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="confirm_password">Confirm new password</Label>
        <Input
          id="confirm_password"
          type="password"
          autoComplete="new-password"
          hasError={Boolean(errors.confirm_password)}
          aria-describedby={errors.confirm_password ? 'confirm-password-error' : undefined}
          {...register('confirm_password')}
        />
        {errors.confirm_password && (
          <p id="confirm-password-error" className="mt-1.5 text-sm text-destructive">
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      <Button type="submit" isLoading={isResettingPassword}>
        {isResettingPassword ? 'Resetting password…' : 'Reset password'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  )
}
