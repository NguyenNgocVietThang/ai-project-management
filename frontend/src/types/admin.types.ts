/** Mirrors backend app/schemas/admin.py */

import type { RoleSummary, User } from '@/types/auth.types'

// ─── Users ──────────────────────────────────────────────────────────────────

export interface AdminUser extends User {
  created_at: string
}

export interface AdminUserListParams {
  q?: string
  role_id?: number
  is_active?: boolean
  page?: number
  page_size?: number
}

export interface AdminUserCreate {
  email: string
  username: string
  full_name: string
  password: string
  role_ids: number[]
  is_active: boolean
}

export interface AdminUserUpdate {
  full_name?: string
  username?: string
  phone?: string | null
  position?: string | null
  department?: string | null
  is_active?: boolean
  is_superuser?: boolean
  role_ids?: number[]
}

// ─── Roles & Permissions ────────────────────────────────────────────────────

export interface Permission {
  id: number
  resource: string
  action: string
  description: string | null
}

export interface Role extends RoleSummary {
  permissions: Permission[]
  user_count: number
}

export interface RoleCreate {
  name: string
  description?: string | null
  permission_ids: number[]
}

export interface RoleUpdate {
  name?: string
  description?: string | null
  permission_ids?: number[]
}

// ─── Audit Log ──────────────────────────────────────────────────────────────

export interface AuditActor {
  id: number
  full_name: string
  email: string
}

export interface AuditLog {
  id: number
  user_id: number | null
  user: AuditActor | null
  action: string
  entity_type: string
  entity_id: number | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  ip_address: string | null
  description: string | null
  created_at: string
}

export interface AuditLogListParams {
  entity_type?: string
  user_id?: number
  action?: string
  date_from?: string
  date_to?: string
  page?: number
  page_size?: number
}
