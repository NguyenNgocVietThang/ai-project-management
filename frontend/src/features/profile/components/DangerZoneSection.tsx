'use client'

import { useTranslations } from 'next-intl'

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
  const tAccount = useTranslations('accountUi')
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
      title={tAccount('dangerZone')}
      description={tAccount('deactivatingYourAccountIsPermanentAndSignsYouOutEverywhere')}
    >
      {!isOpen ? (
        <Button
          type="button"
          variant="outline"
          className="border-destructive/40 text-destructive hover:border-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
          onClick={() => setIsOpen(true)}
        >
           {tAccount('deactivateAccount')} </Button>
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
          <p className="text-body-sm text-muted-foreground">
             {tAccount('yourProjectAndAuditHistoryWillRemainButPersonalDetailsAndSignInMethodsWillBeRemovedType')} <strong className="text-foreground">{username}</strong>  {tAccount('toConfirm')} </p>
          <div>
            <Label htmlFor="delete_username"> {tAccount('username')} </Label>
            <Input
              id="delete_username"
              autoComplete="off"
              hasError={Boolean(errors.username)}
              aria-describedby={errors.username ? 'delete-username-error' : undefined}
              {...register('username')}
            />
            {errors.username && (
              <p id="delete-username-error" className="mt-1 text-body-sm text-destructive">
                {errors.username.message && tAccount(errors.username.message)}
              </p>
            )}
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" className="sm:w-auto" onClick={() => setIsOpen(false)}>
               {tAccount('cancel')} </Button>
            <Button
              type="submit"
              variant="destructive"
              className="sm:w-auto"
              isLoading={isLoading}
              disabled={confirmation !== username}
            >
               {tAccount('permanentlyDeactivate')} </Button>
          </div>
        </form>
      )}
    </SectionCard>
  )
}
