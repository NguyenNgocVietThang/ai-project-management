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
import { SocialLoginButtons } from './SocialLoginButtons'

const registerSchema = z
  .object({
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be at most 50 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: passwordSchema,
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const { register: registerUser, isRegistering, registerError } = useAuth()
  const [passwordInput, setPasswordInput] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const strength = getPasswordStrength(passwordInput)

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerUser({
        full_name: values.full_name,
        username: values.username,
        email: values.email,
        password: values.password,
      })
    } catch {
      // Error is caught and exposed via registerError
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {registerError && <Alert>{registerError}</Alert>}

      <div>
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          hasError={Boolean(errors.full_name)}
          aria-describedby={errors.full_name ? 'full_name-error' : undefined}
          {...register('full_name')}
        />
        {errors.full_name && (
          <p id="full_name-error" className="mt-1.5 text-sm text-destructive">
            {errors.full_name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="johndoe"
          autoComplete="username"
          hasError={Boolean(errors.username)}
          aria-describedby={errors.username ? 'username-error' : undefined}
          {...register('username')}
        />
        {errors.username && (
          <p id="username-error" className="mt-1.5 text-sm text-destructive">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          hasError={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="mt-1.5 text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          hasError={Boolean(errors.password)}
          aria-describedby={errors.password ? 'password-error' : undefined}
          {...register('password', {
            onChange: (e) => setPasswordInput(e.target.value),
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
        {errors.password && (
          <p id="password-error" className="mt-1.5 text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="confirm_password">Confirm Password</Label>
        <Input
          id="confirm_password"
          type="password"
          autoComplete="new-password"
          hasError={Boolean(errors.confirm_password)}
          aria-describedby={errors.confirm_password ? 'confirm_password-error' : undefined}
          {...register('confirm_password')}
        />
        {errors.confirm_password && (
          <p id="confirm_password-error" className="mt-1.5 text-sm text-destructive">
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      <Button type="submit" isLoading={isRegistering}>
        {isRegistering ? 'Creating account…' : 'Create account'}
      </Button>

      <SocialLoginButtons dividerText="Or sign up with" />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
