'use client'

import { useTranslations } from 'next-intl'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { SkeletonRegion, SkeletonText } from '@/components/ui/Skeleton'
import { usePermissionCatalog } from '@/features/admin/roles/hooks/useAdminRoles'
import { roleFormSchema, type RoleFormValues } from '@/features/admin/roles/roles.validation'
import type { Role, RoleCreate, RoleUpdate } from '@/types/admin.types'

const PROTECTED_ROLE_NAME = 'Admin'

interface RoleFormProps {
  role?: Role
  onSubmit: (body: RoleCreate | RoleUpdate) => Promise<void>
  onCancel: () => void
  isLoading: boolean
  error?: string | null
}

export function RoleForm({ role, onSubmit, onCancel, isLoading, error }: RoleFormProps) {
  const tAccount = useTranslations('accountUi')
  const permissionsQuery = usePermissionCatalog()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name ?? '',
      description: role?.description ?? '',
      permission_ids: role?.permissions.map((permission) => permission.id) ?? [],
    },
  })
  const selected = watch('permission_ids')
  const isProtected = role?.name === PROTECTED_ROLE_NAME

  const grouped = new Map<string, { id: number; action: string; description: string | null }[]>()
  for (const permission of permissionsQuery.data ?? []) {
    const bucket = grouped.get(permission.resource) ?? []
    bucket.push({ id: permission.id, action: permission.action, description: permission.description })
    grouped.set(permission.resource, bucket)
  }

  const toggle = (permissionId: number) => {
    setValue(
      'permission_ids',
      selected.includes(permissionId)
        ? selected.filter((id) => id !== permissionId)
        : [...selected, permissionId]
    )
  }

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          ...values,
          description: values.description?.trim() || null,
        })
      })}
    >
      {error && <Alert>{error}</Alert>}
      {isProtected && (
        <Alert variant="success"> {tAccount('theBuiltInAdminRoleAlwaysHasEveryPermissionAndCannotBeRenamed')} </Alert>
      )}
      <div>
        <Label htmlFor="role-name"> {tAccount('name')} </Label>
        <Input
          id="role-name"
          disabled={isProtected}
          hasError={Boolean(errors.name)}
          {...register('name')}
        />
        {errors.name && <p id="role-name-error" role="alert" className="mt-1 text-body-sm text-destructive">{errors.name.message && tAccount(errors.name.message)}</p>}
      </div>
      <div>
        <Label htmlFor="role-description"> {tAccount('description')} </Label>
        <textarea
          id="role-description"
          rows={3}
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-body shadow-xs transition-[border-color,box-shadow] duration-150 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-body-sm"
          {...register('description')}
        />
      </div>
      <div>
        <Label> {tAccount('permissions')} </Label>
        {permissionsQuery.isLoading && (
          <SkeletonRegion label={tAccount('loadingPermissions')} className="mb-3">
            <SkeletonText lines={3} />
          </SkeletonRegion>
        )}
        <div className="max-h-80 space-y-4 overflow-y-auto rounded-lg border p-3">
          {Array.from(grouped.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([resource, permissions]) => (
              <div key={resource}>
                <p className="mb-2 text-overline uppercase text-muted-foreground">
                  {tAccount.has(`resources.${resource}`) ? tAccount(`resources.${resource}`) : resource}
                </p>
                <div className="grid gap-1 sm:grid-cols-2">
                  {permissions.map((permission) => (
                    <label key={permission.id} className="flex min-h-9 items-center gap-2 text-body-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-input"
                        disabled={isProtected}
                        checked={isProtected || selected.includes(permission.id)}
                        onChange={() => toggle(permission.id)}
                      />
                      {tAccount.has(`permissionActions.${permission.action}`) ? tAccount(`permissionActions.${permission.action}`) : permission.action}
                    </label>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="sm:w-auto" onClick={onCancel}>
           {tAccount('cancel')} </Button>
        <Button type="submit" isLoading={isLoading} className="sm:w-auto">
          {role ? tAccount('saveChanges') : tAccount('createRole')}
        </Button>
      </div>
    </form>
  )
}
