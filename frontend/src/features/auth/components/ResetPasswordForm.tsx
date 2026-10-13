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
import { getPasswordStrength, passwordSchema } from '@/features/auth/auth.validation'
import { useAuth } from '@/hooks/useAuth'

// Màu thanh độ mạnh mật khẩu theo token ngữ nghĩa (chỉ số = strength.score).
const STRENGTH_TONES = ['bg-muted', 'bg-destructive', 'bg-warning', 'bg-success'] as const

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
      <div className="space-y-6">
        <Alert>This password reset link is missing its token.</Alert>
        <Link
          href="/forgot-password"
          className={buttonClasses({ size: 'lg', fullWidth: true })}
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
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {resetPasswordError && <Alert>{resetPasswordError}</Alert>}

      <div>
        <Label htmlFor="new_password">New password</Label>
        <Input
          id="new_password"
          type="password"
          autoComplete="new-password"
          hasError={Boolean(errors.new_password)}
          {...register('new_password', {
            onChange: (event) => setPasswordInput(event.target.value),
          })}
        />
        {errors.new_password && (
          <p id="new_password-error" className="mt-2 text-body-sm text-destructive">
            {errors.new_password.message}
          </p>
        )}
        {passwordInput && (
          <div className="mt-2 space-y-1">
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div
                className={`h-full rounded-full transition-[width] duration-300 ease-out-soft ${STRENGTH_TONES[strength.score] ?? 'bg-muted'}`}
                style={{ width: `${(strength.score / 3) * 100}%` }}
              />
            </div>
            <p className="text-caption text-muted-foreground">
              Password strength: <span className="font-medium text-foreground">{strength.label}</span>
            </p>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="confirm_password">Confirm new password</Label>
        <Input
          id="confirm_password"
          type="password"
          autoComplete="new-password"
          hasError={Boolean(errors.confirm_password)}
          {...register('confirm_password')}
        />
        {errors.confirm_password && (
          <p id="confirm_password-error" className="mt-2 text-body-sm text-destructive">
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" isLoading={isResettingPassword}>
        {isResettingPassword ? 'Resetting password…' : 'Reset password'}
      </Button>

      <p className="text-center text-body-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  )
}
