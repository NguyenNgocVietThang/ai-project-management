import type { User } from '@/types/auth.types'

/** Phản chiếu kiểm tra `is_admin()` ở backend (app/services/phase2_common.py):
 * superuser luôn được tính là admin, ngược lại người dùng cần có role "Admin". */
export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false
  return user.is_superuser || user.roles.some((role) => role.name === 'Admin')
}
