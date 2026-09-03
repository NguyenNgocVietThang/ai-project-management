'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import {
  passwordFormSchema,
  type PasswordFormValues,
} from '@/features/profile/profile.validation'
import { SectionCard } from './SectionCard'

interface PasswordSectionProps {
  hasPassword: boolean
  onSubmit: (values: PasswordFormValues) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function PasswordSection({ hasPassword, onSubmit, isLoading, error }: PasswordSectionProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { current_password: '', new_password: '', confirm_password: '' },
  })

  return (
    <SectionCard
      title={hasPassword ? 'Change password' : 'Set a password'}
      description={
        hasPassword
          ? 'Changing your password signs you out on every device.'
          : 'Add password sign-in to your social account. You will be signed out afterwards.'
      }
    >
      <form
        onSubmit={handleSubmit(async (values) => {
          if (hasPassword && !values.current_password) {
            setError('current_password', {
              type: 'required',
              message: 'Enter your current password',
            })
            return
          }
          try {
            await onSubmit(values)
          } catch {
            // Mutation bộc lộ lỗi từ server qua prop `error`.
          }
        })}
        noValidate
        className="max-w-xl space-y-5"
      >
        {error && <Alert>{error}</Alert>}
        {hasPassword && (
          <div>
            <Label htmlFor="current_password">Current password</Label>
            <Input
              id="current_password"
              type="password"
              autoComplete="current-password"
              hasError={Boolean(errors.current_password)}
              {...register('current_password')}
            />
            {errors.current_password && (
              <p className="mt-1.5 text-sm text-destructive">
                {errors.current_password.message}
              </p>
            )}
          </div>
        )}
        <div>
          <Label htmlFor="new_password">New password</Label>
          <Input
            id="new_password"
            type="password"
            autoComplete="new-password"
            hasError={Boolean(errors.new_password)}
            aria-describedby={errors.new_password ? 'new-password-error' : undefined}
            {...register('new_password')}
          />
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
        <Button type="submit" isLoading={isLoading} className="sm:w-auto">
          {hasPassword ? 'Change password' : 'Set password'}
        </Button>
      </form>
    </SectionCard>
  )
}
