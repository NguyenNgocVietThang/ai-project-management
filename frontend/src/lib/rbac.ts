import type { User } from '@/types/auth.types'

/** Mirrors the backend's `is_admin()` check (app/services/phase2_common.py):
 * superusers always count as admin, otherwise the user needs the "Admin" role. */
export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false
  return user.is_superuser || user.roles.some((role) => role.name === 'Admin')
}
