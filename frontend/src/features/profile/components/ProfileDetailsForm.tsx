'use client'

import { useTranslations } from 'next-intl'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import {
  profileSchema,
  type ProfileFormValues,
} from '@/features/profile/profile.validation'
import type { User } from '@/types/auth.types'
import { SectionCard } from './SectionCard'

interface ProfileDetailsFormProps {
  user: User
  onSubmit: (values: ProfileFormValues) => Promise<void>
  isLoading: boolean
  error: string | null
  success: boolean
}

const fields = [
  { name: 'full_name', label: 'fullName', autoComplete: 'name' },
  { name: 'username', label: 'username', autoComplete: 'username' },
  { name: 'phone', label: 'phone', autoComplete: 'tel' },
  { name: 'position', label: 'position', autoComplete: 'organization-title' },
  { name: 'department', label: 'department', autoComplete: 'organization' },
] as const

export function ProfileDetailsForm({ user, onSubmit, isLoading, error, success }: ProfileDetailsFormProps) {
  const tAccount = useTranslations('accountUi')
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      full_name: user.full_name,
      username: user.username,
      phone: user.phone ?? '',
      position: user.position ?? '',
      department: user.department ?? '',
    },
  })

  return (
    <SectionCard
      title={tAccount('personalInformation')}
      description={tAccount('keepTheDetailsYourTeamUsesToIdentifyAndContactYouUpToDate')}
    >
      <form
        onSubmit={handleSubmit(async (values) => {
          try {
            await onSubmit(values)
          } catch {
            // Mutation bộc lộ lỗi từ server qua prop `error`.
          }
        })}
        noValidate
        className="space-y-4"
      >
        {error && <Alert>{error}</Alert>}
        {success && <Alert variant="success"> {tAccount('profileUpdatedSuccessfully')} </Alert>}

        <div>
          <Label htmlFor="email"> {tAccount('email')} </Label>
          <Input id="email" value={user.email} disabled readOnly />
          <p className="mt-1 text-caption text-muted-foreground"> {tAccount('emailCannotBeChangedHere')} </p>
        </div>

        <div>
          <Label htmlFor="hourly_rate"> {tAccount('hourlyRate')} </Label>
          <Input
            id="hourly_rate"
            value={user.hourly_rate === null ? tAccount('notAssigned') : user.hourly_rate.toString()}
            disabled
            readOnly
          />
          <p className="mt-1 text-caption text-muted-foreground">
             {tAccount('yourHourlyRateIsManagedByAnAdministrator')} </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.name} className={field.name === 'full_name' ? 'sm:col-span-2' : ''}>
              <Label htmlFor={field.name}>{tAccount(field.label)}</Label>
              <Input
                id={field.name}
                autoComplete={field.autoComplete}
                hasError={Boolean(errors[field.name])}
                aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                {...register(field.name)}
              />
              {errors[field.name] && (
                <p id={`${field.name}-error`} className="mt-1 text-body-sm text-destructive">
                  {errors[field.name]?.message && tAccount(errors[field.name]!.message!)}
                </p>
              )}
            </div>
          ))}
        </div>

        <Button type="submit" isLoading={isLoading} disabled={!isDirty} className="sm:w-auto">
           {tAccount('saveChanges')} </Button>
      </form>
    </SectionCard>
  )
}
