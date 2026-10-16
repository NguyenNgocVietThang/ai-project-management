import type { User } from '@/types/auth.types'

/** Phản chiếu kiểm tra `is_admin()` ở backend (app/services/phase2_common.py):
 * superuser luôn được tính là admin, ngược lại người dùng cần có role "Admin". */
export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false
  return user.is_superuser || user.roles.some((role) => role.name === 'Admin')
}

/** Người dùng có role "Investor" (phản chiếu INVESTOR_ROLE ở backend investor_service.py). */
export function isInvestorUser(user: User | null | undefined): boolean {
  if (!user) return false
  return user.roles.some((role) => role.name === 'Investor')
}

/** Cổng /investor mở cho investor và admin; quyền xem từng portfolio vẫn do backend quyết. */
export function canViewInvestorPortal(user: User | null | undefined): boolean {
  return isInvestorUser(user) || isAdminUser(user)
}
