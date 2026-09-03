'use client'

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
  { name: 'full_name', label: 'Full name', autoComplete: 'name' },
  { name: 'username', label: 'Username', autoComplete: 'username' },
  { name: 'phone', label: 'Phone', autoComplete: 'tel' },
  { name: 'position', label: 'Position', autoComplete: 'organization-title' },
  { name: 'department', label: 'Department', autoComplete: 'organization' },
] as const

export function ProfileDetailsForm({ user, onSubmit, isLoading, error, success }: ProfileDetailsFormProps) {
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
      title="Personal information"
      description="Keep the details your team uses to identify and contact you up to date."
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
        className="space-y-5"
      >
        {error && <Alert>{error}</Alert>}
        {success && <Alert variant="success">Profile updated successfully.</Alert>}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled readOnly />
          <p className="mt-1.5 text-xs text-muted-foreground">Email cannot be changed here.</p>
        </div>

        <div>
          <Label htmlFor="hourly_rate">Hourly rate</Label>
          <Input
            id="hourly_rate"
            value={user.hourly_rate === null ? 'Not assigned' : user.hourly_rate.toString()}
            disabled
            readOnly
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Your hourly rate is managed by an administrator.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.name} className={field.name === 'full_name' ? 'sm:col-span-2' : ''}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                autoComplete={field.autoComplete}
                hasError={Boolean(errors[field.name])}
                aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                {...register(field.name)}
              />
              {errors[field.name] && (
                <p id={`${field.name}-error`} className="mt-1.5 text-sm text-destructive">
                  {errors[field.name]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <Button type="submit" isLoading={isLoading} disabled={!isDirty} className="sm:w-auto">
          Save changes
        </Button>
      </form>
    </SectionCard>
  )
}
