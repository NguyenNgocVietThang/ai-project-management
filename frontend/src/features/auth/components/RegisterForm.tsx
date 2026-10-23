'use client'

import { useTranslations } from 'next-intl'

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

// Màu thanh độ mạnh mật khẩu theo token ngữ nghĩa (chỉ số = strength.score).
const STRENGTH_TONES = ['bg-muted', 'bg-destructive', 'bg-warning', 'bg-success'] as const

const registerSchema = z
  .object({
    full_name: z.string().min(2, 'fullNameMustBeAtLeast2Characters'),
    username: z
      .string()
      .min(3, 'usernameMustBeAtLeast3Characters')
      .max(50, 'usernameMustBeAtMost50Characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'usernameCanOnlyContainLettersNumbersAndUnderscores'),
    email: z.string().min(1, 'emailIsRequired').email('enterAValidEmailAddress'),
    password: passwordSchema,
    confirm_password: z.string().min(1, 'pleaseConfirmYourPassword'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'passwordsDoNotMatch',
    path: ['confirm_password'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const tAccount = useTranslations('accountUi')
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
      // Lỗi được bắt và bộc lộ qua registerError
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {registerError && <Alert>{registerError}</Alert>}

      <div>
        <Label htmlFor="full_name"> {tAccount('fullNameLabel')} </Label>
        <Input
          id="full_name"
          type="text"
          placeholder={tAccount('johnDoe')}
          autoComplete="name"
          hasError={Boolean(errors.full_name)}
          {...register('full_name')}
        />
        {errors.full_name && (
          <p id="full_name-error" className="mt-2 text-body-sm text-destructive">
            {errors.full_name.message && tAccount(errors.full_name.message)}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="username"> {tAccount('username')} </Label>
        <Input
          id="username"
          type="text"
          placeholder={tAccount('usernameExample')}
          autoComplete="username"
          hasError={Boolean(errors.username)}
          {...register('username')}
        />
        {errors.username && (
          <p id="username-error" className="mt-2 text-body-sm text-destructive">
            {errors.username.message && tAccount(errors.username.message)}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email"> {tAccount('email')} </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
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
        <Label htmlFor="password"> {tAccount('password')} </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          hasError={Boolean(errors.password)}
          {...register('password', {
            onChange: (e) => setPasswordInput(e.target.value),
          })}
        />
        {errors.password && (
          <p id="password-error" className="mt-2 text-body-sm text-destructive">
            {errors.password.message && tAccount(errors.password.message)}
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
               {tAccount('passwordStrength')} <span className="font-medium text-foreground">{strength.label && tAccount(strength.label)}</span>
            </p>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="confirm_password"> {tAccount('confirmPassword')} </Label>
        <Input
          id="confirm_password"
          type="password"
          autoComplete="new-password"
          hasError={Boolean(errors.confirm_password)}
          {...register('confirm_password')}
        />
        {errors.confirm_password && (
          <p id="confirm_password-error" className="mt-2 text-body-sm text-destructive">
            {errors.confirm_password.message && tAccount(errors.confirm_password.message)}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" isLoading={isRegistering}>
        {isRegistering ? tAccount('creatingAccount') : tAccount('createAccount')}
      </Button>

      <SocialLoginButtons dividerText={tAccount('orSignUpWith')} />

      <p className="text-center text-body-sm text-muted-foreground">
         {tAccount('alreadyHaveAnAccount')} {' '}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
           {tAccount('signIn')} </Link>
      </p>
    </form>
  )
}
