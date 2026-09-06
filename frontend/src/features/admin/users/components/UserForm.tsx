'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import {
  createUserFormSchema,
  editUserFormSchema,
  type CreateUserFormValues,
  type EditUserFormValues,
} from '@/features/admin/users/users.validation'
import type { AdminUser, AdminUserCreate, AdminUserUpdate, Role } from '@/types/admin.types'

interface UserFormProps {
  user?: AdminUser
  roles: Role[]
  onSubmit: (body: AdminUserCreate | AdminUserUpdate) => Promise<void>
  onCancel: () => void
  isLoading: boolean
  error?: string | null
}

function RoleCheckboxes({
  roles,
  selected,
  onToggle,
}: {
  roles: Role[]
  selected: number[]
  onToggle: (roleId: number) => void
}) {
  return (
    <div>
      <Label>Roles</Label>
      <div className="grid gap-2 rounded-md border p-3 sm:grid-cols-2">
        {roles.map((role) => (
          <label key={role.id} className="flex min-h-[28px] items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              checked={selected.includes(role.id)}
              onChange={() => onToggle(role.id)}
            />
            {role.name}
          </label>
        ))}
      </div>
    </div>
  )
}

export function UserForm({ user, roles, onSubmit, onCancel, isLoading, error }: UserFormProps) {
  if (user) {
    return (
      <EditUserForm
        user={user}
        roles={roles}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isLoading={isLoading}
        error={error}
      />
    )
  }
  return (
    <CreateUserForm roles={roles} onSubmit={onSubmit} onCancel={onCancel} isLoading={isLoading} error={error} />
  )
}

function CreateUserForm({
  roles,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: Omit<UserFormProps, 'user'>) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: { email: '', username: '', full_name: '', password: '', is_active: true, role_ids: [] },
  })
  const selectedRoles = watch('role_ids')

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({ ...values } satisfies AdminUserCreate)
      })}
    >
      {error && <Alert>{error}</Alert>}
      <div>
        <Label htmlFor="user-email">Email</Label>
        <Input id="user-email" type="email" hasError={Boolean(errors.email)} {...register('email')} />
        {errors.email && <p id="user-email-error" role="alert" className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="user-username">Username</Label>
          <Input id="user-username" hasError={Boolean(errors.username)} {...register('username')} />
          {errors.username && <p id="user-username-error" role="alert" className="mt-1 text-sm text-destructive">{errors.username.message}</p>}
        </div>
        <div>
          <Label htmlFor="user-full-name">Full name</Label>
          <Input id="user-full-name" hasError={Boolean(errors.full_name)} {...register('full_name')} />
          {errors.full_name && <p id="user-full-name-error" role="alert" className="mt-1 text-sm text-destructive">{errors.full_name.message}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="user-password">Temporary password</Label>
        <Input id="user-password" type="password" hasError={Boolean(errors.password)} {...register('password')} />
        {errors.password && <p id="user-password-error" role="alert" className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
      </div>
      <RoleCheckboxes
        roles={roles}
        selected={selectedRoles}
        onToggle={(roleId) =>
          setValue(
            'role_ids',
            selectedRoles.includes(roleId)
              ? selectedRoles.filter((id) => id !== roleId)
              : [...selectedRoles, roleId]
          )
        }
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4 rounded border-input" {...register('is_active')} />
        Active immediately
      </label>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="sm:w-auto" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="sm:w-auto">
          Create user
        </Button>
      </div>
    </form>
  )
}

function EditUserForm({
  user,
  roles,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: UserFormProps & { user: AdminUser }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      full_name: user.full_name,
      username: user.username,
      phone: user.phone ?? '',
      position: user.position ?? '',
      department: user.department ?? '',
      is_active: user.is_active,
      is_superuser: user.is_superuser,
      role_ids: user.roles.map((role) => role.id),
    },
  })
  const selectedRoles = watch('role_ids')

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          ...values,
          phone: values.phone?.trim() || null,
          position: values.position?.trim() || null,
          department: values.department?.trim() || null,
        } satisfies AdminUserUpdate)
      })}
    >
      {error && <Alert>{error}</Alert>}
      <Alert variant="success" className="text-xs">
        {user.email}
      </Alert>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="user-username">Username</Label>
          <Input id="user-username" hasError={Boolean(errors.username)} {...register('username')} />
          {errors.username && <p id="user-username-error" role="alert" className="mt-1 text-sm text-destructive">{errors.username.message}</p>}
        </div>
        <div>
          <Label htmlFor="user-full-name">Full name</Label>
          <Input id="user-full-name" hasError={Boolean(errors.full_name)} {...register('full_name')} />
          {errors.full_name && <p id="user-full-name-error" role="alert" className="mt-1 text-sm text-destructive">{errors.full_name.message}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="user-phone">Phone</Label>
          <Input id="user-phone" {...register('phone')} />
        </div>
        <div>
          <Label htmlFor="user-position">Position</Label>
          <Input id="user-position" {...register('position')} />
        </div>
        <div>
          <Label htmlFor="user-department">Department</Label>
          <Input id="user-department" {...register('department')} />
        </div>
      </div>
      <RoleCheckboxes
        roles={roles}
        selected={selectedRoles}
        onToggle={(roleId) =>
          setValue(
            'role_ids',
            selectedRoles.includes(roleId)
              ? selectedRoles.filter((id) => id !== roleId)
              : [...selectedRoles, roleId]
          )
        }
      />
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 rounded border-input" {...register('is_active')} />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 rounded border-input" {...register('is_superuser')} />
          Superuser (bypasses all permission checks)
        </label>
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="sm:w-auto" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="sm:w-auto">
          Save changes
        </Button>
      </div>
    </form>
  )
}
