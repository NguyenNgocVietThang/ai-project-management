'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
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
        <Alert variant="success">The built-in &quot;Admin&quot; role always has every permission and cannot be renamed.</Alert>
      )}
      <div>
        <Label htmlFor="role-name">Name</Label>
        <Input
          id="role-name"
          disabled={isProtected}
          hasError={Boolean(errors.name)}
          {...register('name')}
        />
        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="role-description">Description</Label>
        <textarea
          id="role-description"
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register('description')}
        />
      </div>
      <div>
        <Label>Permissions</Label>
        {permissionsQuery.isLoading && <p className="text-sm text-muted-foreground">Loading permissions…</p>}
        <div className="max-h-80 space-y-4 overflow-y-auto rounded-md border p-3">
          {Array.from(grouped.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([resource, permissions]) => (
              <div key={resource}>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {resource}
                </p>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {permissions.map((permission) => (
                    <label key={permission.id} className="flex min-h-[28px] items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-input"
                        disabled={isProtected}
                        checked={isProtected || selected.includes(permission.id)}
                        onChange={() => toggle(permission.id)}
                      />
                      {permission.action}
                    </label>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="sm:w-auto" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="sm:w-auto">
          {role ? 'Save changes' : 'Create role'}
        </Button>
      </div>
    </form>
  )
}
