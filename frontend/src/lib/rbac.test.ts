import { describe, expect, it } from 'vitest'
import type { User } from '@/types/auth.types'
import { canViewInvestorPortal, isInvestorUser } from './rbac'

const user = (roles: string[], is_superuser = false) =>
  ({ id: 1, is_superuser, roles: roles.map((name, id) => ({ id, name })) }) as unknown as User

describe('rbac investor', () => {
  it('nhận diện role Investor', () => {
    expect(isInvestorUser(user(['Investor']))).toBe(true)
    expect(isInvestorUser(user(['PM']))).toBe(false)
    expect(isInvestorUser(null)).toBe(false)
  })

  it('investor và admin vào được cổng, PM thì không', () => {
    expect(canViewInvestorPortal(user(['Investor']))).toBe(true)
    expect(canViewInvestorPortal(user(['Admin']))).toBe(true)
    expect(canViewInvestorPortal(user([], true))).toBe(true)
    expect(canViewInvestorPortal(user(['PM']))).toBe(false)
  })
})
