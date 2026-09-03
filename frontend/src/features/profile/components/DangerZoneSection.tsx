'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import {
  deleteAccountSchema,
  type DeleteAccountFormValues,
} from '@/features/profile/profile.validation'
import { SectionCard } from './SectionCard'

interface DangerZoneSectionProps {
  username: string
  onDelete: (values: DeleteAccountFormValues) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function DangerZoneSection({ username, onDelete, isLoading, error }: DangerZoneSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { username: '' },
  })
  const confirmation = watch('username')

  return (
    <SectionCard
      danger
      title="Danger zone"
      description="Deactivating your account is permanent and signs you out everywhere."
    >
      {!isOpen ? (
        <Button type="button" variant="outline" className="border-destructive text-destructive sm:w-auto" onClick={() => setIsOpen(true)}>
          Deactivate account
        </Button>
      ) : (
        <form
          onSubmit={handleSubmit(async (values) => {
            try {
              await onDelete(values)
            } catch {
              // Mutation bộc lộ lỗi từ server qua prop `error`.
            }
          })}
          noValidate
          className="max-w-xl space-y-4"
        >
          {error && <Alert>{error}</Alert>}
          <p className="text-sm text-muted-foreground">
            Your project and audit history will remain, but personal details and sign-in methods will be removed.
            Type <strong className="text-foreground">{username}</strong> to confirm.
          </p>
          <div>
            <Label htmlFor="delete_username">Username</Label>
            <Input
              id="delete_username"
              autoComplete="off"
              hasError={Boolean(errors.username)}
              aria-describedby={errors.username ? 'delete-username-error' : undefined}
              {...register('username')}
            />
            {errors.username && (
              <p id="delete-username-error" className="mt-1.5 text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="ghost" className="sm:w-auto" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 sm:w-auto"
              isLoading={isLoading}
              disabled={confirmation !== username}
            >
              Permanently deactivate
            </Button>
          </div>
        </form>
      )}
    </SectionCard>
  )
}
