import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine((password) => new TextEncoder().encode(password).length <= 72, {
    message: 'Password must not exceed 72 bytes',
  })
  .refine(
    (password) =>
      Array.from(password).some(
        (character) => /\p{N}/u.test(character) || !/[\p{L}\p{N}\s]/u.test(character)
      ),
    { message: 'Password must contain at least one number or special character' }
  )

export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  if (!password) return { score: 0, label: '', color: 'bg-muted' }

  let score = 0
  if (password.length >= 8) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-destructive' }
  if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-yellow-500' }
  return { score: 3, label: 'Strong', color: 'bg-emerald-500' }
}
