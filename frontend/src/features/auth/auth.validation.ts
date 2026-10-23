import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(12, 'passwordMustBeAtLeast12Characters')
  .refine((password) => new TextEncoder().encode(password).length <= 72, {
    message: 'passwordMustNotExceed72Bytes',
  })
  .refine(
    (password) =>
      Array.from(password).some(
        (character) => /\p{N}/u.test(character) || !/[\p{L}\p{N}\s]/u.test(character)
      ),
    { message: 'passwordMustContainAtLeastOneNumberOrSpecialCharacter' }
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

  if (score <= 1) return { score: 1, label: 'weak', color: 'bg-destructive' }
  if (score <= 3) return { score: 2, label: 'medium', color: 'bg-yellow-500' }
  return { score: 3, label: 'strong', color: 'bg-emerald-500' }
}
